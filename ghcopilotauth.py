import time
import requests

CLIENT_ID = "Iv1.b507a08c87ecfe98"
DEVICE_CODE_URL = "https://github.com/login/device/code"
ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
COPILOT_API_KEY_URL = "https://api.github.com/copilot_internal/v2/token"
HEADERS = {
    "Accept": "application/json",
    "User-Agent": "GitHubCopilotChat/0.26.7",
}

def get_device_code():
    print("Requesting device code from GitHub...")
    response = requests.post(
        DEVICE_CODE_URL,
        headers=HEADERS,
        json={
            "client_id": CLIENT_ID,
            "scope": "read:user"
        }
    )
    response.raise_for_status()
    return response.json()

def poll_for_access_token(device_code, interval, expires_in):
    print("Waiting for user to authorize...")
    for _ in range(int(expires_in / interval)):
        time.sleep(interval)
        response = requests.post(
            ACCESS_TOKEN_URL,
            headers=HEADERS,
            json={
                "client_id": CLIENT_ID,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            },
        )
        if response.status_code != 200:
            continue

        data = response.json()
        if "access_token" in data:
            return data["access_token"]
        elif data.get("error") == "authorization_pending":
            continue
        else:
            raise Exception(f"Authorization failed: {data}")
    raise TimeoutError("Authorization timed out.")

def get_copilot_token(access_token):
    print("Retrieving Copilot API token...")
    headers = {
        **HEADERS,
        "Authorization": f"Bearer {access_token}",
        "Editor-Version": "vscode/1.99.3",
        "Editor-Plugin-Version": "copilot-chat/0.26.7",
    }
    response = requests.get(COPILOT_API_KEY_URL, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data["token"]

def main():
    device_info = get_device_code()
    print(f"\n👉 Visit {device_info['verification_uri']} and enter code: {device_info['user_code']}\n")

    access_token = poll_for_access_token(
        device_info["device_code"],
        device_info.get("interval", 5),
        device_info.get("expires_in", 900),
    )

    copilot_token = get_copilot_token(access_token)
    print("\n✅ GitHub Copilot API Key:")
    print(copilot_token)

if __name__ == "__main__":
    main()
