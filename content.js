let shortcuts = {};

// Load shortcuts when content script starts
chrome.storage.sync.get(['shortcuts'], (result) => {
    shortcuts = result.shortcuts || {};
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.shortcuts) {
        shortcuts = changes.shortcuts.newValue || {};
    }
});

// Check and replace shortcuts
function checkForShortcut(element) {
    const cursorPosition = element.selectionStart;
    const text = element.value;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    for (const [shortcut, replacement] of Object.entries(shortcuts)) {
        // Check if shortcut exists in current line
        if (currentLine.includes(shortcut)) {
            const startPos = text.lastIndexOf(shortcut, cursorPosition);
            if (startPos !== -1) {
                const newText = text.substring(0, startPos) + 
                               replacement + 
                               text.substring(startPos + shortcut.length);
                element.value = newText;
                
                // Set cursor position after replacement
                const newPosition = startPos + replacement.length;
                element.selectionStart = element.selectionEnd = newPosition;
                return true;
            }
        }
    }
    return false;
}

// Monitor all key presses
document.addEventListener('keyup', (e) => {
    if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;
    checkForShortcut(e.target);
});

// Handle paste events
document.addEventListener('paste', (e) => {
    if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;
    setTimeout(() => checkForShortcut(e.target), 0);
});

// Remove the previous keydown event listener and use input event
document.addEventListener('input', (e) => {
    if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;
    checkForShortcut(e.target);
});
