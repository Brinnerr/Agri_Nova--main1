"""
Shamba Score: Data Exploration Script
Generates visualizations and analysis for Next.js frontend integration
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import json
import os

def explore_farmer_data():
    """Main data exploration function"""
    
    # Load data
    df = pd.read_csv('data/farmers_training_data.csv')
    
    # Set style for better plots
    plt.style.use('default')
    sns.set_palette("husl")
    
    print("Shamba Score Data Exploration")
    print("Climate-Adaptive Credit Scoring for Kenyan Farmers")
    print(f"Dataset Shape: {df.shape}")
    
    # Create docs directory if it doesn't exist
    os.makedirs('docs', exist_ok=True)
    
    # 1. Basic Statistics
    print("\nBasic Statistics:")
    print(f"Mean Credit Score: {df['credit_score'].mean():.2f}")
    print(f"Score Range: {df['credit_score'].min():.1f} - {df['credit_score'].max():.1f}")
    print(f"Missing Values: {df.isnull().sum().sum()}")
    
    # 2. Farmer Type Distribution
    farmer_type_counts = df['farmer_type'].value_counts()
    print(f"\nFarmer Types:")
    for ftype, count in farmer_type_counts.items():
        print(f"  {ftype}: {count} ({count/len(df)*100:.1f}%)")
    
    # 3. Create Main Dashboard
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Shamba Score: Data Exploration Dashboard', fontsize=16, fontweight='bold')
    
    # Credit Score Distribution
    axes[0, 0].hist(df['credit_score'], bins=25, color='green', alpha=0.7, edgecolor='black')
    axes[0, 0].set_title('Credit Score Distribution')
    axes[0, 0].set_xlabel('Score')
    axes[0, 0].set_ylabel('Frequency')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Score by Farmer Type
    df.boxplot(column='credit_score', by='farmer_type', ax=axes[0, 1])
    axes[0, 1].set_title('Credit Score by Farmer Type')
    axes[0, 1].set_xlabel('Farmer Type')
    axes[0, 1].set_ylabel('Credit Score')
    
    # Score by County
    df.boxplot(column='credit_score', by='county', ax=axes[1, 0])
    axes[1, 0].set_title('Credit Score by County')
    axes[1, 0].set_xlabel('County')
    axes[1, 0].set_ylabel('Credit Score')
    axes[1, 0].tick_params(axis='x', rotation=45)
    
    # NDVI vs Credit Score
    scatter = axes[1, 1].scatter(df['mean_ndvi'], df['credit_score'], 
                               alpha=0.6, c=df['credit_score'], cmap='RdYlGn', s=30)
    axes[1, 1].set_title('NDVI vs Credit Score')
    axes[1, 1].set_xlabel('Mean NDVI (Vegetation Health)')
    axes[1, 1].set_ylabel('Credit Score')
    axes[1, 1].grid(True, alpha=0.3)
    plt.colorbar(scatter, ax=axes[1, 1], label='Credit Score')
    
    plt.tight_layout()
    plt.savefig('docs/data_exploration.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # 4. Feature Correlation Heatmap
    ml_features = [
        'mean_ndvi', 'ndvi_trend', 'growing_season_match',
        'transaction_velocity', 'savings_rate', 'loan_repayment_history',
        'cooperative_endorsement', 'chama_participation', 'neighbor_vouches',
        'fertilizer_purchase_timing', 'seed_quality_tier', 'advisory_usage',
        'drought_exposure_index', 'rainfall_deviation', 'temperature_anomaly'
    ]
    
    correlation_features = ml_features + ['credit_score']
    corr_matrix = df[correlation_features].corr()
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0, 
                square=True, fmt='.2f', cbar_kws={'label': 'Correlation'})
    plt.title('Feature Correlation Matrix', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('docs/correlation_matrix.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # 5. Generate Summary JSON for Next.js
    summary_data = {
        "dataset_info": {
            "total_farmers": len(df),
            "features_count": len(ml_features),
            "counties": df['county'].unique().tolist(),
            "date_range": {
                "start": df['registration_date'].min(),
                "end": df['registration_date'].max()
            }
        },
        "credit_score_stats": {
            "mean": round(df['credit_score'].mean(), 2),
            "median": round(df['credit_score'].median(), 2),
            "std": round(df['credit_score'].std(), 2),
            "min": round(df['credit_score'].min(), 1),
            "max": round(df['credit_score'].max(), 1)
        },
        "farmer_types": {
            "excellent": int(farmer_type_counts.get('excellent', 0)),
            "average": int(farmer_type_counts.get('average', 0)),
            "struggling": int(farmer_type_counts.get('struggling', 0))
        },
        "county_stats": df.groupby('county')['credit_score'].agg(['count', 'mean']).round(2).to_dict(),
        "top_features": corr_matrix['credit_score'].abs().sort_values(ascending=False).head(8).to_dict(),
        "visualizations": [
            "data_exploration.png",
            "correlation_matrix.png"
        ]
    }
    
    # Save summary for Next.js frontend
    with open('docs/data_summary.json', 'w') as f:
        json.dump(summary_data, f, indent=2)
    
    print("\nData exploration complete!")
    print("Generated files:")
    print("  • docs/data_exploration.png")
    print("  • docs/correlation_matrix.png") 
    print("  • docs/data_summary.json")
    print("\nReady for Next.js frontend integration!")
    
    return summary_data

if __name__ == "__main__":
    summary = explore_farmer_data()