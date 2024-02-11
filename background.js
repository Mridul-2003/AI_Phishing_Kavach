chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.url) {
        fetch('http://127.0.0.1:5000/predict_phishyurl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({urls: [message.url]})
        })
        .then(response => response.json())
        .then(data => {
            if (data.predictions && data.predictions.length > 0) {
                const prediction = data.predictions[0].predicted;
                if (prediction === "This Link is Phishy. Visit at your own risk.") {
                    chrome.tabs.update(sender.tab.id, {url: "warning.html?url=" + encodeURIComponent(message.url)});
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
