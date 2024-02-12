// Assume the status message is received from the background script
var statusMessage = "This link is safe to visit.";
var isPhishy = false; // Set to true if the link is phishy

var statusDiv = document.getElementById("status");

// Update the content and class of the status div based on the status message
if (isPhishy) {
    statusDiv.textContent = statusMessage;
    statusDiv.classList.add("phishy");
} else {
    statusDiv.textContent = statusMessage;
    statusDiv.classList.add("safe");
}

document.addEventListener('DOMContentLoaded', function () {
    // Get all links on the current page
    var links = document.getElementsByTagName('a');

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('mouseover', function () {
            var url = this.href;

            // Send a request to your Flask API for phishing detection
            fetch('http://127.0.0.1:5000/predict_phishyurl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'urls': [url] })
            })
            .then(response => response.json())
            .then(data => {
                if (data.results.predict_phishyurl.includes(url)) {
                    // Replace this alert with your desired alert or notification mechanism
                    alert('Warning: Phishing URL detected!');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Activate the extension button functionality
    document.getElementById('activeButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "activate_extension"});
        });
    });
});