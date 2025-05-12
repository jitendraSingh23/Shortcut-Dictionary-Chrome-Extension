// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addShortcut",
        title: "Add as Shortcut",
        contexts: ["selection"]
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addShortcut") {
        // Open popup and pass selected text
        chrome.storage.local.set({ 
            selectedText: info.selectionText 
        }, () => {
            chrome.action.openPopup();
        });
    }
});
