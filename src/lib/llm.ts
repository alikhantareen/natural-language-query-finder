import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Site URL for rankings on openrouter.ai
    'X-Title': 'Natural Language to SQL App', // Site title for rankings on openrouter.ai
  },
});

// Configurable prompt for natural language to SQL conversion
const DEFAULT_SYSTEM_PROMPT = `You are a PostgreSQL expert. Convert natural language queries to PostgreSQL SQL statements.

Database Schema:
- users table: id (int), email (string), name (string), age (int), city (string), "createdAt" (timestamp), "updatedAt" (timestamp)
- products table: id (int), name (string), price (decimal), category (string), description (string), "inStock" (boolean), "createdAt" (timestamp), "updatedAt" (timestamp)
- orders table: id (int), "userId" (int), status (string), total (decimal), "orderDate" (timestamp), "createdAt" (timestamp), "updatedAt" (timestamp)
- order_items table: id (int), "orderId" (int), "productId" (int), quantity (int), price (decimal)

IMPORTANT: Column names with camelCase must be quoted with double quotes in SQL queries!

Rules:
1. Only return valid PostgreSQL SELECT statements
2. Use proper table names and column names as defined in the schema
3. Quote camelCase column names with double quotes (e.g., "createdAt", "userId", "orderDate")
4. Use appropriate JOINs when querying multiple tables
5. Include proper WHERE clauses for filtering
6. Use LIMIT clause when appropriate
7. Return only the SQL query, no explanations or formatting
8. Do not use any DDL statements (CREATE, DROP, ALTER, etc.)
9. Do not use any DML statements other than SELECT

Examples:
- "Show all users" → SELECT * FROM users;
- "Find products under $100" → SELECT * FROM products WHERE price < 100;
- "Show orders for John Doe" → SELECT o.* FROM orders o JOIN users u ON o."userId" = u.id WHERE u.name = 'John Doe';
- "When did Jane Smith join?" → SELECT name, "createdAt" FROM users WHERE name = 'Jane Smith';`;

export interface LLMConfig {
  model?: string;
  temperature?: number;
  systemPrompt?: string;
}

export class LLMService {
  private model: string;
  private temperature: number;
  private systemPrompt: string;

  constructor(config: LLMConfig = {}) {
    this.model = config.model || process.env.LLM_MODEL || 'deepseek/deepseek-chat';
    this.temperature = config.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.1');
    this.systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  }

  async convertToSQL(naturalLanguageQuery: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        temperature: this.temperature,
        messages: [
          {
            role: 'system',
            content: this.systemPrompt,
          },
          {
            role: 'user',
            content: naturalLanguageQuery,
          },
        ],
      });

      const sql = response.choices[0]?.message?.content?.trim();
      
      if (!sql) {
        throw new Error('No SQL query generated');
      }

      // Basic validation - ensure it's a SELECT statement
      if (!sql.toLowerCase().startsWith('select')) {
        throw new Error('Only SELECT statements are allowed');
      }

      return sql;
    } catch (error) {
      console.error('LLM conversion error:', error);
      throw new Error(`Failed to convert natural language to SQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  updateConfig(config: Partial<LLMConfig>): void {
    if (config.model !== undefined) this.model = config.model;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.systemPrompt !== undefined) this.systemPrompt = config.systemPrompt;
  }

  async explainResults(resultSummary: {
    originalQuery: string;
    sqlQuery: string;
    resultCount: number;
    sampleData: any[];
    columns: string[];
  }): Promise<string> {
    try {
      const prompt = `You are a helpful AI assistant that explains database query results in natural language.

Original user question: "${resultSummary.originalQuery}"
SQL query executed: ${resultSummary.sqlQuery}
Number of results: ${resultSummary.resultCount}
Column names: ${resultSummary.columns.join(', ')}
Sample data: ${JSON.stringify(resultSummary.sampleData, null, 2)}

Please provide a clear, conversational explanation of these results as if you're talking to a human. 
- Start with a direct answer to their question
- Include relevant details from the data
- Format dates and numbers in a human-readable way
- Be conversational and helpful
- Keep it concise but informative

Do not mention the SQL query or technical details unless specifically relevant.`;

      const response = await openai.chat.completions.create({
        model: this.model,
        temperature: 0.3, // Slightly higher temperature for more natural responses
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const explanation = response.choices[0]?.message?.content?.trim();
      
      if (!explanation) {
        throw new Error('No explanation generated');
      }

      return explanation;
    } catch (error) {
      console.error('Result explanation error:', error);
      throw new Error(`Failed to generate result explanation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getConfig(): LLMConfig {
    return {
      model: this.model,
      temperature: this.temperature,
      systemPrompt: this.systemPrompt,
    };
  }
}

// Export a default instance
export const llmService = new LLMService(); 