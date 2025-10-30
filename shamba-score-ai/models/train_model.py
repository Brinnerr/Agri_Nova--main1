"""
Shamba Score: Model Training Script
Trains XGBoost model on farmer data
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import xgboost as xgb
import joblib
import matplotlib.pyplot as plt
import json
import os

def load_and_prepare_data(filepath):
    """Load data and prepare features"""
    print("Loading data...")
    df = pd.read_csv(filepath)
    
    # Select feature columns (15 features)
    feature_cols = [
        'mean_ndvi', 'ndvi_trend', 'growing_season_match',
        'transaction_velocity', 'savings_rate', 'loan_repayment_history',
        'cooperative_endorsement', 'chama_participation', 'neighbor_vouches',
        'fertilizer_purchase_timing', 'seed_quality_tier', 'advisory_usage',
        'drought_exposure_index', 'rainfall_deviation', 'temperature_anomaly'
    ]
    
    X = df[feature_cols]
    y = df['credit_score']
    
    print(f"Loaded {len(df)} samples with {len(feature_cols)} features")
    return X, y, feature_cols, df

def train_model(X, y, test_size=0.2, random_state=42):
    """Train XGBoost model"""
    print("\nSplitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    print(f"   Training set: {len(X_train)} samples")
    print(f"   Test set: {len(X_test)} samples")
    
    # Scale features
    print("\nScaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train XGBoost
    print("\nTraining XGBoost model...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=random_state,
        verbosity=0
    )
    
    model.fit(
        X_train_scaled, y_train,
        eval_set=[(X_test_scaled, y_test)],
        verbose=False
    )
    
    # Evaluate
    print("\nEvaluating model...")
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    metrics = {
        'train_mae': mean_absolute_error(y_train, y_pred_train),
        'test_mae': mean_absolute_error(y_test, y_pred_test),
        'train_r2': r2_score(y_train, y_pred_train),
        'test_r2': r2_score(y_test, y_pred_test),
        'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
        'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test))
    }
    
    print("\n=== MODEL PERFORMANCE ===")
    print(f"Train MAE: {metrics['train_mae']:.2f} points")
    print(f"Test MAE:  {metrics['test_mae']:.2f} points")
    print(f"Train R²:  {metrics['train_r2']:.3f}")
    print(f"Test R²:   {metrics['test_r2']:.3f}")
    print(f"Train RMSE: {metrics['train_rmse']:.2f}")
    print(f"Test RMSE:  {metrics['test_rmse']:.2f}")
    
    return model, scaler, X_train_scaled, X_test_scaled, y_train, y_test, metrics

def analyze_feature_importance(model, feature_names):
    """Analyze and plot feature importance"""
    print("\nAnalyzing feature importance...")
    
    importance = model.feature_importances_
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Features:")
    print(feature_importance.head(10).to_string(index=False))
    
    # Create docs directory if it doesn't exist
    os.makedirs('../docs', exist_ok=True)
    
    # Plot
    plt.figure(figsize=(10, 6))
    plt.barh(range(len(feature_importance)), feature_importance['importance'])
    plt.yticks(range(len(feature_importance)), feature_importance['feature'])
    plt.xlabel('Importance')
    plt.title('Feature Importance')
    plt.tight_layout()
    plt.savefig('../docs/feature_importance.png', dpi=150)
    plt.close()
    print("   Saved plot: docs/feature_importance.png")
    
    return feature_importance

def test_fairness(model, scaler, df, feature_cols):
    """Test model fairness across demographics"""
    print("\nTesting fairness...")
    
    X = df[feature_cols]
    y = df['credit_score']
    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)
    
    fairness_results = {}
    
    # Gender fairness
    print("\n   By Gender:")
    for gender in ['M', 'F']:
        mask = df['gender'] == gender
        if mask.sum() > 0:
            mae = mean_absolute_error(y[mask], y_pred[mask])
            fairness_results[f'gender_{gender}_mae'] = mae
            print(f"      {gender}: MAE = {mae:.2f}")
    
    # County fairness
    print("\n   By County:")
    for county in df['county'].unique():
        mask = df['county'] == county
        if mask.sum() > 0:
            mae = mean_absolute_error(y[mask], y_pred[mask])
            fairness_results[f'county_{county}_mae'] = mae
            print(f"      {county}: MAE = {mae:.2f}")
    
    return fairness_results

def save_model_artifacts(model, scaler, metrics, feature_importance, fairness_results, feature_names):
    """Save all model artifacts"""
    print("\nSaving model artifacts...")
    
    # Save model and scaler
    joblib.dump(model, 'shamba_score_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    print("   Saved: shamba_score_model.pkl")
    print("   Saved: scaler.pkl")
    
    # Save feature names
    with open('feature_names.json', 'w') as f:
        json.dump(feature_names, f)
    print("   Saved: feature_names.json")
    
    # Save metrics
    all_metrics = {
        'performance': metrics,
        'fairness': fairness_results,
        'feature_importance': feature_importance.to_dict('records')
    }
    with open('model_metrics.json', 'w') as f:
        json.dump(all_metrics, f, indent=2)
    print("   Saved: model_metrics.json")

if __name__ == "__main__":
    print("="*70)
    print("SHAMBA SCORE: MODEL TRAINING")
    print("="*70)
    
    # Load data
    X, y, feature_names, df = load_and_prepare_data('../data/farmers_training_data.csv')
    
    # Train model
    model, scaler, X_train_scaled, X_test_scaled, y_train, y_test, metrics = train_model(X, y)
    
    # Feature importance
    feature_importance = analyze_feature_importance(model, feature_names)
    
    # Fairness testing
    fairness_results = test_fairness(model, scaler, df, feature_names)
    
    # Save everything
    save_model_artifacts(model, scaler, metrics, feature_importance, fairness_results, feature_names)
    
    print("\n" + "="*70)
    print("TRAINING COMPLETE!")
    print("="*70)
    print("\nNext steps:")
    print("1. Review model_metrics.json for performance")
    print("2. Check docs/feature_importance.png")
    print("3. Proceed to API development")
    print()