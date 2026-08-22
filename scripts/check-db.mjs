import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
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
}

loadEnv();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const usersRes = await pool.query('SELECT id, username, business_account_id, groq_auto_reply_enabled FROM public.users');
    console.log('--- USERS IN DATABASE ---');
    console.log(JSON.stringify(usersRes.rows, null, 2));

    const autoRes = await pool.query('SELECT id, user_id, name, trigger_source, trigger_type, trigger_value, is_active FROM public.automations');
    console.log('--- AUTOMATIONS IN DATABASE ---');
    console.log(JSON.stringify(autoRes.rows, null, 2));
    
    await pool.end();
  } catch (err) {
    console.error('DB Query Error:', err);
    await pool.end();
  }
}

run();
