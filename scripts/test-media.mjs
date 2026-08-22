async function testMedia() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/instagram/media?userId=27043489642012264");
    console.log("Media status:", res.status);
    const data = await res.json();
    console.log("Media count:", data.data?.length);
    if (data.data?.length > 0) {
      console.log("First media item:", JSON.stringify(data.data[0], null, 2));
    } else {
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}
testMedia();
