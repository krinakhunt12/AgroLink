
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

class AIDecisionEngine:
    def __init__(self, model_path, encoder_path, feature_path):
        self.model = joblib.load(model_path)
        self.encoders = joblib.load(encoder_path)
        self.features = joblib.load(feature_path)
        
    def get_decision(self, market_data):
        """
        Input: market_data dict
        Output: Decision object with recommendation
        """
        # 1. Get Price Prediction (Modal Price)
        input_df = self._prepare_input(market_data)
        predicted_price = self.model.predict(input_df)[0]
        current_price = market_data.get('current_price', predicted_price * 0.95)
        
        # 2. Extract context
        perishability = market_data.get('perishability', 0.5) # 0 to 1 (1=very perishable)
        arrival_pressure = market_data.get('arrival_pressure', 0.5) # 0 to 1 (1=oversupply)
        storage_cost_per_day = market_data.get('storage_cost', 5.0) # Rs./day
        confidence = 0.96 # Hardcoded from training metrics
        
        # 3. Logic - Multi-Criteria Decision
        price_diff = predicted_price - current_price
        expected_gain = price_diff * confidence
        
        # Decision logic
        if perishability > 0.8:
            action = "SELL NOW"
            reason = "High perishability risk outweighs potential price gains."
        elif arrival_pressure > 0.8:
            action = "SELL NOW"
            reason = "Market oversupply detected. Prices expected to crash."
        elif expected_gain > (storage_cost_per_day * 5): # Significant profit expected
            action = "HOLD / WAIT"
            reason = f"Bullish trend detected. Expected gain of ₹{expected_gain:.2f} outweighs storage costs."
            wait_days = 3 if perishability < 0.3 else 1
            action += f" ({wait_days} Days)"
        elif current_price >= predicted_price:
            action = "SELL NOW"
            reason = "Market is currently at its peak. Prices are stable or declining."
        else:
            action = "STORE"
            reason = "Prices are low but long-term recovery is probable. Best to store."

        return {
            "recommendation": action,
            "reason": reason,
            "analysis": {
                "current_price": round(current_price, 2),
                "predicted_price": round(predicted_price, 2),
                "confidence": f"{confidence*100}%",
                "net_advantage": round(expected_gain, 2)
            }
        }

    def _prepare_input(self, data):
        # Helper to encode and order features for the model
        encoded = data.copy()
        # Add derived features (mocked for demo logic)
        encoded['Day'] = 26
        encoded['Month'] = 1
        encoded['DayOfWeek'] = 0
        encoded['Price Range'] = 500
        encoded['Prev_Day_Price'] = data.get('current_price', 1500)
        encoded['Rolling_Mean_3'] = data.get('current_price', 1500)
        encoded['Prev_Day_Arrival'] = data.get('arrival_quantity', 100)
        encoded['Arrival Quantity'] = data.get('arrival_quantity', 100)
        encoded['Is_Weekend'] = 0
        encoded['Commodity Group'] = "Vegetables"
        
        for col, le in self.encoders.items():
            if col in encoded:
                try:
                    encoded[col] = le.transform([str(encoded[col])])[0]
                except:
                    encoded[col] = 0
        
        return pd.DataFrame([encoded])[self.features]

# --- Demo Execution ---
if __name__ == "__main__":
    engine = AIDecisionEngine(
        'models/price_regressor.pkl',
        'models/price_encoders.pkl',
        'models/price_features.pkl'
    )
    
    # Example Scenario: Price is expected to go up, but oversupply is coming
    test_data = {
        'State': 'Gujarat',
        'District': 'Ahmedabad',
        'Market': 'Ahmedabad(Chimanbhai Patal Market Vasana) APMC',
        'Commodity': 'Onion',
        'Variety': 'Nasik',
        'Grade': 'FAQ',
        'current_price': 1800,
        'arrival_quantity': 450.0,
        'perishability': 0.2,   # Onion is low perishability
        'arrival_pressure': 0.3 # Low supply pressure
    }
    
    result = engine.get_decision(test_data)
    print("\n--- AI DECISION ENGINE OUTPUT ---")
    print(f"RECOMMENDATION: {result['recommendation']}")
    print(f"REASONING: {result['reason']}")
    print(f"ANALYTICS: {result['analysis']}")
