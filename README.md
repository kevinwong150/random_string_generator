# Random String Generator

A Chrome Extension and Firefox Addon for generating random strings with customizable length and seed.

## Features

- 🎲 Generate random strings with a single click
- 📋 Automatically copy generated strings to clipboard
- ⚙️ Customizable string length (default: 32 characters)
- 🌱 Optional seed for reproducible random strings
- 🎨 Modern, clean UI with gradient design
- 🐳 Docker support for easy deployment

## Installation

### Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the directory containing the extension files
5. The extension icon will appear in your toolbar

### Firefox Addon

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the extension directory
4. The extension icon will appear in your toolbar

## Usage

### Generate Random String

1. Click the extension icon in your browser toolbar
2. Click the "Generate" button
3. The random string will appear below the button and be automatically copied to your clipboard
4. A notification will confirm the copy action

### Configure Settings

1. Click the extension icon
2. Click the "Settings" link at the bottom
3. Configure:
   - **String Length**: Set the number of characters (1-1000, default: 32)
   - **Seed**: Optional seed for reproducible random strings (leave empty for truly random)
4. Click "Save Settings"

## Docker Deployment

Run the extension files in a web server using Docker:

```bash
docker-compose up
```

This will start a web server on `http://localhost:8080` where you can view the extension files and documentation.

## Development

### Project Structure

```
.
├── manifest.json       # Extension manifest
├── popup.html         # Main popup UI
├── popup.js           # Popup logic and random string generation
├── settings.html      # Settings page UI
├── settings.js        # Settings page logic
├── background.js      # Background service worker
├── styles.css         # Shared styles
├── icons/            # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── Dockerfile        # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

### Technologies

- Vanilla JavaScript (no dependencies)
- Chrome Extension Manifest V3
- Firefox WebExtensions API
- Docker & Docker Compose

### Random String Generation

The extension uses two methods for random string generation:

1. **Crypto Random** (default): Uses `crypto.getRandomValues()` for cryptographically secure random strings
2. **Seeded Random**: Uses a mulberry32 algorithm for reproducible random strings when a seed is provided

## License

MIT License