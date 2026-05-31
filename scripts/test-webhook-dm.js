const crypto = require("crypto");

const payload = {
  "object": "instagram",
  "entry": [
    {
      "id": "17841435476975400",
      "time": 1610492985,
      "messaging": [
        {
          "sender": {
            "id": "123456789"
          },
          "recipient": {
            "id": "17841435476975400"
          },
          "timestamp": 1610492985,
          "message": {
            "mid": "mid.123456789",
            "text": "testdm"
          }
        }
      ]
    }
  ]
};

const rawBody = JSON.stringify(payload);
const appSecret = "e53001ba8a8552230c8743f548f77d1c"; // from .env
const signature = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

fetch("https://insta-auto-ebon.vercel.app/api/instagram/webhook", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "x-hub-signature-256": signature
  },
  body: rawBody
})
.then(res => res.text().then(t => console.log(res.status, t)))
.catch(err => console.error(err));
