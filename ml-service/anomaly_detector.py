import numpy as np
from typing import List, Dict, Any
from datetime import datetime

class AgricultureAnomalyDetector:
    """
    AI-Based Fraud and Anomaly Detection for Agriculture Marketplace.
    Uses a hybrid approach:
    1. Rule-Based Heuristics (Price deviation, cancellation rates)
    2. Statistical Anomaly Detection (User behavior outliers)
    """

    def __init__(self, price_deviation_threshold: float = 0.4, max_cancellation_rate: float = 0.3):
        self.price_deviation_threshold = price_deviation_threshold
        self.max_cancellation_rate = max_cancellation_rate

    def detect_pricing_anomaly(self, current_price: float, historical_prices: List[float]) -> Dict[str, Any]:
        """
        Detects if a crop price is abnormally high or low compared to historical data.
        """
        if not historical_prices:
            return {"is_anomaly": False, "score": 0.0, "reason": "No historical data"}

        avg_price = np.mean(historical_prices)
        std_price = np.std(historical_prices)
        
        # Calculate Z-score for statistical anomaly
        z_score = 0
        if std_price > 0:
            z_score = abs(current_price - avg_price) / std_price
        
        # Rule-based check: Absolute percentage deviation
        deviation = abs(current_price - avg_price) / avg_price
        
        is_anomaly = deviation > self.price_deviation_threshold or z_score > 3
        
        return {
            "is_anomaly": bool(is_anomaly),
            "score": min(z_score / 5.0, 1.0) if is_anomaly else 0.1,
            "deviation": float(deviation),
            "z_score": float(z_score),
            "reason": "Price deviation beyond threshold" if is_anomaly else "Price within normal range"
        }

    def analyze_user_behavior(self, user_history: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes buyer/farmer behavior for suspicious patterns.
        Expected user_history keys:
        - total_deals: int
        - cancelled_deals: int
        - failed_payments: int
        - average_deal_value: float
        - recent_deal_frequency: float (deals per day in last week)
        """
        risk_score = 0.0
        reasons = []

        # 1. Cancellation Rate Analysis
        if user_history.get('total_deals', 0) > 5:
            cancellation_rate = user_history['cancelled_deals'] / user_history['total_deals']
            if cancellation_rate > self.max_cancellation_rate:
                risk_score += (cancellation_rate * 0.4)
                reasons.append(f"High cancellation rate: {cancellation_rate:.2%}")

        # 2. Failed Payments Analysis
        if user_history.get('failed_payments', 0) > 2:
            risk_score += 0.3
            reasons.append(f"Multiple failed payment attempts: {user_history['failed_payments']}")

        # 3. High Frequency Burst (Bot-like behavior)
        if user_history.get('recent_deal_frequency', 0) > 10: # >10 deals/day
            risk_score += 0.3
            reasons.append("Unusually high transaction frequency (potential automation/spam)")

        # 4. Abnormal Deal Volume (Whale behavior or wash trading)
        # This would require more global context, but let's assume a static high threshold for now
        if user_history.get('average_deal_value', 0) > 500000: # 5 Lakhs
            risk_score += 0.1
            reasons.append("High value deal frequency requires additional vetting")

        # Classify Risk level
        risk_level = "Low Risk"
        if risk_score > 0.7:
            risk_level = "High Risk"
        elif risk_score > 0.3:
            risk_level = "Medium Risk"

        return {
            "risk_score": float(min(risk_score, 1.0)),
            "risk_level": risk_level,
            "flags": reasons,
            "is_suspicious": risk_score > 0.5,
            "timestamp": datetime.now().isoformat()
        }

    def perform_full_audit(self, transaction_data: Dict[str, Any], user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combined audit of a specific transaction and the user involved.
        """
        price_check = self.detect_pricing_anomaly(
            transaction_data['price'], 
            transaction_data['historical_prices']
        )
        
        behavior_check = self.analyze_user_behavior(user_data)
        
        # Final combined risk
        combined_score = max(price_check['score'], behavior_check['risk_score'])
        
        final_level = "Low Risk"
        if combined_score > 0.7 or behavior_check['risk_level'] == "High Risk":
            final_level = "High Risk"
        elif combined_score > 0.3 or behavior_check['risk_level'] == "Medium Risk":
            final_level = "Medium Risk"

        return {
            "transaction_id": transaction_data.get('id', 'N/A'),
            "user_id": user_data.get('id', 'N/A'),
            "risk_score": float(combined_score),
            "risk_level": final_level,
            "pricing_integrity": price_check,
            "behavior_integrity": behavior_check,
            "verdict": "Flagged for review" if final_level != "Low Risk" else "Auto-approved",
            "audit_code": f"AGRO-RE-{'H' if final_level == 'High Risk' else 'M' if final_level=='Medium Risk' else 'L'}-{datetime.now().strftime('%m%d%y')}"
        }

if __name__ == "__main__":
    # Test cases
    detector = AgricultureAnomalyDetector()
    
    # Test 1: High Price Anomaly
    print("Testing Pricing Anomaly:")
    print(detector.detect_pricing_anomaly(500, [100, 110, 105, 98, 112]))
    
    # Test 2: Suspicious User Behavior
    print("\nTesting User Behavior:")
    fake_buyer_data = {
        'total_deals': 10,
        'cancelled_deals': 6,
        'failed_payments': 3,
        'recent_deal_frequency': 15
    }
    print(detector.analyze_user_behavior(fake_buyer_data))
