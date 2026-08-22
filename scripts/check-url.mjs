import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const lines = envContent.split(/\r?\n/);
lines.forEach(l => {
  const [k, ...v] = l.split('=');
  if (k.trim() === 'DATABASE_URL') {
    const val = v.join('=').trim();
    console.log('DATABASE_URL starts with:', val.substring(0, 15) + '... length:', val.length);
    // Parse protocol and host
    try {
      const u = new URL(val.replace(/^"/, '').replace(/"$/, ''));
      console.log('Protocol:', u.protocol, 'Host:', u.host, 'Pathname:', u.pathname);
    } catch (e) {
      console.log('URL parse error:', e.message);
    }
  }
});
