async function testLocal() {
  try {
    const res = await fetch("http://localhost:3000/api/automations?userId=27043489642012264");
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Local API Returned:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Fetch error:", e.message);
  }
}
testLocal();
