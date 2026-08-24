const https = require('https');

https.get('https://www.dmspark.in/_next/static/chunks/3b2565abd2827446.js', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const match = d.match(/https:\/\/www\.instagram\.com\/oauth\/authorize\?[^"']+/);
    if (match) {
      console.log('LIVE OAUTH URL:', match[0]);
    } else {
      console.log('No match in this chunk');
    }
  });
});
