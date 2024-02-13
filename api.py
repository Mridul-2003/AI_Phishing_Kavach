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
phishy_text = pickle.load(open('phishy_text.pkl','rb'))
vectorizer_text = pickle.load(open('phishy_text_vectorizer.pkl','rb'))
@app.route('/predict_phishyurl', methods=['POST'])
def predict_url():
    try:
        data = request.get_json()
        urls = data.get('url', []) 

        if not urls:
            raise ValueError("No 'url' key found in the input JSON.")

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
                "predicted": "This Email is Phishy" if prediction[0] == 1 else "Safe Email"
            }
            predict_email.append(result)

        return jsonify({"predictions": predict_email})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.route('/predict_phishytext', methods=['POST'])
def predict_text():
    try:
        text_data = request.get_json()
        text = text_data.get('text', []) 

        if not text:
            raise ValueError("No 'text' key found in the input JSON.")

        predict_text = []

        for tex in text:
            transformed_text1 = vectorizer_text.transform([tex]).toarray()  # Convert sparse matrix to dense array
            prediction = phishy_text.predict(transformed_text1)
            result = {
                "email": tex,
                "predicted": "This text is Bullying" if prediction[0] == 1 else "Safe Text"
            }
            predict_text.append(result)

        return jsonify({"predictions": predict_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
