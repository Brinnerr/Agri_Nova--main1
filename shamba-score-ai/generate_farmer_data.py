"""
Shamba Score: Training Data Generator
Generates 500 realistic farmer profiles with 15 features
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_realistic_farmer_data(n_farmers=500, seed=42):
    """Generate synthetic farmer dataset"""
    np.random.seed(seed)
    
    # Simple name generation
    first_names = ['John', 'Mary', 'Peter', 'Grace', 'David', 'Sarah', 'James', 'Lucy', 'Samuel', 'Faith']
    last_names = ['Mwangi', 'Wanjiku', 'Kamau', 'Njeri', 'Kiprotich', 'Achieng', 'Maina', 'Wambui']
    
    farmers = []
    
    # County profiles with climate characteristics
    county_profiles = {
        'Kiambu': {'drought_risk': 0.15, 'rainfall_avg': 0},
        'Nakuru': {'drought_risk': 0.20, 'rainfall_avg': -5},
        'Uasin Gishu': {'drought_risk': 0.35, 'rainfall_avg': -10},
        'Meru': {'drought_risk': 0.30, 'rainfall_avg': -8},
        'Bungoma': {'drought_risk': 0.10, 'rainfall_avg': 5}
    }
    
    for i in range(n_farmers):
        county = np.random.choice(list(county_profiles.keys()))
        profile = county_profiles[county]
        
        # Farmer type: 20% struggling, 60% average, 20% excellent
        farmer_type = np.random.choice(
            ['struggling', 'average', 'excellent'], 
            p=[0.2, 0.6, 0.2]
        )
        
        # Generate features based on farmer type
        if farmer_type == 'struggling':
            mean_ndvi = np.random.beta(3, 5)
            ndvi_trend = np.random.normal(-0.05, 0.08)
            growing_season_match = np.random.uniform(0.3, 0.6)
            transaction_velocity = np.random.poisson(15)
            savings_rate = np.random.beta(2, 12)
            loan_repayment_history = np.random.choice([0, 0.5], p=[0.6, 0.4])
            cooperative_endorsement = np.random.choice([1, 2], p=[0.5, 0.5])
            chama_participation = 0
            neighbor_vouches = np.random.poisson(0.5)
            fertilizer_purchase_timing = np.random.uniform(0.2, 0.5)
            seed_quality_tier = 1
            advisory_usage = 0
            
        elif farmer_type == 'average':
            mean_ndvi = np.random.beta(6, 3)
            ndvi_trend = np.random.normal(0.01, 0.08)
            growing_season_match = np.random.uniform(0.6, 0.85)
            transaction_velocity = np.random.poisson(35)
            savings_rate = np.random.beta(3, 7)
            loan_repayment_history = np.random.choice([0.5, 1.0], p=[0.3, 0.7])
            cooperative_endorsement = np.random.choice([3, 4], p=[0.6, 0.4])
            chama_participation = np.random.choice([0, 1], p=[0.4, 0.6])
            neighbor_vouches = np.random.poisson(2)
            fertilizer_purchase_timing = np.random.uniform(0.5, 0.8)
            seed_quality_tier = np.random.choice([1, 2], p=[0.3, 0.7])
            advisory_usage = np.random.choice([0, 1], p=[0.6, 0.4])
            
        else:  # excellent
            mean_ndvi = np.random.beta(9, 2)
            ndvi_trend = np.random.normal(0.05, 0.05)
            growing_season_match = np.random.uniform(0.85, 1.0)
            transaction_velocity = np.random.poisson(55)
            savings_rate = np.random.beta(5, 5)
            loan_repayment_history = 1.0
            cooperative_endorsement = np.random.choice([4, 5], p=[0.5, 0.5])
            chama_participation = 1
            neighbor_vouches = np.random.poisson(5)
            fertilizer_purchase_timing = np.random.uniform(0.8, 1.0)
            seed_quality_tier = np.random.choice([2, 3], p=[0.4, 0.6])
            advisory_usage = 1
        
        # Climate risk (county-specific)
        drought_exposure_index = np.clip(
            np.random.normal(profile['drought_risk'], 0.1), 0, 1
        )
        rainfall_deviation = np.random.normal(profile['rainfall_avg'], 10)
        temperature_anomaly = np.random.normal(1.5, 1.5)
        
        # Calculate credit score
        credit_score = (
            mean_ndvi * 25 +
            savings_rate * 20 +
            cooperative_endorsement * 10 +
            loan_repayment_history * 20 +
            (transaction_velocity / 60) * 15 +
            chama_participation * 10 +
            (1 - drought_exposure_index) * 5 +
            fertilizer_purchase_timing * 5
        )
        credit_score = np.clip(credit_score + np.random.normal(0, 5), 0, 100)
        
        farmer = {
            'farmer_id': f'FM{i:04d}',
            'name': f"{np.random.choice(first_names)} {np.random.choice(last_names)}",
            'phone': f'0{np.random.randint(700000000, 799999999)}',
            'registration_date': (
                datetime.now() - timedelta(days=np.random.randint(30, 730))
            ).strftime('%Y-%m-%d'),
            'age': np.random.randint(25, 65),
            'gender': np.random.choice(['M', 'F'], p=[0.6, 0.4]),
            'county': county,
            'farm_size_acres': round(np.random.lognormal(1.2, 0.8), 2),
            
            # 15 INPUT FEATURES
            'mean_ndvi': round(mean_ndvi, 3),
            'ndvi_trend': round(ndvi_trend, 3),
            'growing_season_match': round(growing_season_match, 3),
            'transaction_velocity': int(transaction_velocity),
            'savings_rate': round(savings_rate, 3),
            'loan_repayment_history': round(loan_repayment_history, 1),
            'cooperative_endorsement': int(cooperative_endorsement),
            'chama_participation': int(chama_participation),
            'neighbor_vouches': int(neighbor_vouches),
            'fertilizer_purchase_timing': round(fertilizer_purchase_timing, 3),
            'seed_quality_tier': int(seed_quality_tier),
            'advisory_usage': int(advisory_usage),
            'drought_exposure_index': round(drought_exposure_index, 3),
            'rainfall_deviation': round(rainfall_deviation, 2),
            'temperature_anomaly': round(temperature_anomaly, 2),
            
            # TARGET VARIABLE
            'credit_score': round(credit_score, 1),
            'farmer_type': farmer_type
        }
        
        farmers.append(farmer)
    
    return pd.DataFrame(farmers)

if __name__ == "__main__":
    print("Generating Shamba Score Training Data...\n")
    
    # Generate data
    df = generate_realistic_farmer_data(n_farmers=500, seed=42)
    
    # Save to CSV
    output_file = 'farmers_training_data.csv'
    df.to_csv(output_file, index=False)
    
    # Print summary
    print(f"Generated {len(df)} farmer profiles")
    print(f"Data saved to '{output_file}'")
    print(f"\nSummary Statistics:")
    print(f"   Mean Credit Score: {df['credit_score'].mean():.2f}")
    print(f"   Score Range: {df['credit_score'].min():.1f} - {df['credit_score'].max():.1f}")
    print(f"\n   Farmer Types:")
    print(df['farmer_type'].value_counts())
    print("\nReady for model training!")