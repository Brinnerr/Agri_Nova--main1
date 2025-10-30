from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/credit-score', methods=['POST'])
def calculate_credit_score():
    try:
        data = request.json
        
        # Mock credit scoring (replace with your Jupyter model)
        score = np.random.randint(60, 95)
        loan_eligibility = score * 3000
        
        return jsonify({
            'credit_score': score,
            'loan_eligibility': loan_eligibility,
            'risk_level': 'Low' if score > 80 else 'Medium'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)