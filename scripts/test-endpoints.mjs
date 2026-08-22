const urls = [
  "https://insta-auto-arr9b2dge-vistaratechs-projects.vercel.app",
  "https://insta-auto-5nw2n9yyn-vistaratechs-projects.vercel.app",
  "https://insta-auto.vercel.app",
  "https://insta-auto-vistaratechs-projects.vercel.app"
];

async function check() {
  for (const u of urls) {
    try {
      const res = await fetch(`${u}/api/automations?userId=test`, { method: "GET" });
      console.log(`URL: ${u} => status: ${res.status} ${res.statusText}`);
      if (res.status === 200 || res.status === 400 || res.status === 500) {
        const txt = await res.text();
        console.log(`  Response: ${txt.slice(0, 100)}`);
      }
    } catch (e) {
      console.log(`URL: ${u} => Error: ${e.message}`);
    }
  }
}

check();
