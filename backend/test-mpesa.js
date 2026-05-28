const axios = require('axios');

const key = 'Z4jaa9S5VODilantMELNPdEy0MKGt9QCgi85GhfHc9pxhoTx';
const secret = 'xwSGPLoTJ9KjATfFdQ8xOHr33r5nkXcb7UrfPHlh9FGlEMH6q9K2LyOoNSLnmDTZ';
const auth = Buffer.from(`${key.trim()}:${secret.trim()}`).toString('base64');

axios({
    method: 'get',
    url: 'https://safaricom.co.ke',
    params: { grant_type: 'client_credentials' }, // Passes variables cleanly
    headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
    }
})
.then(res => console.log("✅ SUCCESS! Token:", res.data.access_token))
.catch(err => {
    if (err.response) {
        console.error("❌ DARAJA SYSTEM ERROR:", err.response.status, err.response.data);
    } else {
        console.error("❌ FIREWALL BLOCKED OUTRIGHT:", err.message);
    }
});
