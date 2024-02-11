import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

nltk.download('punkt')

app = Flask(__name__)
CORS(app, supports_credentials=True)

model = pickle.load(open('phishing.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        urls = data.get('urls', []) 

        if not urls:
            raise ValueError("No 'urls' key found in the input JSON.")

        predictions = []

        for url in urls:
            prediction = model.predict([url])
            result = {
                "url": url,
                "predicted": "This Link is Phishy. Visit at your own risk." if prediction[0] == 'bad' else "This Link is Safe to visit."
            }
            predictions.append(result)

        return jsonify({"predictions": predictions})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
