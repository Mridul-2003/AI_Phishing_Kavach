const btn = document.querySelector('#activeButton');

btn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0];
        let url = tab.url; // Access the URL from the tab object
        console.log('URL:', url);

        // Call your API to check if the URL is fraudulent or not
        checkURLFraud(url);
    });
});

function checkURLFraud(url) {
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
    const API_ENDPOINT = 'http://127.0.0.1:5000/predict_phishyurl';

    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: [url] }) // Send URL in the specified format
    })
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);

        // Access the predicted value from the response
        const predictedValue = data.predictions[0].predicted;

        // Example: Display the predicted value in an alert
        alert('Predicted Result: ' + predictedValue);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors here
    });
}
