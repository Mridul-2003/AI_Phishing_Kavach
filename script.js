document.addEventListener('mousedown', function(event) {
    if (event.target.tagName === 'A') {
        chrome.runtime.sendMessage({url: event.target.href});
    }
});
