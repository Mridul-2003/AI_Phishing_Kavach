document.addEventListener('mouseover', function(event) {
    var url = event.target.href;

    if (url) {
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
                alert('Warning: Phishing URL detected!');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

function extractTextFromPage() {
    const textContent = document.body.innerText;
    return textContent.trim();
  }
  
  // Send a message to the extension with the extracted text
  chrome.runtime.sendMessage({ action: "extractText", text: extractTextFromPage() });