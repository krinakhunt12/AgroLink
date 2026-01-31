from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# --- Common Schemas ---
class LocationContext(BaseModel):
    state: str = "Gujarat"
    district: str
    market: str

# --- 1. Price Prediction & XAI ---
class PricePredictionRequest(BaseModel):
    crop_name: str
    location: LocationContext
    month: int = Field(..., ge=1, le=12)
    quantity: float
    recent_prices: List[float]

class XAIExplanation(BaseModel):
    factor: str
    impact: str

class PricePredictionResponse(BaseModel):
    predicted_price: float
    confidence_score: str
    xai_explanation: List[XAIExplanation]
    unit: str = "Rs./Quintal"

# --- 2. Demand-Supply Gap ---
class GapAnalysisRequest(BaseModel):
    crop_name: str
    market: str
    current_arrival: float
    recent_prices: List[float]

class GapAnalysisResponse(BaseModel):
    market_status: str
    gap_percentage: str
    risk_level: str
    insight: str
    estimated_supply: str
    estimated_demand: str

# --- 3. Buyer Trust Engine ---
class BuyerHistory(BaseModel):
    total_deals: int
    completed_deals: int
    on_time_payments: int
    delayed_payments: int
    failed_payments: int
    disputes_count: int
    years_on_platform: float

class TrustScoreResponse(BaseModel):
    buyer_id: str
    score: float
    rank: str
    risk_level: str
    verdict: str

# --- 4. Farmer Profit Dashboard ---
class Transaction(BaseModel):
    date: str
    crop: str
    quantity: float
    price: float

class ProfitDashboardResponse(BaseModel):
    total_net_profit: float
    avg_profit_margin: str
    most_profitable_crop: str
    best_selling_windows: Dict[str, str]
    monthly_profit_trend: List[Dict]

# --- 5. Policy & MSP Awareness ---
class MSPAnalysisResponse(BaseModel):
    crop: str
    official_msp: str
    predicted_price: str
    status: str
    gap: str
    guidance: str
    risk_assessment: str

# --- 6. Blockchain Trade Ledger ---
class TradeRecordRequest(BaseModel):
    farmer_id: str
    buyer_id: str
    crop_type: str
    quantity: float
    agreed_price: float
    order_id: Optional[str] = None

class IntegritySealRequest(BaseModel):
    farmer_id: str
    buyer_id: str
    crop_type: str
    quantity: float
    agreed_price: float
    order_id: str

class IntegrityVerifyRequest(BaseModel):
    farmer_id: str
    buyer_id: str
    crop_type: str
    quantity: float
    agreed_price: float
    order_id: str
    stored_hash: str

class IntegrityVerifyResponse(BaseModel):
    is_authentic: bool
    recomputed_hash: str
    stored_hash: str
    tampered_detected: bool

class TradeRecordResponse(BaseModel):
    transaction_hash: str
    block_index: int
    status: str = "Blockchain Verified"
    timestamp: str

class BlockchainVerifyResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    latest_block_hash: str

# --- 7. Smart Contract (Escrow) ---
class ContractInitiateRequest(BaseModel):
    farmer_id: str
    buyer_id: str
    crop: str
    quantity: float
    price: float

class ContractResponse(BaseModel):
    id: str
    status: str
    price: float
    created_at: float
    released_at: Optional[float] = None
    farmer_id: str
    buyer_id: str

# --- 8. AI Anomaly & Fraud Detection ---
class AuditRequest(BaseModel):
    transaction_data: Dict
    user_data: Dict

class AuditResponse(BaseModel):
    transaction_id: str
    user_id: str
    risk_score: float
    risk_level: str
    verdict: str
    audit_code: str
    flags: List[str]
