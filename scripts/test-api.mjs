async function testApi() {
  const base = "https://insta-auto-vistaratechs-projects.vercel.app";
  const res = await fetch(`${base}/api/automations?userId=123`);
  console.log("Status:", res.status);
  console.log("Headers content-type:", res.headers.get("content-type"));
  const text = await res.text();
  console.log("Body:", text.slice(0, 500));
}

testApi();
