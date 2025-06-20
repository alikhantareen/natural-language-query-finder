#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Natural Language to SQL Setup');
console.log('================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    console.log('This script will help you set up your environment variables.\n');

    // Check if .env.local already exists
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    // Get database configuration
    console.log('📊 Database Configuration');
    console.log('------------------------');
    
    const dbHost = await askQuestion('Database host (localhost): ') || 'localhost';
    const dbPort = await askQuestion('Database port (5432): ') || '5432';
    const dbUser = await askQuestion('Database username: ');
    const dbPassword = await askQuestion('Database password: ');
    const dbName = await askQuestion('Database name (natural_language_db): ') || 'natural_language_db';

    // Get OpenAI configuration
    console.log('\n🤖 OpenAI Configuration');
    console.log('----------------------');
    
    const openaiKey = await askQuestion('OpenAI API Key: ');
    const llmModel = await askQuestion('LLM Model (gpt-3.5-turbo): ') || 'gpt-3.5-turbo';
    const temperature = await askQuestion('Temperature (0.1): ') || '0.1';

    // Create environment file content
    const envContent = `# Database
DATABASE_URL="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public"

# OpenAI API Key
OPENAI_API_KEY="${openaiKey}"

# LLM Configuration
LLM_MODEL="${llmModel}"
LLM_TEMPERATURE=${temperature}
`;

    // Write the file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment configuration saved to .env.local');
    console.log('\n📋 Next Steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Create the database if it doesn\'t exist:');
    console.log(`   createdb ${dbName}`);
    console.log('3. Run database migrations:');
    console.log('   npm run db:migrate');
    console.log('4. Seed the database:');
    console.log('   npm run db:seed');
    console.log('5. Start the application:');
    console.log('   npm run dev');
    
    console.log('\n🌟 Your Natural Language to SQL app will be ready at http://localhost:3000');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

main(); 