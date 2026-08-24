const fs = require('fs');
const https = require('https');

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
let token = '';
for (const l of lines) {
  if (l.startsWith('INSTAGRAM_WEBHOOK_VERIFY_TOKEN=')) {
    token = l.split('=')[1].trim().replace(/^["']|["']$/g, '');
    break;
  }
}

console.log('Testing with token from .env.local (length:', token.length, ')');

const url = `https://www.dmspark.in/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=test_12345`;

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response Body:', data);
    if (data === 'test_12345') {
      console.log('SUCCESS! The token in .env.local is accepted by live server!');
    }
  });
});
