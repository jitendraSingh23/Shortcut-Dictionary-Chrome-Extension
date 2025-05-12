# Shortcut Dictionary Chrome Extension

A Chrome extension that helps you create text shortcuts for frequently used phrases, boilerplates, or templates. Type your shortcut and it automatically expands to your pre-defined text.

## Features

- **Quick Text Expansion**: Convert short text triggers into longer snippets
- **Context Menu Integration**: Right-click on selected text to create shortcuts
- **Import/Export**: Backup and restore your shortcuts
- **Works Everywhere**: Functions in any text input or textarea on any website
- **Modern UI**: Clean and intuitive interface

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

### Adding Shortcuts
1. Click the extension icon in Chrome toolbar
2. Enter your shortcut trigger (e.g., "//name")
3. Enter the replacement text
4. Click Save

### Quick Add from Context Menu
1. Select any text on a webpage
2. Right-click and choose "Add as Shortcut"
3. Enter your desired shortcut trigger
4. Save it

### Using Shortcuts
Simply type your shortcut anywhere and it will automatically expand to your defined text.

### Backup & Restore
- Click "Export" to download your shortcuts as JSON
- Click "Import" to restore shortcuts from a backup file

## File Structure

```
autofill/
├── manifest.json
├── popup.html
├── popup.js
├── style.css
├── content.js
└── background.js
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project however you'd like.
