import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { llmService } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Convert natural language to SQL using LLM
    let sqlQuery: string;
    try {
      sqlQuery = await llmService.convertToSQL(query);
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Failed to parse natural language query',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 400 }
      );
    }

    // Execute the SQL query
    let results: Record<string, unknown>[];
    try {
      results = await prisma.$queryRawUnsafe(sqlQuery);
    } catch (error) {
      console.error('SQL execution error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to execute SQL query',
          sql: sqlQuery,
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Generate natural language explanation of the results
    let explanation: string = '';
    try {
      if (results.length > 0) {
        // Create a summary of the results for the LLM
        const resultSummary = {
          originalQuery: query,
          sqlQuery: sqlQuery,
          resultCount: results.length,
          sampleData: results.slice(0, 3), // First 3 rows as sample
          columns: Object.keys(results[0])
        };

        explanation = await llmService.explainResults(resultSummary);
      } else {
        explanation = `I couldn't find any results for "${query}". This might mean there's no data matching your criteria in the database.`;
      }
    } catch (error) {
      console.error('Result explanation error:', error);
      explanation = `I found ${results.length} result${results.length !== 1 ? 's' : ''} for your query "${query}".`;
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      naturalLanguageQuery: query,
      generatedSQL: sqlQuery,
      results: results,
      count: results.length,
      explanation: explanation
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 