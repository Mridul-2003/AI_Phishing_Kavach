chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "activate_extension") {
        chrome.tabs.executeScript(null, {file: "content.js"});
    }
});