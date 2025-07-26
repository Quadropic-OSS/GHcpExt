# GitHub Copilot Authentication Tool

> **⚠️ Warning & Disclaimer**
>
> This project is **not an official method** for obtaining GitHub Copilot tokens and is not affiliated with or endorsed by GitHub. It is provided for educational and community purposes only. Use of this tool is at your own risk and discretion. The code is inspired by [sst/opencode](https://github.com/sst/opencode/blob/dev/packages/opencode/src/auth/github-copilot.ts). If you are not satisfied with the official GitHub Copilot UX or agent, this method demonstrates how to use the model with other UIs or tools or agents. **Do not use this for any production, legal, or intellectual property-sensitive applications.** The client app does not perform any additional actions beyond authentication. We take no responsibility for any misuse or consequences arising from the use of this code.

A simple tool to authenticate with GitHub and retrieve a Copilot API token using the OAuth Device Flow. This project provides both Python and Node.js implementations for maximum flexibility.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Python Version](#python-version)
  - [Node.js Version](#nodejs-version)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This tool implements GitHub's OAuth Device Flow to authenticate users and obtain a GitHub Copilot API token. The device flow is particularly useful for CLI applications and headless environments where traditional web-based OAuth flows are not suitable.

The authentication process involves:
1. Requesting a device code from GitHub
2. Prompting the user to visit GitHub and enter the device code
3. Polling GitHub for an access token
4. Using the access token to retrieve a Copilot API token

## ✨ Features

- **Dual Implementation**: Available in both Python and Node.js
- **OAuth Device Flow**: Secure authentication without requiring a web server
- **User-Friendly**: Clear instructions and progress indicators
- **Error Handling**: Comprehensive error handling and timeout management
- **GitHub Copilot Integration**: Direct integration with GitHub Copilot's internal API

## 📋 Prerequisites

### For Python Version
- Python 3.6 or higher
- `requests` library

### For Node.js Version
- Node.js 12.0 or higher
- `axios` library

## 🚀 Installation

### Clone the Repository
```bash
git clone <repository-url>
cd ghcopilot-test
```

### Python Setup
```bash
# Install required Python packages
pip install requests
```

### Node.js Setup
```bash
# Install required Node.js packages
npm install
```

## 📖 Usage

### Python Version

Run the Python script:
```bash
python ghcopilotauth.py
```

### Node.js Version

Run the Node.js script:
```bash
node ghcopilotauth.js
```

### Expected Output

Both versions will provide similar output:

```
Requesting device code from GitHub...

👉 Visit https://github.com/login/device and enter code: XXXX-XXXX

Waiting for user to authorize...
Retrieving Copilot API token...

✅ GitHub Copilot API Key:
gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Authentication Steps

1. **Run the Script**: Execute either the Python or Node.js version
2. **Visit GitHub**: Open the provided URL in your browser
3. **Enter Code**: Input the displayed device code
4. **Authorize**: Grant the requested permissions
5. **Wait**: The script will automatically detect authorization and retrieve your token

## 🔧 How It Works

### 1. Device Code Request
The script requests a device code from GitHub's OAuth device endpoint:
- **Endpoint**: `https://github.com/login/device/code`
- **Client ID**: `Iv1.b507a08c87ecfe98` (GitHub Copilot's official client ID)
- **Scope**: `read:user` (minimal permissions required)

### 2. User Authorization
GitHub returns:
- `device_code`: Used for polling
- `user_code`: User enters this on GitHub
- `verification_uri`: Where user goes to authorize
- `expires_in`: How long the codes are valid
- `interval`: How often to poll for results

### 3. Token Polling
The script polls GitHub's access token endpoint until:
- User authorizes (returns access token)
- User denies (returns error)
- Request times out

### 4. Copilot Token Retrieval
Using the access token, the script requests a Copilot-specific token from:
- **Endpoint**: `https://api.github.com/copilot_internal/v2/token`
- **Headers**: Includes editor version information for compatibility

## 🌐 API Endpoints

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `https://github.com/login/device/code` | Request device code | POST |
| `https://github.com/login/oauth/access_token` | Exchange device code for access token | POST |
| `https://api.github.com/copilot_internal/v2/token` | Get Copilot API token | GET |

## 🔒 Security Considerations

### Important Notes

- **Client ID**: Uses GitHub Copilot's official client ID (`Iv1.b507a08c87ecfe98`)
- **Token Storage**: Tokens are only printed to console - implement secure storage for production use
- **Scope Limitation**: Only requests `read:user` permissions
- **HTTPS Only**: All API calls use HTTPS for secure communication

### Best Practices

1. **Secure Storage**: Never store tokens in plain text files
2. **Environment Variables**: Use environment variables for sensitive configuration
3. **Token Rotation**: Implement token refresh mechanisms for long-lived applications
4. **Access Control**: Limit who can access and execute these scripts

## 🐛 Troubleshooting

### Common Issues

#### "Authorization timed out"
- **Cause**: User didn't authorize within the timeout period (usually 15 minutes)
- **Solution**: Run the script again and authorize promptly

#### "Authorization failed"
- **Cause**: User denied the authorization request
- **Solution**: Run the script again and approve the authorization

#### Network Errors
- **Cause**: Network connectivity issues or GitHub API unavailability
- **Solution**: Check internet connection and try again

#### Python: "ModuleNotFoundError: No module named 'requests'"
- **Cause**: Missing required Python package
- **Solution**: Install with `pip install requests`

#### Node.js: "Cannot find module 'axios'"
- **Cause**: Missing required Node.js package
- **Solution**: Install with `npm install axios`

### Debug Mode

For additional debugging, you can modify the scripts to include more verbose logging:

**Python**: Add `import logging; logging.basicConfig(level=logging.DEBUG)`
**Node.js**: Set environment variable `DEBUG=axios` before running

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the [MIT License](./LICENSE).
Please ensure compliance with GitHub's Terms of Service and API usage guidelines.

## ⚠️ Disclaimer

This tool uses GitHub Copilot's internal API endpoints. These endpoints are subject to change without notice, and this tool is provided as-is for educational purposes. For production use, consider using official GitHub APIs and authentication methods.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Note**: This tool is not officially affiliated with GitHub or GitHub Copilot. Use responsibly and in accordance with GitHub's Terms of Service.
