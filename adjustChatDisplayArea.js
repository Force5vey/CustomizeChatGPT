"use strict";

// Function to adjust the chat display area based on extension settings
function adjustChatDisplayArea(settings) {
    const isEnabled = settings.isEnabled;
    const padding = settings.padding || '20'; // Use default padding if not specified
    const maxWidth = settings.maxWidth || '3440'; // Use default max width if not specified

    try {
        // Adjust styles only if the extension is enabled
        if (isEnabled) {
            let styleElement = document.getElementById('dynamicChatStyle');

            // Create the style element if it doesn't already exist
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'dynamicChatStyle';
                document.head.appendChild(styleElement);
            }

            // Update the style element's rules
            styleElement.innerText = `
                .text-base, .message, .response { /* Update these selectors as needed */
                    max-width: ${maxWidth}px !important;
                    padding-left: ${padding}px !important;
                    padding-right: ${padding}px !important;
                }
            `;
        } else {
            // Remove the custom styles if the extension is disabled
            const styleElement = document.getElementById('dynamicChatStyle');
            if (styleElement) {
                styleElement.remove();
            }
        }
    } catch (error) {
        console.error('Error adjusting chat display area:', error);
    }
}

// Debounce function to limit the rate at which a function is executed
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adjust display area upon window resize or settings update
function init() {
    chrome.storage.sync.get(['isEnabled', 'padding', 'maxWidth'], adjustChatDisplayArea);
}

// Apply debounce to the resize event listener
window.addEventListener('resize', debounce(init, 250));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateSettings") {
        adjustChatDisplayArea(request.settings);
    }
});

init(); // Initialize immediately on script load
