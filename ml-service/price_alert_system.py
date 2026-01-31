
import threading
import time
import queue
import json
from datetime import datetime
import random

# --- EVENT-DRIVEN CORE ---

class EventBus:
    """Simple Event Bus to simulate asynchronous event processing for the alert system."""
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event_type, callback):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(callback)

    def emit(self, event_type, data):
        if event_type in self.subscribers:
            for callback in self.subscribers[event_type]:
                # In a real system, this would be a background task (e.g., Celery/RabbitMQ)
                threading.Thread(target=callback, args=(data,)).start()

# --- ALERT SYSTEM LOGIC ---

class AutomatedPriceAlertSystem:
    def __init__(self, event_bus):
        self.event_bus = event_bus
        self.user_thresholds = [] # List of dicts {user_id, crop, target_price, region}
        self.running = False
        
    def add_price_alert(self, user_id, crop, target_price, region):
        self.user_thresholds.append({
            "user_id": user_id,
            "crop": crop,
            "target_price": target_price,
            "region": region
        })
        print(f"System: Price Alert set for User {user_id} ({crop} in {region} at Rs.{target_price})")

    def background_monitor_worker(self):
        """Simulates a scheduled background worker evaluating market conditions."""
        print("Worker: Background Monitor started...")
        while self.running:
            # 1. Simulate fetching latest market data (Prices, Demand, Buyers)
            # In production, this would call the ML Predictor / External APIs
            latest_market_data = self._fetch_mock_market_data()
            
            # 2. Evaluate Conditions
            for data in latest_market_data:
                # A. Check User Thresholds
                self._check_price_thresholds(data)
                
                # B. Check Demand Spikes
                self._check_demand_spikes(data)
                
                # C. Check High-Intent Buyers
                self._check_buyer_activity(data)
            
            # Simulated check interval
            time.sleep(5)

    def _check_price_thresholds(self, data):
        for alert in self.user_thresholds:
            if alert['crop'] == data['crop'] and alert['region'] == data['region']:
                if data['current_price'] >= alert['target_price']:
                    self.event_bus.emit("PRICE_THRESHOLD_REACHED", {
                        "alert_type": "Price Threshold",
                        "user_id": alert['user_id'],
                        "crop": data['crop'],
                        "region": data['region'],
                        "trigger_reason": f"Price Rs.{data['current_price']} crossed your target of Rs.{alert['target_price']}",
                        "recommended_action": "SELL NOW"
                    })

    def _check_demand_spikes(self, data):
        if data['demand_index'] > 0.8: # Sudden high demand
             self.event_bus.emit("DEMAND_SPIKE", {
                        "alert_type": "Market Demand Spike",
                        "crop": data['crop'],
                        "region": data['region'],
                        "trigger_reason": f"Sudden intensive demand (Index: {data['demand_index']}) detected in {data['region']}",
                        "recommended_action": "HOLD / WAIT (Price Rise Expected)"
                    })

    def _check_buyer_activity(self, data):
        if data['new_buyers_intent'] == "HIGH":
            self.event_bus.emit("BUYER_INTEREST", {
                        "alert_type": "New Buyer Entry",
                        "crop": data['crop'],
                        "region": data['region'],
                        "trigger_reason": "A high-volume corporate buyer has entered your local market.",
                        "recommended_action": "NEGOTIATE / SELL"
                    })

    def _fetch_mock_market_data(self):
        # Simulating dynamic market updates
        return [
            {
                "crop": "Onion",
                "region": "Ahmedabad",
                "current_price": random.randint(2200, 2600),
                "demand_index": round(random.uniform(0.4, 0.95), 2),
                "new_buyers_intent": random.choice(["NONE", "LOW", "HIGH"])
            },
            {
                "crop": "Potato",
                "region": "Surat",
                "current_price": random.randint(900, 1100),
                "demand_index": round(random.uniform(0.3, 0.6), 2),
                "new_buyers_intent": "NONE"
            }
        ]

    def start(self):
        self.running = True
        self.worker_thread = threading.Thread(target=self.background_monitor_worker)
        self.worker_thread.start()

    def stop(self):
        self.running = False
        self.worker_thread.join()

# --- ASYNCHRONOUS ALERT PROCESSORS (Subscribers) ---

def push_notification_handler(event_data):
    print(f"\n[NOTIFIER] Sent Push Alert to User: {event_data.get('user_id', 'Global')}")
    print(f" > Type: {event_data['alert_type']}")
    print(f" > Crop: {event_data['crop']} | Region: {event_data['region']}")
    print(f" > REASON: {event_data['trigger_reason']}")
    print(f" > ACTION: {event_data['recommended_action']}")

def analysis_logger_handler(event_data):
    # Simulate logging to a DB for future analytics
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = { "timestamp": timestamp, "event": event_data }
    print(f"[Analytics] Logged event into Market Intelligence DB.")

# --- DEMONSTRATION ---

if __name__ == "__main__":
    bus = EventBus()
    
    # Registering handlers (Event-Driven Architecture)
    bus.subscribe("PRICE_THRESHOLD_REACHED", push_notification_handler)
    bus.subscribe("PRICE_THRESHOLD_REACHED", analysis_logger_handler)
    bus.subscribe("DEMAND_SPIKE", push_notification_handler)
    bus.subscribe("BUYER_INTEREST", push_notification_handler)

    system = AutomatedPriceAlertSystem(bus)
    
    # 1. Setup User Alerts
    system.add_price_alert(user_id=101, crop="Onion", target_price=2400, region="Ahmedabad")
    
    # 2. Start Background Processing
    print("\n--- AGROLINK AUTOMATED ALERT SYSTEM LIVE ---")
    system.start()
    
    # Let it run for a few cycles to catch random events
    time.sleep(15)
    
    system.stop()
    print("\n--- AGROLINK AUTOMATED ALERT SYSTEM STOPPED ---")
