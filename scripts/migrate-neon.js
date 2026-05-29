const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually load .env file to extract DATABASE_URL securely
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not defined in the .env file.');
  process.exit(1);
}

async function runSQLFile(client, filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Running SQL file: ${fileName}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File ${fileName} does not exist. Skipping.`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  try {
    await client.query(content);
    console.log(`✅ Successfully executed: ${fileName}`);
  } catch (err) {
    // Standard PG error codes:
    // 42P07: duplicate_table
    // 42710: duplicate_object (constraint already exists)
    // 42701: duplicate_column (column already exists)
    const ignorableCodes = ['42P07', '42710', '42701'];
    
    if (ignorableCodes.includes(err.code)) {
      console.log(`⚠️ Note: Some elements in ${fileName} already exist, skipping them gracefully. (${err.message})`);
    } else if (content.includes('storage.buckets') || content.includes('storage.objects')) {
      console.log('⚠️ Note: Supabase storage schemas/policies are not applicable to a standard Neon database.');
    } else {
      console.error(`❌ Error executing ${fileName}:`, err.message);
      throw err;
    }
  }
}

async function main() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // List of core schema and migration files to run sequentially
    const migrations = [
      path.join(__dirname, '..', 'db'), // Consolidated core schema
      path.join(__dirname, '..', 'migrations', '04-content-rotator.sql'), // Content rotator/scheduler tables
      path.join(__dirname, '..', 'migrations', '07-add-thumbnail-column.sql'), // Thumbnail column migration
      path.join(__dirname, '..', 'migrations', '08-add-groq-auto-reply.sql'), // Groq auto-reply flag
      path.join(__dirname, '..', 'migrations', '09-add-ai-context.sql'), // AI context column
      path.join(__dirname, '..', 'migrations', 'add_trigger_source.sql'), // Trigger source column & data migration
    ];

    for (const migrationPath of migrations) {
      await runSQLFile(client, migrationPath);
    }

    console.log('\n🎉 Database migrations completed successfully on Neon!');
  } catch (error) {
    console.error('\n💥 Migration execution failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from Neon PostgreSQL.');
  }
}

main();
