# 🤖 Natural Language to SQL Query Application

An intelligent Next.js application that converts natural language questions into SQL queries using AI and provides conversational responses about your data. Simply ask questions in plain English and get meaningful insights from your database!

## 🎯 What This App Does

This application bridges the gap between human language and database queries by:

1. **Understanding Natural Language**: Takes your questions in plain English
2. **Converting to SQL**: Uses AI to generate precise SQL queries
3. **Executing Queries**: Runs the SQL against a PostgreSQL database
4. **Providing Insights**: Returns results as conversational explanations

**Example**: 
- **You ask**: "How many users joined last month?"
- **AI generates**: `SELECT COUNT(*) FROM users WHERE "createdAt" >= '2024-05-01'`
- **AI responds**: "15 users joined last month, with most registrations happening in the first week..."

## 🏗️ How It Works (Step-by-Step Process)

### 1. **User Input Processing**
```
User types: "Show me expensive products" → Frontend validates input
```

### 2. **AI Query Generation**
```
Frontend sends to API → LLM analyzes request → Generates SQL query
```

### 3. **SQL Execution**
```
API executes SQL → PostgreSQL returns data → Results validated
```

### 4. **Response Generation**
```
Raw data → AI explains results → Conversational response returned
```

### 5. **UI Display**
```
User sees: AI explanation + Optional technical details
```

## 🔧 Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Next.js API    │    │   PostgreSQL    │
│   (React/TS)    │◄──►│    Routes        │◄──►│   Database      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌──────────────────┐             
         └─────────────►│   OpenRouter     │             
                        │   (DeepSeek AI)  │             
                        └──────────────────┘             
```

### **Core Components:**

- **Frontend (React/TypeScript)**: User interface for queries and results
- **API Layer (Next.js)**: Handles requests, AI integration, and database operations
- **LLM Service**: Converts natural language ↔ SQL and explains results
- **Database Layer (Prisma + PostgreSQL)**: Data storage and query execution

## 🗄️ Database Schema

The application includes a rich e-commerce dataset:

```sql
-- Users table (300 records)
users: id, email, name, age, city, "createdAt", "updatedAt"

-- Products table (100 records)  
products: id, name, price, category, description, "inStock", "createdAt", "updatedAt"

-- Orders table (500 records)
orders: id, "userId", status, total, "orderDate", "createdAt", "updatedAt"

-- Order Items table (1,563 records)
order_items: id, "orderId", "productId", quantity, price
```

**Sample Data Includes:**
- Users across 48 major US cities
- Products in 8 categories (Electronics, Sports, Books, etc.)
- Orders with realistic purchase patterns
- Various order statuses and date ranges

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ installed
- **Docker** (for PostgreSQL) or local PostgreSQL
- **OpenRouter API key** (for DeepSeek AI)

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd natural-language
npm install
```

### Step 2: Environment Configuration
Run the interactive setup:
```bash
npm run setup
```

Or manually create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/natural_language_db?schema=public"

# OpenRouter API Key  
OPENAI_API_KEY="sk-or-v1-your-openrouter-api-key"

# LLM Configuration
LLM_MODEL="deepseek/deepseek-chat"
LLM_TEMPERATURE=0.1
```

### Step 3: Database Setup

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL container
docker run --name postgres-nl -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=natural_language_db -p 5433:5432 -d postgres:15

# Generate Prisma client
npx prisma generate

# Run migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/natural_language_db?schema=public" npx prisma migrate dev --name init

# Seed with sample data
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/natural_language_db?schema=public" npm run db:seed
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb natural_language_db

# Update .env.local with your local credentials
# Then run:
npx prisma generate
npm run db:migrate  
npm run db:seed
```

### Step 4: Launch Application
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 💬 Usage Examples

### **User Analytics**
- *"How many users are from California?"*
- *"What's the average age of users in New York?"*
- *"Show me users who joined in 2023"*

### **Product Insights**  
- *"What are the most expensive Electronics products?"*
- *"Show me all out-of-stock items"*
- *"How many products cost between $50 and $200?"*

### **Sales Analysis**
- *"How many completed orders were there this year?"*
- *"Which user has placed the most orders?"*
- *"What's the total revenue from Electronics sales?"*

### **Complex Queries**
- *"Which products are most popular based on order quantity?"*
- *"Show me users from Texas who bought Sports products"*
- *"What's the average order value by city?"*

## 🎛️ Configuration & Customization

### **LLM Configuration**
Edit environment variables:
- `LLM_MODEL`: AI model to use (default: deepseek/deepseek-chat)
- `LLM_TEMPERATURE`: Response creativity (0.0-1.0, default: 0.1)

### **Custom Prompts**
Modify `src/lib/llm.ts` to:
- Add new database tables to the schema description
- Customize query generation rules
- Add domain-specific examples

### **Database Schema Updates**
1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Update seed data in `prisma/seed.ts`
4. Update LLM prompt with new schema

## 🔍 API Reference

### **POST /api/query**

**Request:**
```json
{
  "query": "How many users are from New York?"
}
```

**Response:**
```json
{
  "success": true,
  "naturalLanguageQuery": "How many users are from New York?",
  "generatedSQL": "SELECT COUNT(*) FROM users WHERE city = 'New York';",
  "results": [{"count": 8}],
  "count": 1,
  "explanation": "There are 8 users from New York in the database. This represents about 2.7% of all users..."
}
```

## 🛠️ Development

### **Project Structure**
```
src/
├── app/
│   ├── api/query/route.ts      # Main API endpoint
│   └── page.tsx                # Home page
├── components/
│   └── QueryInterface.tsx      # Main UI component
├── lib/
│   ├── prisma.ts              # Database client
│   └── llm.ts                 # AI service
prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Sample data generator
```

### **Available Scripts**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run setup       # Interactive environment setup
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with sample data
npm run db:studio   # Open Prisma Studio (database GUI)
```

## 🔒 Security Features

- **SQL Injection Protection**: Uses Prisma ORM with parameterized queries
- **Query Restrictions**: Only SELECT statements allowed
- **Input Validation**: Comprehensive request validation
- **Environment Security**: Sensitive data in environment variables
- **Error Handling**: Secure error messages without data exposure

## 🚨 Troubleshooting

### **Database Issues**
```bash
# Check PostgreSQL container
docker logs postgres-nl

# Restart database
docker restart postgres-nl

# Reset database
npx prisma migrate reset
npm run db:seed
```

### **API Issues**
- Verify OpenRouter API key is valid
- Check network connectivity
- Monitor browser console for errors
- Review terminal logs for detailed error messages

### **Build Issues**
```bash
# Regenerate Prisma client
npx prisma generate

# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🌟 Key Features

- ✅ **Natural Language Processing** with DeepSeek AI
- ✅ **Conversational Responses** instead of raw data
- ✅ **Rich Sample Dataset** (2,463 records)
- ✅ **Real-time Query Execution**
- ✅ **Responsive Modern UI**
- ✅ **Comprehensive Error Handling**
- ✅ **Collapsible Technical Details**
- ✅ **Interactive Setup Process**

## 📈 Future Enhancements

- [ ] Support for UPDATE/INSERT operations
- [ ] Query history and favorites
- [ ] Data visualization charts
- [ ] Multiple database connections
- [ ] Custom schema import
- [ ] Advanced analytics dashboard

## 📝 License

This project is for educational and demonstration purposes. Feel free to use and modify for your own projects!

---

**Made with ❤️ using Next.js, PostgreSQL, and AI**
