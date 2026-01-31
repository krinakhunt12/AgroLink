
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

def test_prediction():
    try:
        model = joblib.load('models/price_regressor.pkl')
        encoders = joblib.load('models/price_encoders.pkl')
        features = joblib.load('models/price_features.pkl')
        
        print(f"Testing Prediction with {len(features)} features...")
        
        # Mock input for Jan 26 (Future date relative to dataset)
        # We need to simulate the engineered features for a new prediction
        input_data = {
            'State': 'Gujarat',
            'District': 'Ahmedabad',
            'Market': 'Ahmedabad(Chimanbhai Patal Market Vasana) APMC',
            'Commodity Group': 'Vegetables',
            'Commodity': 'Onion',
            'Variety': 'Nasik',
            'Grade': 'FAQ',
            'Day': 26,
            'Month': 1,
            'DayOfWeek': 0, # Monday
            'Arrival Quantity': 450.0,
            'Price Range': 750.0,       # Avg spread
            'Prev_Day_Price': 2250.0,   # Last known price on Jan 24/25
            'Rolling_Mean_3': 2250.0,   # Trend
            'Prev_Day_Arrival': 444.0,  # Last volume
            'Is_Weekend': 0
        }
        
        # Encode categorical
        for col, le in encoders.items():
            if col in input_data:
                input_data[col] = le.transform([str(input_data[col])])[0]
            
        # Create DataFrame
        X = pd.DataFrame([input_data])[features]
        
        # Predict
        prediction = model.predict(X)[0]
        
        print("\n--- Prediction Result ---")
        print(f"Commodity: Onion (Nasik)")
        print(f"Market: Ahmedabad")
        print(f"Date: 26-01-2026")
        print(f"Predicted Modal Price: Rs.{prediction:.2f} / Quintal")
        print("--------------------------\n")
        
    except Exception as e:
        import traceback
        print(f"Error during test: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_prediction()
