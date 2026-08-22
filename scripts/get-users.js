const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_DC6SKg3JtBrT@ep-shy-truth-aowsqo58-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function getUsersAndAutomations() {
  const client = new Client({ connectionString });
  await client.connect();
  const users = await client.query("SELECT id, username, business_account_id, groq_auto_reply_enabled, ai_context FROM users");
  console.log("USERS:", JSON.stringify(users.rows, null, 2));

  const aut = await client.query("SELECT id, user_id, name, trigger_source, trigger_type, trigger_value, is_active, response_content FROM automations");
  console.log("AUTOMATIONS:", JSON.stringify(aut.rows, null, 2));

  await client.end();
}

getUsersAndAutomations();
