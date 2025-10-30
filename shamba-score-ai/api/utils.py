"""
Shamba Score: Utility Functions
Helper functions for API operations
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_risk_category(score: float) -> Tuple[str, int, float, float]:
    """
    Calculate risk category and loan terms based on credit score
    
    Args:
        score: Credit score (0-100)
        
    Returns:
        Tuple of (category, loan_amount, interest_rate, approval_probability)
    """
    if score >= 85:
        return "Excellent", 150000, 10.5, 0.98
    elif score >= 75:
        return "Very Good", 100000, 12.0, 0.95
    elif score >= 65:
        return "Good", 75000, 14.0, 0.88
    elif score >= 55:
        return "Fair", 50000, 16.5, 0.75
    elif score >= 45:
        return "Poor", 25000, 19.0, 0.60
    elif score >= 35:
        return "Very Poor", 15000, 22.0, 0.45
    else:
        return "High Risk", 10000, 25.0, 0.25

def calculate_feature_contributions(features: Dict[str, float], weights: Dict[str, float] = None) -> List[Dict[str, Any]]:
    """
    Calculate individual feature contributions to credit score
    
    Args:
        features: Dictionary of feature values
        weights: Optional feature weights
        
    Returns:
        List of contributing factors with scores
    """
    if weights is None:
        # Default weights based on model importance
        weights = {
            "growing_season_match": 0.25,
            "cooperative_endorsement": 0.20,
            "loan_repayment_history": 0.15,
            "savings_rate": 0.12,
            "mean_ndvi": 0.10,
            "chama_participation": 0.08,
            "transaction_velocity": 0.05,
            "fertilizer_purchase_timing": 0.05
        }
    
    contributions = []
    
    # Calculate weighted contributions
    for feature, value in features.items():
        if feature in weights:
            contribution = value * weights[feature] * 100
            contributions.append({
                "factor": format_feature_name(feature),
                "contribution": round(contribution, 1),
                "category": get_feature_category(feature),
                "raw_value": value
            })
    
    # Sort by contribution and return top factors
    contributions.sort(key=lambda x: x["contribution"], reverse=True)
    return contributions[:5]

def format_feature_name(feature: str) -> str:
    """Convert feature name to human-readable format"""
    name_mapping = {
        "mean_ndvi": "Crop Health (NDVI)",
        "ndvi_trend": "Crop Growth Trend",
        "growing_season_match": "Seasonal Farming Alignment",
        "transaction_velocity": "Financial Activity",
        "savings_rate": "Savings Behavior",
        "loan_repayment_history": "Repayment History",
        "cooperative_endorsement": "Community Trust",
        "chama_participation": "Savings Group Membership",
        "neighbor_vouches": "Peer Recommendations",
        "fertilizer_purchase_timing": "Input Management",
        "seed_quality_tier": "Seed Quality Usage",
        "advisory_usage": "Extension Service Usage",
        "drought_exposure_index": "Drought Risk Exposure",
        "rainfall_deviation": "Rainfall Variability",
        "temperature_anomaly": "Temperature Stress"
    }
    return name_mapping.get(feature, feature.replace("_", " ").title())

def get_feature_category(feature: str) -> str:
    """Get category for a feature"""
    categories = {
        "satellite": ["mean_ndvi", "ndvi_trend", "growing_season_match"],
        "financial": ["transaction_velocity", "savings_rate", "loan_repayment_history"],
        "community": ["cooperative_endorsement", "chama_participation", "neighbor_vouches"],
        "agricultural": ["fertilizer_purchase_timing", "seed_quality_tier", "advisory_usage"],
        "climate": ["drought_exposure_index", "rainfall_deviation", "temperature_anomaly"]
    }
    
    for category, features in categories.items():
        if feature in features:
            return category
    return "other"

def generate_improvement_suggestions(features: Dict[str, float], score: float) -> List[str]:
    """
    Generate personalized improvement suggestions
    
    Args:
        features: Dictionary of feature values
        score: Current credit score
        
    Returns:
        List of improvement suggestions
    """
    suggestions = []
    
    # Chama participation
    if features.get("chama_participation", 0) == 0:
        suggestions.append("Join a savings group (chama) to improve community trust (+8-12 points)")
    
    # Savings rate
    if features.get("savings_rate", 0) < 0.2:
        suggestions.append("Increase your savings rate to at least 20% of income (+5-8 points)")
    
    # Advisory usage
    if features.get("advisory_usage", 0) == 0:
        suggestions.append("Utilize agricultural extension services for better farming practices (+3-5 points)")
    
    # Cooperative endorsement
    if features.get("cooperative_endorsement", 0) < 4:
        suggestions.append("Improve participation in farmer cooperatives (+4-7 points)")
    
    # Loan repayment history
    if features.get("loan_repayment_history", 0) < 0.8:
        suggestions.append("Maintain consistent loan repayments to build credit history (+10-15 points)")
    
    # Seed quality
    if features.get("seed_quality_tier", 0) < 2:
        suggestions.append("Invest in higher quality seeds for better crop yields (+2-4 points)")
    
    # Input timing
    if features.get("fertilizer_purchase_timing", 0) < 0.6:
        suggestions.append("Improve timing of agricultural input purchases (+3-6 points)")
    
    # NDVI/Crop health
    if features.get("mean_ndvi", 0) < 0.5:
        suggestions.append("Consider drought-resistant crops or improved irrigation (+5-10 points)")
    
    # Limit suggestions based on score
    if score >= 80:
        suggestions = suggestions[:2]  # Fewer suggestions for high scores
    elif score >= 60:
        suggestions = suggestions[:4]  # Moderate suggestions
    else:
        suggestions = suggestions[:6]  # More suggestions for low scores
    
    return suggestions

def validate_feature_ranges(features: Dict[str, float]) -> Dict[str, str]:
    """
    Validate feature values are within expected ranges
    
    Args:
        features: Dictionary of feature values
        
    Returns:
        Dictionary of validation errors (empty if all valid)
    """
    errors = {}
    
    # Define valid ranges
    ranges = {
        "mean_ndvi": (0, 1),
        "ndvi_trend": (-1, 1),
        "growing_season_match": (0, 1),
        "transaction_velocity": (0, 200),
        "savings_rate": (0, 1),
        "loan_repayment_history": (0, 1),
        "cooperative_endorsement": (1, 5),
        "chama_participation": (0, 1),
        "neighbor_vouches": (0, 20),
        "fertilizer_purchase_timing": (0, 1),
        "seed_quality_tier": (1, 3),
        "advisory_usage": (0, 1),
        "drought_exposure_index": (0, 1),
        "rainfall_deviation": (-50, 50),
        "temperature_anomaly": (-10, 10)
    }
    
    for feature, value in features.items():
        if feature in ranges:
            min_val, max_val = ranges[feature]
            if not (min_val <= value <= max_val):
                errors[feature] = f"Value {value} outside valid range [{min_val}, {max_val}]"
    
    return errors

def calculate_confidence_score(features: Dict[str, float], model_uncertainty: float = 0.05) -> float:
    """
    Calculate confidence score for the prediction
    
    Args:
        features: Dictionary of feature values
        model_uncertainty: Base model uncertainty
        
    Returns:
        Confidence score (0-1)
    """
    # Start with base confidence
    confidence = 0.85
    
    # Reduce confidence for missing or extreme values
    for feature, value in features.items():
        if pd.isna(value):
            confidence -= 0.1
        elif feature == "mean_ndvi" and (value < 0.1 or value > 0.95):
            confidence -= 0.05
        elif feature == "savings_rate" and value > 0.8:
            confidence -= 0.03
    
    # Account for model uncertainty
    confidence = max(0.1, confidence - model_uncertainty)
    
    return min(1.0, confidence)

def log_prediction(farmer_id: str, features: Dict[str, float], score: float, timestamp: datetime = None):
    """
    Log prediction for monitoring and audit purposes
    
    Args:
        farmer_id: Unique farmer identifier
        features: Input features
        score: Predicted score
        timestamp: Prediction timestamp
    """
    if timestamp is None:
        timestamp = datetime.now()
    
    log_entry = {
        "farmer_id": farmer_id,
        "timestamp": timestamp.isoformat(),
        "score": score,
        "features": features
    }
    
    logger.info(f"Prediction logged: {json.dumps(log_entry)}")

def format_currency(amount: int, currency: str = "KES") -> str:
    """Format currency amount"""
    return f"{currency} {amount:,}"

def calculate_batch_statistics(scores: List[float]) -> Dict[str, float]:
    """Calculate statistics for batch predictions"""
    if not scores:
        return {}
    
    return {
        "count": len(scores),
        "mean": np.mean(scores),
        "median": np.median(scores),
        "std": np.std(scores),
        "min": np.min(scores),
        "max": np.max(scores),
        "q25": np.percentile(scores, 25),
        "q75": np.percentile(scores, 75)
    }