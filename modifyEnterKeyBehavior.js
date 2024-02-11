// Retrieve the current state of the enter key modification setting
chrome.storage.sync.get(['isModifierEnabled'], function (data) {
    const textarea = document.getElementById('prompt-textarea'); // Locate the textarea where users input their messages

    // If the enter key modification setting is enabled and the textarea exists
    if (data.isModifierEnabled && textarea) {
        // Update the textarea's placeholder to indicate that the enter key function has been swapped
        textarea.placeholder = "Message ChatGPT... (Enter Key Function Swapped)";

        // Add an event listener to the document to capture all keydown events
        document.addEventListener('keydown', (e) => {
            // Check if the keydown event is happening within our targeted textarea
            if (e.target.id === 'prompt-textarea') {
                // Intercept the Enter key
                if (e.key === 'Enter') {
                    // If the Shift key is not held down, insert a new line at the cursor's position
                    if (!e.shiftKey) {
                        e.preventDefault(); // Prevent the default action (submission of form)
                        e.stopPropagation(); // Prevent the event from propagating further
                        insertNewLineAtCursor(e.target); // Insert a newline at the cursor
                    } else {
                        // If the Shift key is held down, simulate a form submission
                        e.preventDefault(); // Prevent the default form submission
                        submitForm(); // Call the submit form function
                    }
                }
            }
        }, true); // Use capture phase for event listening to ensure it captures before any potential stopping
    } else if (textarea) {
        // Reset the placeholder if the setting is not enabled
        textarea.placeholder = "Message ChatGPT...";
    }
});

// Function to insert a newline at the current cursor position within the textarea
function insertNewLineAtCursor(textarea) {
    // Capture the current cursor position
    const cursorPosition = textarea.selectionStart;
    // Split the textarea content into two halves around the cursor position
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);
    // Insert a newline character between the two halves and update the textarea's content
    textarea.value = `${textBeforeCursor}\n${textAfterCursor}`;
    // Move the cursor to the position right after the inserted newline
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
    // Dispatch an 'input' event to notify any listeners that the textarea's content has changed
    textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

// Function to simulate the form submission
function submitForm() {
    // Attempt to locate the submit button by its test ID
    const submitButton = document.querySelector('button[data-testid="send-button"]');
    if (submitButton) {
        // If the submit button is found, click it to submit the form
        submitButton.click();
    } else {
        // Log an error if the submit button cannot be found
        console.error("Submit button not found.");
    }
}
