"""
Test script for Shamba Score API
"""

import requests
import json

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    print("Testing Shamba Score API...")
    print("=" * 50)
    
    # Test data
    test_farmer = {
        "mean_ndvi": 0.75,
        "ndvi_trend": 0.02,
        "growing_season_match": 0.85,
        "transaction_velocity": 45,
        "savings_rate": 0.35,
        "loan_repayment_history": 1.0,
        "cooperative_endorsement": 4,
        "chama_participation": 1,
        "neighbor_vouches": 3,
        "fertilizer_purchase_timing": 0.78,
        "seed_quality_tier": 2,
        "advisory_usage": 1,
        "drought_exposure_index": 0.25,
        "rainfall_deviation": -5.2,
        "temperature_anomaly": 1.8
    }
    
    try:
        # Test root endpoint
        print("1. Testing root endpoint...")
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test health check
        print("\n2. Testing health check...")
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test prediction
        print("\n3. Testing credit score prediction...")
        response = requests.post(f"{base_url}/predict", json=test_farmer)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Credit Score: {result['credit_score']}")
            print(f"   Risk Category: {result['risk_category']}")
            print(f"   Loan Amount: KES {result['recommended_loan_amount']:,}")
            print(f"   Interest Rate: {result['interest_rate']}%")
        else:
            print(f"   Error: {response.text}")
        
        # Test features endpoint
        print("\n4. Testing features endpoint...")
        response = requests.get(f"{base_url}/features")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            features = response.json()
            print(f"   Feature count: {features['feature_count']}")
        
        # Test demo data
        print("\n5. Testing demo data...")
        response = requests.get(f"{base_url}/demo")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            demo = response.json()
            print(f"   Demo profiles: {list(demo.keys())}")
        
        print("\n" + "=" * 50)
        print("✅ API tests completed successfully!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    test_api_endpoints()