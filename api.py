import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

nltk.download('punkt')

app = Flask(__name__)
CORS(app, supports_credentials=True)

model = pickle.load(open('phishing.pkl', 'rb'))
phishy_email = pickle.load(open('phishy_email.pkl','rb'))
vectorizer_email = pickle.load(open('vectorizer_phishing-emails.pkl','rb'))

@app.route('/predict_phishyurl', methods=['POST'])
def predict_url():
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
@app.route('/predict_phishyemail', methods=['POST'])
def predict_email():
    try:
        email_data = request.get_json()
        emails = email_data.get('emails', []) 

        if not emails:
            raise ValueError("No 'emails' key found in the input JSON.")

        predict_email = []

        for email in emails:
            transformed_text = vectorizer_email.transform([email]).toarray()  # Convert sparse matrix to dense array
            prediction = phishy_email.predict(transformed_text)
            result = {
                "email": email,
                "predicted": "This Email is Phishy" if prediction[0] == 0 else "Safe Email"
            }
            predict_email.append(result)

        return jsonify({"predictions": predict_email})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
