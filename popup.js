"use strict";

function validateInput(padding, maxWidth) {
    const isValidPadding = !isNaN(padding) && padding >= 0;
    const isValidMaxWidth = !isNaN(maxWidth) && maxWidth >= 0;
    return {
        isValid: isValidPadding && isValidMaxWidth,
        fields: {
            padding: isValidPadding,
            maxWidth: isValidMaxWidth
        }
    };
}

function highlightInvalidInput(fields) {
    const paddingInput = document.getElementById('padding');
    const maxWidthInput = document.getElementById('maxWidth');

    if (!fields.padding) {
        paddingInput.style.borderColor = 'red';
    } else {
        paddingInput.style.borderColor = ''; // Reset to default or previous valid state
    }

    if (!fields.maxWidth) {
        maxWidthInput.style.borderColor = 'red';
    } else {
        maxWidthInput.style.borderColor = ''; // Reset to default or previous valid state
    }
}

function saveSettings() {
    const isEnabled = document.getElementById('toggleExtension').checked;
    const padding = document.getElementById('padding').value;
    const maxWidth = document.getElementById('maxWidth').value;
    const saveButton = document.getElementById('saveSettings');

    const validation = validateInput(padding, maxWidth);

    if (!validation.isValid) {
        // Highlight invalid input and prevent settings from being saved
        highlightInvalidInput(validation.fields);
        return; // Exit the function early
    }

    chrome.storage.sync.set({ isEnabled, padding, maxWidth }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error saving settings: ${chrome.runtime.lastError}`);
            saveButton.textContent = 'Error'; // Display error on the button
        } else {
            saveButton.textContent = 'Saved';
            setTimeout(() => {
                window.close(); // Optionally close the popup window if desired
            }, 500);
        }
    });
}

document.getElementById('saveSettings').addEventListener('click', saveSettings);

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['isEnabled', 'padding', 'maxWidth'], function (data) {
        document.getElementById('toggleExtension').checked = !!data.isEnabled;
        document.getElementById('padding').value = data.padding || '20';
        document.getElementById('maxWidth').value = data.maxWidth || '3440';
    });
});

document.getElementById('toggleEnterKeyModifier').addEventListener('change', () => {
    const isModifierEnabled = document.getElementById('toggleEnterKeyModifier').checked;
    chrome.storage.sync.set({ isModifierEnabled });
});

// Initialize the state of the Enter Key Modifier toggle on popup load
chrome.storage.sync.get(['isModifierEnabled'], function (data) {
    document.getElementById('toggleEnterKeyModifier').checked = !!data.isModifierEnabled;
});
