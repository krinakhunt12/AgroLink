
import joblib
import pandas as pd
from datetime import datetime

class MSPAwarenessModule:
    """
    Integrates Government MSP Policy with AI Price Predictions.
    Ensures farmers are aware of price protection and potential undervaluation.
    """

    def __init__(self, model_dir='models'):
        # Official MSP Data (Sample for 2025-26 Season - India)
        # In a real system, this would be fetched from a Gov API or Database
        self.msp_data = {
            'Wheat': 2275,
            'Onion': 1500,  # Estimated as it varies by season/scheme
            'Potato': 1200,
            'Cotton': 6620,
            'Tomato': 1000,
            'Paddy': 2183
        }
        
        try:
            self.model = joblib.load(f'{model_dir}/price_regressor.pkl')
            self.encoders = joblib.load(f'{model_dir}/price_encoders.pkl')
            self.features = joblib.load(f'{model_dir}/price_features.pkl')
        except:
            self.model = None
            print("Warning: Prediction model not loaded. Using manual price inputs.")

    def get_policy_analysis(self, crop, district, market, current_price=None, arrival_qty=100):
        """
        Compares AI prediction and current price with Government MSP.
        """
        msp_value = self.msp_data.get(crop, 0)
        
        # 1. Get AI Prediction
        predicted_price = 0
        if self.model:
            # Prepare minimal input for prediction
            input_data = {
                'State': 'Gujarat', 'District': district, 'Market': market,
                'Commodity Group': 'Vegetables', 'Commodity': crop,
                'Variety': 'Other', 'Grade': 'FAQ', 'Day': datetime.now().day,
                'Month': datetime.now().month, 'DayOfWeek': datetime.now().weekday(),
                'Arrival Quantity': arrival_qty, 'Price Range': 500.0,
                'Prev_Day_Price': current_price or 1500, 'Rolling_Mean_3': current_price or 1500,
                'Prev_Day_Arrival': arrival_qty, 'Is_Weekend': 0
            }
            
            # Simple encoding fallback
            for col, le in self.encoders.items():
                val = str(input_data.get(col, ""))
                input_data[col] = le.transform([val])[0] if val in le.classes_ else 0
            
            X = pd.DataFrame([input_data])[self.features]
            predicted_price = round(float(self.model.predict(X)[0]), 2)
        
        # 2. Compare with MSP
        # We use current_price if available, else predicted_price
        target_check = current_price if current_price else predicted_price
        diff = target_check - msp_value
        status = "ABOVE MSP" if diff >= 0 else "BELOW MSP"
        
        # 3. Generate Guidance
        if status == "BELOW MSP":
            guidance = "WARNING: Market price is below MSP. Consider selling to government procurement centers or holding stock."
            protection_level = "HIGH RISK (Undervaluation)"
        else:
            guidance = "Market price is above MSP. Favorable selling conditions in the open market."
            protection_level = "SAFE (Market Profitable)"

        return {
            "crop": crop,
            "msp_info": {
                "official_msp": f"Rs.{msp_value}",
                "predicted_price": f"Rs.{predicted_price}",
                "status": status,
                "gap": f"Rs.{abs(round(diff, 2))}"
            },
            "policy_guidance": guidance,
            "risk_assessment": protection_level,
            "details": {
                "market": market,
                "district": district,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
            }
        }

if __name__ == "__main__":
    module = MSPAwarenessModule()
    
    # 🧪 Scenario A: Market price is healthy
    analysis_a = module.get_policy_analysis("Onion", "Ahmedabad", "Ahmedabad(Chimanbhai Patal Market Vasana) APMC", current_price=2200)
    
    # 🧪 Scenario B: Market price crashes below MSP
    analysis_b = module.get_policy_analysis("Potato", "Surat", "Surat APMC", current_price=900)

    def print_msp_report(res):
        print("\n" + "#"*65)
        print(f"      AGROLINK POLICY & MSP AWARENESS REPORT      ")
        print("#"*65)
        print(f"CROP: {res['crop']} | MARKET: {res['details']['market']}")
        print("-" * 65)
        print(f"GOVERNMENT MSP   : {res['msp_info']['official_msp']}")
        print(f"AI PREDICTED     : {res['msp_info']['predicted_price']}")
        print(f"POLICY STATUS    : {res['msp_info']['status']}")
        print(f"DIFFERENCE       : {res['msp_info']['gap']}")
        print("-" * 65)
        print(f"ASSESSMENT       : {res['risk_assessment']}")
        print(f"GUIDANCE         : {res['policy_guidance']}")
        print("#"*65 + "\n")

    print_msp_report(analysis_a)
    print_msp_report(analysis_b)
