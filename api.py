import nltk
nltk.download('punkt')
import pickle
from flask import Flask ,request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app,supports_credentials=True)

model = pickle.load(open('phishing.pkl','rb'))

@app .route('/predict',methods=['POST'])
def predict():
    data = request.get_json()
    prediction = model.predict([data['url']])
    predicted = " "
    if prediction[0]=='bad':
        predicted+="This Link is Phishy Visit on your Own risk"
    else:
        predicted+="This Link is Safe to visit"
    return jsonify({"predicted":predicted})

if  __name__==("__main__"):
    app.run(debug=True)