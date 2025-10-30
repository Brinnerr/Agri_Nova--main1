"""
Shamba Score: Pydantic Schemas
Data validation and serialization models
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional
from datetime import datetime

class FarmerProfile(BaseModel):
    """Complete farmer profile"""
    farmer_id: str = Field(..., description="Unique farmer identifier")
    name: str = Field(..., description="Farmer name")
    phone: str = Field(..., description="Phone number")
    county: str = Field(..., description="County location")
    age: int = Field(..., ge=18, le=100, description="Farmer age")
    gender: str = Field(..., description="Gender (M/F)")
    farm_size_acres: float = Field(..., gt=0, description="Farm size in acres")
    registration_date: datetime = Field(..., description="Registration date")

class SatelliteFeatures(BaseModel):
    """Satellite-derived features"""
    mean_ndvi: float = Field(..., ge=0, le=1, description="Mean NDVI value")
    ndvi_trend: float = Field(..., ge=-1, le=1, description="NDVI trend over time")
    growing_season_match: float = Field(..., ge=0, le=1, description="Growing season alignment")
    
    @validator('mean_ndvi')
    def validate_ndvi(cls, v):
        if v < 0 or v > 1:
            raise ValueError('NDVI must be between 0 and 1')
        return v

class FinancialFeatures(BaseModel):
    """Financial behavior features"""
    transaction_velocity: int = Field(..., ge=0, description="Monthly transaction count")
    savings_rate: float = Field(..., ge=0, le=1, description="Savings as % of income")
    loan_repayment_history: float = Field(..., ge=0, le=1, description="Repayment score")
    
    @validator('savings_rate')
    def validate_savings_rate(cls, v):
        if v < 0 or v > 1:
            raise ValueError('Savings rate must be between 0 and 1')
        return v

class CommunityFeatures(BaseModel):
    """Community reputation features"""
    cooperative_endorsement: int = Field(..., ge=1, le=5, description="Cooperative rating")
    chama_participation: int = Field(..., ge=0, le=1, description="Chama membership")
    neighbor_vouches: int = Field(..., ge=0, description="Neighbor endorsements")

class AgriculturalFeatures(BaseModel):
    """Agricultural practice features"""
    fertilizer_purchase_timing: float = Field(..., ge=0, le=1, description="Input timing score")
    seed_quality_tier: int = Field(..., ge=1, le=3, description="Seed quality level")
    advisory_usage: int = Field(..., ge=0, le=1, description="Extension service usage")

class ClimateFeatures(BaseModel):
    """Climate risk features"""
    drought_exposure_index: float = Field(..., ge=0, le=1, description="Drought risk exposure")
    rainfall_deviation: float = Field(..., description="Rainfall deviation from normal")
    temperature_anomaly: float = Field(..., description="Temperature anomaly")

class CreditScoreRequest(BaseModel):
    """Complete credit score request"""
    farmer_profile: Optional[FarmerProfile] = None
    satellite: SatelliteFeatures
    financial: FinancialFeatures
    community: CommunityFeatures
    agricultural: AgriculturalFeatures
    climate: ClimateFeatures

class ContributingFactor(BaseModel):
    """Individual contributing factor"""
    factor: str = Field(..., description="Factor name")
    contribution: float = Field(..., description="Contribution to score")
    category: str = Field(..., description="Factor category")

class CreditScoreResult(BaseModel):
    """Credit score calculation result"""
    credit_score: float = Field(..., ge=0, le=100, description="Credit score (0-100)")
    risk_category: str = Field(..., description="Risk category")
    confidence_score: float = Field(..., ge=0, le=1, description="Prediction confidence")
    
    # Financial recommendations
    recommended_loan_amount: int = Field(..., ge=0, description="Recommended loan (KES)")
    interest_rate: float = Field(..., gt=0, description="Suggested interest rate (%)")
    approval_probability: float = Field(..., ge=0, le=1, description="Approval probability")
    
    # Explanations
    top_contributing_factors: List[ContributingFactor] = Field(..., description="Top factors")
    improvement_suggestions: List[str] = Field(..., description="Improvement recommendations")
    
    # Risk breakdown
    farmer_performance_score: float = Field(..., description="Farmer skill score")
    climate_risk_score: float = Field(..., description="Climate risk score")

class BatchScoreRequest(BaseModel):
    """Batch scoring request"""
    farmers: List[CreditScoreRequest] = Field(..., description="List of farmers to score")
    include_explanations: bool = Field(default=True, description="Include explanations")

class BatchScoreResponse(BaseModel):
    """Batch scoring response"""
    results: List[CreditScoreResult] = Field(..., description="Scoring results")
    summary: Dict[str, float] = Field(..., description="Batch summary statistics")
    processing_time: float = Field(..., description="Processing time in seconds")

class ModelMetrics(BaseModel):
    """Model performance metrics"""
    accuracy: float = Field(..., description="Model accuracy")
    precision: float = Field(..., description="Model precision")
    recall: float = Field(..., description="Model recall")
    f1_score: float = Field(..., description="F1 score")
    auc_roc: float = Field(..., description="AUC-ROC score")

class FairnessMetrics(BaseModel):
    """Model fairness metrics"""
    gender_parity: float = Field(..., description="Gender fairness score")
    regional_parity: float = Field(..., description="Regional fairness score")
    age_parity: float = Field(..., description="Age fairness score")

class APIResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool = Field(..., description="Request success status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict] = Field(None, description="Response data")
    error: Optional[str] = Field(None, description="Error message if any")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")

class HealthCheck(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    model_loaded: bool = Field(..., description="Model loading status")
    uptime: float = Field(..., description="Service uptime in seconds")
    last_prediction: Optional[datetime] = Field(None, description="Last prediction timestamp")