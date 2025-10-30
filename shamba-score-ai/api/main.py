"""
Shamba Score: FastAPI Application
Provides credit scoring API endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import json
from typing import Dict, List
import uvicorn
import os

# Load model artifacts
try:
    model = joblib.load('../models/shamba_score_model.pkl')
    scaler = joblib.load('../models/scaler.pkl')
    with open('../models/feature_names.json', 'r') as f:
        feature_names = json.load(f)
    print("Model artifacts loaded successfully")
except Exception as e:
    print(f"Error loading model artifacts: {e}")
    model = None
    scaler = None
    feature_names = []

# Initialize FastAPI app
app = FastAPI(
    title="Shamba Score API",
    description="AI-powered credit scoring for smallholder farmers",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class FarmerFeatures(BaseModel):
    """Input features for credit scoring"""
    # Satellite features
    mean_ndvi: float = Field(..., ge=0, le=1, description="Mean NDVI (0-1)")
    ndvi_trend: float = Field(..., ge=-1, le=1, description="NDVI trend")
    growing_season_match: float = Field(..., ge=0, le=1, description="Season match (0-1)")
    
    # Financial features
    transaction_velocity: int = Field(..., ge=0, description="Transactions per month")
    savings_rate: float = Field(..., ge=0, le=1, description="Savings rate (0-1)")
    loan_repayment_history: float = Field(..., ge=0, le=1, description="Repayment (0, 0.5, 1)")
    
    # Community features
    cooperative_endorsement: int = Field(..., ge=1, le=5, description="Coop rating (1-5)")
    chama_participation: int = Field(..., ge=0, le=1, description="Chama member (0/1)")
    neighbor_vouches: int = Field(..., ge=0, description="Neighbor vouches")
    
    # Agricultural features
    fertilizer_purchase_timing: float = Field(..., ge=0, le=1, description="Input timing (0-1)")
    seed_quality_tier: int = Field(..., ge=1, le=3, description="Seed quality (1-3)")
    advisory_usage: int = Field(..., ge=0, le=1, description="Uses advisory (0/1)")
    
    # Climate features
    drought_exposure_index: float = Field(..., ge=0, le=1, description="Drought risk (0-1)")
    rainfall_deviation: float = Field(..., description="Rainfall deviation (%)")
    temperature_anomaly: float = Field(..., description="Temperature anomaly (°C)")

class CreditScoreResponse(BaseModel):
    """Credit score response"""
    credit_score: float
    risk_category: str
    recommended_loan_amount: int
    interest_rate: float
    approval_probability: float
    top_contributing_factors: List[Dict[str, float]]
    improvement_suggestions: List[str]

# API Endpoints
@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "Shamba Score API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "features_count": len(feature_names)
    }

@app.post("/predict", response_model=CreditScoreResponse)
def predict_credit_score(features: FarmerFeatures):
    """
    Predict credit score for a farmer
    """
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare features
        feature_values = [
            features.mean_ndvi,
            features.ndvi_trend,
            features.growing_season_match,
            features.transaction_velocity,
            features.savings_rate,
            features.loan_repayment_history,
            features.cooperative_endorsement,
            features.chama_participation,
            features.neighbor_vouches,
            features.fertilizer_purchase_timing,
            features.seed_quality_tier,
            features.advisory_usage,
            features.drought_exposure_index,
            features.rainfall_deviation,
            features.temperature_anomaly
        ]
        
        # Scale and predict
        X = np.array([feature_values])
        X_scaled = scaler.transform(X)
        score = float(model.predict(X_scaled)[0])
        score = np.clip(score, 0, 100)
        
        # Determine risk category
        if score >= 80:
            risk_category = "Excellent"
            recommended_loan = 100000
            interest_rate = 12.0
            approval_prob = 0.95
        elif score >= 60:
            risk_category = "Good"
            recommended_loan = 50000
            interest_rate = 15.0
            approval_prob = 0.85
        elif score >= 40:
            risk_category = "Medium Risk"
            recommended_loan = 25000
            interest_rate = 18.0
            approval_prob = 0.65
        else:
            risk_category = "High Risk"
            recommended_loan = 10000
            interest_rate = 22.0
            approval_prob = 0.40
        
        # Calculate feature contributions (simplified)
        contributions = {
            "Crop Health": features.mean_ndvi * 25,
            "Savings Rate": features.savings_rate * 20,
            "Repayment History": features.loan_repayment_history * 20,
            "Cooperative Rating": features.cooperative_endorsement * 10,
            "Transaction Activity": (features.transaction_velocity / 60) * 15
        }
        
        top_factors = [
            {"factor": k, "contribution": round(v, 1)}
            for k, v in sorted(contributions.items(), key=lambda x: x[1], reverse=True)[:3]
        ]
        
        # Improvement suggestions
        suggestions = []
        if features.chama_participation == 0:
            suggestions.append("Join a savings group (chama) to gain +10 points")
        if features.advisory_usage == 0:
            suggestions.append("Use agricultural extension services for +3 points")
        if features.savings_rate < 0.3:
            suggestions.append("Increase savings rate to 30%+ for +5 points")
        if features.cooperative_endorsement < 4:
            suggestions.append("Improve cooperative participation for +7 points")
        
        return CreditScoreResponse(
            credit_score=round(score, 1),
            risk_category=risk_category,
            recommended_loan_amount=recommended_loan,
            interest_rate=interest_rate,
            approval_probability=approval_prob,
            top_contributing_factors=top_factors,
            improvement_suggestions=suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/features")
def get_feature_info():
    """Get information about required features"""
    return {
        "features": feature_names,
        "feature_count": len(feature_names),
        "categories": {
            "satellite": ["mean_ndvi", "ndvi_trend", "growing_season_match"],
            "financial": ["transaction_velocity", "savings_rate", "loan_repayment_history"],
            "community": ["cooperative_endorsement", "chama_participation", "neighbor_vouches"],
            "agricultural": ["fertilizer_purchase_timing", "seed_quality_tier", "advisory_usage"],
            "climate": ["drought_exposure_index", "rainfall_deviation", "temperature_anomaly"]
        }
    }

@app.get("/demo")
def get_demo_data():
    """Get demo farmer data for testing"""
    return {
        "excellent_farmer": {
            "mean_ndvi": 0.85,
            "ndvi_trend": 0.05,
            "growing_season_match": 0.92,
            "transaction_velocity": 55,
            "savings_rate": 0.45,
            "loan_repayment_history": 1.0,
            "cooperative_endorsement": 5,
            "chama_participation": 1,
            "neighbor_vouches": 6,
            "fertilizer_purchase_timing": 0.88,
            "seed_quality_tier": 3,
            "advisory_usage": 1,
            "drought_exposure_index": 0.15,
            "rainfall_deviation": 5.2,
            "temperature_anomaly": 1.1
        },
        "average_farmer": {
            "mean_ndvi": 0.65,
            "ndvi_trend": 0.01,
            "growing_season_match": 0.75,
            "transaction_velocity": 35,
            "savings_rate": 0.25,
            "loan_repayment_history": 0.5,
            "cooperative_endorsement": 3,
            "chama_participation": 1,
            "neighbor_vouches": 2,
            "fertilizer_purchase_timing": 0.65,
            "seed_quality_tier": 2,
            "advisory_usage": 0,
            "drought_exposure_index": 0.25,
            "rainfall_deviation": -8.5,
            "temperature_anomaly": 2.1
        },
        "struggling_farmer": {
            "mean_ndvi": 0.35,
            "ndvi_trend": -0.08,
            "growing_season_match": 0.45,
            "transaction_velocity": 15,
            "savings_rate": 0.08,
            "loan_repayment_history": 0.0,
            "cooperative_endorsement": 2,
            "chama_participation": 0,
            "neighbor_vouches": 0,
            "fertilizer_purchase_timing": 0.25,
            "seed_quality_tier": 1,
            "advisory_usage": 0,
            "drought_exposure_index": 0.45,
            "rainfall_deviation": -15.2,
            "temperature_anomaly": 3.5
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)