function extractEmailFromPage() {
    const textContent = document.body.innerText;
    return textContent.trim();
  }
  
  // Send a message to the extension with the extracted text
  chrome.runtime.sendMessage({ action: "extractemail", text: extractEmailFromPage() });