const { Client } = require('pg');
const c = new Client({ connectionString: 'postgresql://neondb_owner:npg_DC6SKg3JtBrT@ep-shy-truth-aowsqo58-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

c.connect()
  .then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
  .then(r => {
    console.log('Tables:', r.rows.map(x => x.table_name).join(', '));
    c.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    c.end();
  });
