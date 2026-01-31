
import json
from datetime import datetime

class BuyerTrustEngine:
    """
    Intelligent Trust Engine for calculating Buyer Reliability Scores.
    Uses a weighted multi-factor scoring mechanism to mitigate farmer risk.
    """
    
    # Weighted Scoring Configuration (Academic / Real-world Logic)
    WEIGHTS = {
        'transaction_success_rate': 0.35, # Frequency of completed deals
        'payment_punctuality': 0.40,     # Time-based reliability
        'dispute_impact': 0.15,          # History of conflicts (Negative Weight)
        'market_longevity': 0.10         # Trust established over time
    }

    def __init__(self):
        # In a real system, this would be a database connection.
        self.buyer_profiles = {}

    def calculate_buyer_score(self, buyer_id, history):
        """
        Calculates a normalized score (0-100) for a buyer.
        
        history format: {
            'total_deals': int,
            'completed_deals': int,
            'on_time_payments': int,
            'delayed_payments': int,
            'failed_payments': int,
            'disputes_raised_by_farmers': int,
            'years_on_platform': float
        }
        """
        
        # 1. Transaction Success Rate (0 - 100)
        success_rate = (history['completed_deals'] / history['total_deals'] * 100) if history['total_deals'] > 0 else 50
        
        # 2. Payment Reliability (0 - 100)
        total_payments = history['on_time_payments'] + history['delayed_payments'] + history['failed_payments']
        if total_payments > 0:
            payment_score = (
                (history['on_time_payments'] * 1.0) + 
                (history['delayed_payments'] * 0.4) - 
                (history['failed_payments'] * 2.0)
            ) / total_payments * 100
        else:
            payment_score = 50
        payment_score = max(0, min(100, payment_score)) # Clamp
        
        # 3. Dispute Impact (0 - 100)
        # We start with 100 and deduct for every dispute relative to deal count
        dispute_penalty = (history['disputes_raised_by_farmers'] * 15) # Heavy penalty per dispute
        dispute_score = max(0, 100 - dispute_penalty)
        
        # 4. Longevity (0 - 100)
        # Reaches max score after 3 years on platform
        longevity_score = min(100, (history['years_on_platform'] / 3.0) * 100)
        
        # Final Weighted Calculation
        final_score = (
            (success_rate * self.WEIGHTS['transaction_success_rate']) +
            (payment_score * self.WEIGHTS['payment_punctuality']) +
            (dispute_score * self.WEIGHTS['dispute_impact']) +
            (longevity_score * self.WEIGHTS['market_longevity'])
        )
        
        # Classification
        if final_score >= 85:
            rank = "HIGHLY TRUSTED"
            risk = "Low"
            desc = "Reliable buyer with excellent payment history and zero disputes."
        elif final_score >= 60:
            rank = "MODERATELY TRUSTED"
            risk = "Medium"
            desc = "Consistent buyer with occasional logistics/payment delays."
        else:
            rank = "LOW TRUST"
            risk = "High"
            desc = "High frequency of payment failures or farmer disputes. Proceed with caution."

        return {
            "buyer_id": buyer_id,
            "trust_metrics": {
                "score": round(final_score, 1),
                "rank": rank,
                "risk_level": risk
            },
            "interpretation": desc,
            "breakdown": {
                "performance": f"{round(success_rate,1)}%",
                "payment_reliability": f"{round(payment_score,1)}%",
                "dispute_clash_index": f"{history['disputes_raised_by_farmers']} active disputes"
            }
        }

# --- DEMONSTRATION ---

if __name__ == "__main__":
    engine = BuyerTrustEngine()
    
    # Scenario 1: The 'Elite Buyer' (Corporate Warehouse)
    corporate_buyer = {
        'total_deals': 150,
        'completed_deals': 148,
        'on_time_payments': 145,
        'delayed_payments': 3,
        'failed_payments': 0,
        'disputes_raised_by_farmers': 0,
        'years_on_platform': 4.5
    }
    
    # Scenario 2: The 'Risky Buyer' (New / Inconsistent)
    new_buyer = {
        'total_deals': 10,
        'completed_deals': 7,
        'on_time_payments': 4,
        'delayed_payments': 2,
        'failed_payments': 1,
        'disputes_raised_by_farmers': 2,
        'years_on_platform': 0.5
    }

    res_a = engine.calculate_buyer_score("BUYER_CORPORATE_EXPRESS", corporate_buyer)
    res_b = engine.calculate_buyer_score("BUYER_LOCAL_TRADER_01", new_buyer)

    def print_trust_report(res):
        print("\n" + "="*60)
        print(f"       AGROLINK BUYER RELIABILITY REPORT - {res['buyer_id']}       ")
        print("="*60)
        print(f"TRUST SCORE : {res['trust_metrics']['score']} / 100")
        print(f"RANK        : {res['trust_metrics']['rank']}")
        print(f"RISK LEVEL  : {res['trust_metrics']['risk_level']}")
        print("-" * 60)
        print(f"AI VERDICT  : {res['interpretation']}")
        print("-" * 60)
        print(f"METRIC BREAKDOWN:")
        print(f" - Success Rate  : {res['breakdown']['performance']}")
        print(f" - Payment Rel.  : {res['breakdown']['payment_reliability']}")
        print(f" - Dispute Count : {res['breakdown']['dispute_clash_index']}")
        print("="*60 + "\n")

    print_trust_report(res_a)
    print_trust_report(res_b)
