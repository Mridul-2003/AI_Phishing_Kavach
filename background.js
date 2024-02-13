document.addEventListener('mousemove', function(event) {
    console.log('Mouse movement on webpage - X:', event.clientX, 'Y:', event.clientY);
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
      url: chrome.extension.getURL('popup.html'),
      active: true
    });
  });