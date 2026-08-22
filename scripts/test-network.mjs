async function testNetwork() {
  try {
    const res = await fetch("http://172.20.10.2:3000/api/automations?userId=27043489642012264");
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Automations count:", data.length);
    console.log("First automation:", data[0]?.name);
  } catch (e) {
    console.log("ERROR - Backend not reachable at 172.20.10.2:3000:", e.message);
  }
}
testNetwork();
