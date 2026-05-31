const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_DC6SKg3JtBrT@ep-shy-truth-aowsqo58-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function inspect() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("=== USERS ===");
    const usersRes = await client.query("SELECT id, username, business_account_id, page_id, groq_auto_reply_enabled, access_token IS NOT NULL as has_token FROM users");
    console.log(usersRes.rows);

    console.log("\n=== AUTOMATIONS ===");
    const autRes = await client.query("SELECT id, user_id, name, trigger_type, trigger_value, trigger_source, is_active FROM automations");
    console.log(autRes.rows);

    console.log("\n=== RECENT MESSAGES ===");
    const msgRes = await client.query("SELECT id, conversation_id, sender_username, content, created_at, is_from_instagram FROM messages ORDER BY created_at DESC LIMIT 5");
    console.log(msgRes.rows);

  } catch (err) {
    console.error("Error inspecting database:", err.message);
  } finally {
    await client.end();
  }
}

inspect();
