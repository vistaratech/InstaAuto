const payload = {
  "object": "instagram",
  "entry": [
    {
      "id": "17841435476975400",
      "time": 1610492985,
      "changes": [
        {
          "field": "comments",
          "value": {
            "id": "17873440459141021",
            "text": "ok",
            "from": {
              "id": "123456789",
              "username": "testuser"
            },
            "media": {
              "id": "17841435476975401"
            }
          }
        }
      ]
    }
  ]
};

fetch("https://insta-auto-ebon.vercel.app/api/instagram/webhook", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
.then(res => res.text().then(t => console.log(res.status, t)))
.catch(err => console.error(err));
