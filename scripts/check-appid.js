const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
for (const l of lines) {
  if (l.includes('APP_ID') || l.includes('REDIRECT_URI')) {
    console.log(l);
  }
}
