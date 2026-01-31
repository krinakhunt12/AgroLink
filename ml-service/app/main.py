from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime
from typing import List, Optional

# Import Security
from .security import validate_api_key, verify_signature, rate_limit

# Import Schemas
from .schemas import (
    PricePredictionRequest, PricePredictionResponse,
    GapAnalysisRequest, GapAnalysisResponse,
    BuyerHistory, TrustScoreResponse,
    Transaction, ProfitDashboardResponse,
    MSPAnalysisResponse, XAIExplanation,
    TradeRecordRequest, TradeRecordResponse, BlockchainVerifyResponse,
    IntegritySealRequest, IntegrityVerifyRequest, IntegrityVerifyResponse,
    ContractInitiateRequest, ContractResponse,
    AuditRequest, AuditResponse
)

# Import Logic Modules
from xai_predictor import XAIPRicePredictor
from gap_analyzer import DemandSupplyGapAnalyzer
from trust_engine import BuyerTrustEngine
from profit_analyzer import FarmerProfitAnalyzer
from msp_awareness import MSPAwarenessModule
from blockchain_engine import AgricultureBlockchain
from anomaly_detector import AgricultureAnomalyDetector

app = FastAPI(title="AgroLink Intelligence API", version="2.0.0")

# Enable CORS for Frontend (React/Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize Engines ---
# Note: In a production environment, use Dependency Injection for these.
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
xai_engine = XAIPRicePredictor(model_dir=MODELS_DIR)
gap_engine = DemandSupplyGapAnalyzer(model_dir=MODELS_DIR)
trust_engine = BuyerTrustEngine()
policy_engine = MSPAwarenessModule(model_dir=MODELS_DIR)
blockchain_engine = AgricultureBlockchain(storage_path=os.path.join(MODELS_DIR, "trade_ledger.json"))
anomaly_engine = AgricultureAnomalyDetector()

@app.get("/health")
def health_check():
    return {"status": "online", "model_integrity": "verified"}

# --- Route 1: Price Prediction & XAI ---
@app.post("/api/predict-price", 
          response_model=PricePredictionResponse, 
          dependencies=[Depends(validate_api_key), Depends(verify_signature), Depends(rate_limit)])
def predict_price(request: PricePredictionRequest):
    try:
        input_data = {
            "crop_name": request.crop_name,
            "state": request.location.state,
            "district": request.location.district,
            "market": request.location.market,
            "month": request.month,
            "quantity": request.quantity,
            "recent_prices": request.recent_prices
        }
        result = xai_engine.predict_with_xai(input_data)
        return PricePredictionResponse(
            predicted_price=result['predicted_price'],
            confidence_score=result['confidence_score'],
            xai_explanation=[XAIExplanation(**item) for item in result['xai_explanation']]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Route 2: Demand-Supply Gap Analyzer ---
@app.post("/api/analyze-gap", 
          response_model=GapAnalysisResponse, 
          dependencies=[Depends(validate_api_key), Depends(verify_signature), Depends(rate_limit)])
def analyze_gap(request: GapAnalysisRequest):
    try:
        result = gap_engine.analyze_gap(
            request.crop_name, 
            request.market, 
            request.current_arrival, 
            request.recent_prices
        )
        return GapAnalysisResponse(
            market_status=result['metrics']['market_status'],
            gap_percentage=result['metrics']['gap_percentage'],
            risk_level=result['metrics']['risk_index'],
            insight=result['human_readable_insight'],
            estimated_supply=result['metrics']['estimated_supply'],
            estimated_demand=result['metrics']['estimated_demand']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Route 3: Buyer Trust Engine ---
@app.post("/api/buyer-trust/{buyer_id}", 
          response_model=TrustScoreResponse, 
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def evaluate_buyer(buyer_id: str, history: BuyerHistory):
    try:
        # Map history schema to internal logic format
        internal_history = {
            'total_deals': history.total_deals,
            'completed_deals': history.completed_deals,
            'on_time_payments': history.on_time_payments,
            'delayed_payments': history.delayed_payments,
            'failed_payments': history.failed_payments,
            'disputes_raised_by_farmers': history.disputes_count,
            'years_on_platform': history.years_on_platform
        }
        result = trust_engine.calculate_buyer_score(buyer_id, internal_history)
        return TrustScoreResponse(
            buyer_id=buyer_id,
            score=result['trust_metrics']['score'],
            rank=result['trust_metrics']['rank'],
            risk_level=result['trust_metrics']['risk_level'],
            verdict=result['interpretation']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Route 4: Farmer Profit Dashboard ---
@app.post("/api/profit-dashboard", 
          response_model=ProfitDashboardResponse, 
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def generate_profit_dashboard(transactions: List[Transaction]):
    try:
        # Convert List of Transaction objects to DataFrame
        data = []
        for t in transactions:
            data.append({
                'Date': t.date,
                'Crop': t.crop,
                'Quantity_Quintals': t.quantity,
                'Price_Per_Quintal': t.price,
                'Total_Revenue': t.quantity * t.price
            })
        df = pd.DataFrame(data)
        analyzer = FarmerProfitAnalyzer(df)
        dashboard = analyzer.generate_dashboard()
        
        return ProfitDashboardResponse(
            total_net_profit=dashboard['overall']['total_net_profit'],
            avg_profit_margin=dashboard['overall']['avg_profit_margin'],
            most_profitable_crop=dashboard['overall']['most_profitable_crop'],
            best_selling_windows=dashboard['optimal_selling_windows'],
            monthly_profit_trend=dashboard['monthly_distribution']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Route 5: Policy & MSP Awareness ---
@app.get("/api/policy-awareness", 
         response_model=MSPAnalysisResponse,
         dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def get_msp_analysis(crop: str, district: str, market: str, current_price: Optional[float] = None):
    try:
        result = policy_engine.get_policy_analysis(crop, district, market, current_price)
        return MSPAnalysisResponse(
            crop=result['crop'],
            official_msp=result['msp_info']['official_msp'],
            predicted_price=result['msp_info']['predicted_price'],
            status=result['msp_info']['status'],
            gap=result['msp_info']['gap'],
            guidance=result['policy_guidance'],
            risk_assessment=result['risk_assessment']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Background Task: Automated Price Alerts ---
@app.post("/api/alerts/process")
def trigger_alerts_scan(background_tasks: BackgroundTasks):
    """
    Endpoint to manually trigger a background alert scan 
    (In a real app, this would be a CRON job).
    """
    # Note: Using logic from price_alert_system.py
    # This is a placeholder demonstrating the background task capability
    background_tasks.add_task(print, "Logging: Background alert scan initiated at " + str(datetime.now()))
    return {"message": "Background alert processing task queued."}

# --- Route 6: Blockchain Trade Ledger ---
@app.post("/api/blockchain/seal-trade", 
          response_model=TradeRecordResponse,
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def seal_trade_on_blockchain(trade: TradeRecordRequest):
    try:
        # 1. Add trade to the pending transactions
        blockchain_engine.add_transaction(
            trade.farmer_id, 
            trade.buyer_id, 
            trade.crop_type, 
            trade.quantity, 
            trade.agreed_price
        )
        
        # 2. Mine the block (Simulation of decentralized confirmation)
        last_block = blockchain_engine.last_block
        proof = blockchain_engine.proof_of_work(last_block['proof'])
        prev_hash = blockchain_engine.hash(last_block)
        block = blockchain_engine.create_block(proof, prev_hash)
        
        return TradeRecordResponse(
            transaction_hash=blockchain_engine.hash(block),
            block_index=block['index'],
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain Error: {str(e)}")

@app.get("/api/blockchain/verify-ledger", response_model=BlockchainVerifyResponse)
def verify_blockchain_integrity():
    is_valid = blockchain_engine.verify_chain()
    return BlockchainVerifyResponse(
        is_valid=is_valid,
        total_blocks=len(blockchain_engine.chain),
        latest_block_hash=blockchain_engine.hash(blockchain_engine.last_block)
    )

@app.post("/api/blockchain/seal-integrity", 
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def seal_integrity(request: IntegritySealRequest):
    try:
        integrity_hash = blockchain_engine.seal_transaction_integrity(
            request.farmer_id, 
            request.buyer_id, 
            request.crop_type, 
            request.quantity, 
            request.agreed_price, 
            request.order_id
        )
        return {
            "integrity_hash": integrity_hash,
            "status": "Immutable Record Created",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blockchain/verify-integrity", 
          response_model=IntegrityVerifyResponse,
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def verify_integrity(request: IntegrityVerifyRequest):
    try:
        return blockchain_engine.verify_transaction_integrity(
            request.farmer_id, 
            request.buyer_id, 
            request.crop_type, 
            request.quantity, 
            request.agreed_price, 
            request.order_id, 
            request.stored_hash
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Route 7: Smart Contract Escrow ---

@app.post("/api/contracts/initiate", 
          response_model=ContractResponse,
          dependencies=[Depends(validate_api_key), Depends(verify_signature)])
def initiate_escrow(request: ContractInitiateRequest):
    try:
        contract = blockchain_engine.initiate_smart_contract(
            request.farmer_id, request.buyer_id, request.crop, request.quantity, request.price
        )
        return ContractResponse(**contract)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/contracts/dispatch/{contract_id}", response_model=ContractResponse)
def dispatch_order(contract_id: str):
    contract, error = blockchain_engine.mark_as_dispatched(contract_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return ContractResponse(**contract)

@app.post("/api/contracts/confirm/{contract_id}", response_model=ContractResponse)
def confirm_delivery_and_release(contract_id: str):
    contract, error = blockchain_engine.confirm_delivery(contract_id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return ContractResponse(**contract)

@app.get("/api/contracts/{contract_id}", response_model=ContractResponse)
def get_contract_status(contract_id: str):
    contract = blockchain_engine.get_contract(contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return ContractResponse(**contract)

# --- Route 8: AI Anomaly & Fraud Detection ---
@app.post("/api/audit-transaction", 
          response_model=AuditResponse, 
          dependencies=[Depends(validate_api_key), Depends(verify_signature), Depends(rate_limit)])
def audit_transaction(request: AuditRequest):
    try:
        audit_result = anomaly_engine.perform_full_audit(
            request.transaction_data, 
            request.user_data
        )
        return AuditResponse(
            transaction_id=audit_result['transaction_id'],
            user_id=audit_result['user_id'],
            risk_score=audit_result['risk_score'],
            risk_level=audit_result['risk_level'],
            verdict=audit_result['verdict'],
            audit_code=audit_result['audit_code'],
            flags=audit_result['behavior_integrity']['flags']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
