document.addEventListener('DOMContentLoaded', () => {
    const shortcutInput = document.getElementById('shortcut');
    const replacementInput = document.getElementById('replacement');
    const saveButton = document.getElementById('saveBtn');
    const shortcutList = document.getElementById('shortcutList');

    // Load existing shortcuts
    loadShortcuts();

    // Check for selected text from context menu
    chrome.storage.local.get(['selectedText'], (result) => {
        if (result.selectedText) {
            replacementInput.value = result.selectedText;
            chrome.storage.local.remove(['selectedText']);
        }
    });

    // Save shortcut
    saveButton.addEventListener('click', () => {
        const shortcut = shortcutInput.value.trim();
        const replacement = replacementInput.value.trim();
        
        if (shortcut && replacement) {
            chrome.storage.sync.get(['shortcuts'], (result) => {
                const shortcuts = result.shortcuts || {};
                shortcuts[shortcut] = replacement;
                
                chrome.storage.sync.set({ shortcuts }, () => {
                    loadShortcuts();
                    shortcutInput.value = '';
                    replacementInput.value = '';
                });
            });
        }
    });

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', () => {
        chrome.storage.sync.get(['shortcuts'], (result) => {
            const shortcuts = result.shortcuts || {};
            const blob = new Blob([JSON.stringify(shortcuts, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'shortcuts_backup.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    });

    // Import functionality
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importInput').click();
    });

    document.getElementById('importInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const shortcuts = JSON.parse(event.target.result);
                    chrome.storage.sync.set({ shortcuts }, () => {
                        loadShortcuts();
                        e.target.value = ''; // Reset file input
                    });
                } catch (error) {
                    alert('Invalid backup file');
                }
            };
            reader.readAsText(file);
        }
    });

    // Load and display shortcuts
    function loadShortcuts() {
        chrome.storage.sync.get(['shortcuts'], (result) => {
            const shortcuts = result.shortcuts || {};
            shortcutList.innerHTML = '';
            
            Object.entries(shortcuts).forEach(([key, value]) => {
                const truncatedValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="shortcut-info" title="${value}">
                        <span class="shortcut-key">${key}</span>
                        <span class="shortcut-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M5 12l14 0" />
                                <path d="M15 16l4 -4" />
                                <path d="M15 8l4 4" />
                            </svg>
                        </span>
                        <span class="shortcut-value">${truncatedValue}</span>
                    </div>
                    <span class="delete-btn" data-shortcut="${key}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                    </span>
                `;
                shortcutList.appendChild(li);
            });

            // Add delete handlers
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const deleteBtn = e.target.closest('.delete-btn');
                    if (!deleteBtn) return;
                    
                    const shortcutToDelete = deleteBtn.dataset.shortcut;
                    delete shortcuts[shortcutToDelete];
                    chrome.storage.sync.set({ shortcuts }, loadShortcuts);
                });
            });
        });
    }
});
