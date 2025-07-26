const axios = require('axios');

const CLIENT_ID = "Iv1.b507a08c87ecfe98";
const DEVICE_CODE_URL = "https://github.com/login/device/code";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const COPILOT_API_KEY_URL = "https://api.github.com/copilot_internal/v2/token";

const HEADERS = {
  Accept: "application/json",
  "User-Agent": "GitHubCopilotChat/0.26.7"
};

async function getDeviceCode() {
  console.log("Requesting device code from GitHub...");
  const res = await axios.post(DEVICE_CODE_URL, {
    client_id: CLIENT_ID,
    scope: "read:user"
  }, { headers: HEADERS });
  return res.data;
}

async function pollForAccessToken(device_code, interval, expires_in) {
  console.log("Waiting for user to authorize...");
  const totalTries = Math.floor(expires_in / interval);
  
  for (let i = 0; i < totalTries; i++) {
    await new Promise(resolve => setTimeout(resolve, interval * 1000));

    try {
      const res = await axios.post(ACCESS_TOKEN_URL, {
        client_id: CLIENT_ID,
        device_code: device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
      }, { headers: HEADERS });

      if (res.data.access_token) {
        return res.data.access_token;
      } else if (res.data.error === "authorization_pending") {
        continue;
      } else {
        throw new Error(`Authorization failed: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
      console.warn("Polling error:", err.message);
    }
  }
  throw new Error("Authorization timed out.");
}

async function getCopilotToken(access_token) {
  console.log("Retrieving Copilot API token...");
  const headers = {
    ...HEADERS,
    Authorization: `Bearer ${access_token}`,
    "Editor-Version": "vscode/1.99.3",
    "Editor-Plugin-Version": "copilot-chat/0.26.7"
  };

  const res = await axios.get(COPILOT_API_KEY_URL, { headers });
  return res.data.token;
}

async function main() {
  try {
    const deviceInfo = await getDeviceCode();
    console.log(`\n👉 Visit ${deviceInfo.verification_uri} and enter code: ${deviceInfo.user_code}\n`);

    const accessToken = await pollForAccessToken(
      deviceInfo.device_code,
      deviceInfo.interval || 5,
      deviceInfo.expires_in || 900
    );

    const copilotToken = await getCopilotToken(accessToken);
    console.log("\n✅ GitHub Copilot API Key:");
    console.log(copilotToken);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
