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
const form = document.querySelector('form');
const phishyemail_form = document.querySelector('#phishy_email')
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputUrl = document.getElementById('text').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/predict_phishytext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: [inputUrl] }),  // Sending an array even if it's just one URL
        });

        if (response.ok) {
            const result = (await response.json()).predictions[0].predicted;
            const resultDiv = document.getElementById('prediction-result');
            resultDiv.innerText = JSON.stringify(result, null, 2);  // Display the predictions as JSON
        } else {
            console.error('Request failed:', response.status);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
});

phishyemail_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputUrl = document.getElementById('email').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/predict_phishyemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emails: [inputUrl] }),  // Sending an array even if it's just one URL
        });

        if (response.ok) {
            const result = (await response.json()).predictions[0].predicted;
            const resultDiv = document.getElementById('prediction-email');
            resultDiv.innerText = JSON.stringify(result, null, 2);  // Display the predictions as JSON
        } else {
            console.error('Request failed:', response.status);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
});