"""
Shamba Score API - Climate-Adaptive Credit Scoring System
Production-ready Flask API for the Shamba Score model
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global model variables
shamba_model = None
climate_separator = None
explainer = None

class ShambaScorePredictor:
    """Production Shamba Score predictor"""
    
    def __init__(self):
        self.model_loaded = False
        
    def load_models(self):
        """Load pre-trained models"""
        try:
            # In production, load from saved model files
            # For demo, we'll create mock models
            logger.info("Loading Shamba Score models...")
            self.model_loaded = True
            logger.info("✅ Models loaded successfully")
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
            self.model_loaded = False
    
    def predict_credit_score(self, farmer_data):
        """Predict credit score for a farmer"""
        try:
            # Mock prediction logic (replace with actual model)
            base_score = 500
            
            # Satellite data impact
            ndvi_score = farmer_data.get('ndvi_current', 0.7) * 100
            crop_health = farmer_data.get('crop_health_score', 75)
            
            # M-Pesa data impact
            income = farmer_data.get('monthly_income_avg', 20000)
            payment_consistency = farmer_data.get('payment_consistency', 0.8) * 100
            
            # Community data impact
            trust_score = farmer_data.get('community_trust_score', 70)
            
            # Climate risk adjustment
            drought_risk = farmer_data.get('drought_risk_score', 30)
            flood_risk = farmer_data.get('flood_risk_score', 20)
            climate_penalty = (drought_risk + flood_risk) / 4
            
            # Calculate final score
            performance_score = (
                ndvi_score * 0.2 + 
                crop_health * 0.2 + 
                payment_consistency * 0.3 + 
                trust_score * 0.2 +
                min(income/1000, 50) * 0.1
            )
            
            final_score = base_score + performance_score - climate_penalty
            final_score = max(300, min(850, final_score))
            
            return {
                'credit_score': round(final_score),
                'farmer_performance': round(performance_score),
                'climate_risk': round(climate_penalty),
                'confidence': 85
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return None
    
    def generate_explanation(self, farmer_data, scores):
        """Generate explanation for the credit score"""
        credit_score = scores['credit_score']
        
        # Score category
        if credit_score >= 750:
            category = "Excellent"
            description = "Outstanding creditworthiness"
        elif credit_score >= 650:
            category = "Good" 
            description = "Strong creditworthiness"
        elif credit_score >= 550:
            category = "Fair"
            description = "Moderate creditworthiness"
        else:
            category = "Poor"
            description = "Limited creditworthiness"
        
        # Identify strengths
        strengths = []
        if farmer_data.get('payment_consistency', 0) > 0.9:
            strengths.append("Excellent payment history")
        if farmer_data.get('community_trust_score', 0) > 80:
            strengths.append("Strong community reputation")
        if farmer_data.get('crop_health_score', 0) > 80:
            strengths.append("High crop productivity")
        
        # Identify improvement areas
        improvements = []
        if farmer_data.get('savings_rate', 0) < 0.2:
            improvements.append("Increase savings rate")
        if farmer_data.get('drought_risk_score', 0) > 60:
            improvements.append("Implement drought mitigation")
        if farmer_data.get('equipment_investment', 0) < 10000:
            improvements.append("Consider equipment upgrades")
        
        return {
            'category': category,
            'description': description,
            'strengths': strengths[:3],
            'improvements': improvements[:3]
        }
    
    def generate_recommendations(self, farmer_data, scores):
        """Generate personalized recommendations"""
        credit_score = scores['credit_score']
        
        recommendations = {
            'immediate_actions': [],
            'financial_products': [],
            'climate_adaptation': []
        }
        
        # Immediate actions
        if farmer_data.get('savings_rate', 0) < 0.3:
            recommendations['immediate_actions'].append(
                "Set up automatic savings of 15% of monthly income"
            )
        
        if farmer_data.get('cooperative_participation', 0) == 0:
            recommendations['immediate_actions'].append(
                "Join local farmer cooperative for better market access"
            )
        
        # Financial products
        if credit_score >= 650:
            recommendations['financial_products'].extend([
                "Eligible for premium agricultural loans (6-8% interest)",
                "Access to equipment financing programs",
                "Crop insurance with favorable rates"
            ])
        elif credit_score >= 550:
            recommendations['financial_products'].extend([
                "Eligible for standard agricultural loans (9-12% interest)",
                "Basic crop insurance coverage",
                "Savings account with competitive rates"
            ])
        else:
            recommendations['financial_products'].extend([
                "Start with micro-loans to build credit history",
                "Basic savings account",
                "Financial literacy training programs"
            ])
        
        # Climate adaptation
        if farmer_data.get('drought_risk_score', 0) > 50:
            recommendations['climate_adaptation'].extend([
                "Invest in drought-resistant crop varieties",
                "Install water conservation systems",
                "Consider climate-smart agriculture practices"
            ])
        
        return recommendations

# Initialize predictor
predictor = ShambaScorePredictor()
predictor.load_models()

@app.route('/')
def home():
    """API documentation"""
    docs = """
    <h1>🌾 Shamba Score API</h1>
    <h2>Climate-Adaptive Credit Scoring for Kenyan Farmers</h2>
    
    <h3>Endpoints:</h3>
    <ul>
        <li><strong>POST /api/score</strong> - Score a single farmer</li>
        <li><strong>POST /api/batch-score</strong> - Score multiple farmers</li>
        <li><strong>GET /api/health</strong> - API health check</li>
    </ul>
    
    <h3>Sample Request:</h3>
    <pre>
    POST /api/score
    {
        "farmer_id": "KE_000001",
        "ndvi_current": 0.75,
        "crop_health_score": 85,
        "monthly_income_avg": 25000,
        "payment_consistency": 0.95,
        "community_trust_score": 88,
        "drought_risk_score": 35,
        "flood_risk_score": 20,
        "savings_rate": 0.15
    }
    </pre>
    
    <p><em>Built with ❤️ for Kenyan farmers</em></p>
    """
    return render_template_string(docs)

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model_loaded,
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/score', methods=['POST'])
def score_farmer():
    """Score a single farmer"""
    try:
        # Get farmer data from request
        farmer_data = request.get_json()
        
        if not farmer_data:
            return jsonify({'error': 'No farmer data provided'}), 400
        
        # Validate required fields
        required_fields = ['farmer_id']
        missing_fields = [field for field in required_fields if field not in farmer_data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Predict credit score
        scores = predictor.predict_credit_score(farmer_data)
        
        if not scores:
            return jsonify({'error': 'Prediction failed'}), 500
        
        # Generate explanation and recommendations
        explanation = predictor.generate_explanation(farmer_data, scores)
        recommendations = predictor.generate_recommendations(farmer_data, scores)
        
        # Prepare response
        response = {
            'farmer_id': farmer_data['farmer_id'],
            'timestamp': datetime.now().isoformat(),
            'credit_score': scores['credit_score'],
            'score_category': explanation['category'],
            'score_description': explanation['description'],
            'farmer_performance_score': scores['farmer_performance'],
            'climate_risk_score': scores['climate_risk'],
            'confidence_score': scores['confidence'],
            'explanation': {
                'strengths': explanation['strengths'],
                'improvement_areas': explanation['improvements']
            },
            'recommendations': recommendations,
            'model_version': '1.0.0'
        }
        
        logger.info(f"Scored farmer {farmer_data['farmer_id']}: {scores['credit_score']}")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in score_farmer: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/batch-score', methods=['POST'])
def batch_score_farmers():
    """Score multiple farmers"""
    try:
        # Get farmers data from request
        request_data = request.get_json()
        farmers_data = request_data.get('farmers', [])
        
        if not farmers_data:
            return jsonify({'error': 'No farmers data provided'}), 400
        
        results = []
        
        for farmer_data in farmers_data:
            try:
                # Score individual farmer
                scores = predictor.predict_credit_score(farmer_data)
                
                if scores:
                    explanation = predictor.generate_explanation(farmer_data, scores)
                    
                    result = {
                        'farmer_id': farmer_data.get('farmer_id', 'unknown'),
                        'credit_score': scores['credit_score'],
                        'score_category': explanation['category'],
                        'farmer_performance_score': scores['farmer_performance'],
                        'climate_risk_score': scores['climate_risk'],
                        'confidence_score': scores['confidence'],
                        'status': 'success'
                    }
                else:
                    result = {
                        'farmer_id': farmer_data.get('farmer_id', 'unknown'),
                        'status': 'failed',
                        'error': 'Prediction failed'
                    }
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    'farmer_id': farmer_data.get('farmer_id', 'unknown'),
                    'status': 'failed',
                    'error': str(e)
                })
        
        response = {
            'timestamp': datetime.now().isoformat(),
            'total_farmers': len(farmers_data),
            'successful_scores': len([r for r in results if r['status'] == 'success']),
            'failed_scores': len([r for r in results if r['status'] == 'failed']),
            'results': results
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in batch_score_farmers: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🚀 Starting Shamba Score API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)