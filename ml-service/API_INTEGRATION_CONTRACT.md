
# 🔌 AgroLink Frontend-Backend Integration Guide

This document outlines the API contract between the **Next.js/React Frontend** and the **FastAPI ML Backend**.

## 1. API Architecture
The backend is built using **FastAPI** with modular routers.
- **Base URL:** `http://localhost:8000`
- **Docs (Swagger):** `http://localhost:8000/docs`

---

## 2. Key Endpoints & Payloads

### A. Price Prediction (with XAI)
**Endpoint:** `POST /api/predict-price`
**Purpose:** Fetches future price forecasts and explainable AI insights.

**Request Payload:**
```json
{
  "crop_name": "Onion",
  "location": {
    "state": "Gujarat",
    "district": "Ahmedabad",
    "market": "Ahmedabad(Chimanbhai Patal Market Vasana) APMC"
  },
  "month": 1,
  "quantity": 500.0,
  "recent_prices": [2100.0, 2200.0, 2350.0]
}
```

**Response Payload:**
```json
{
  "predicted_price": 2410.5,
  "confidence_score": "96.4%",
  "xai_explanation": [
    { "factor": "Recent Price Momentum", "impact": "High" },
    { "factor": "Arrival Volume", "impact": "Moderate" }
  ],
  "unit": "Rs./Quintal"
}
```

---

### B. Demand-Supply Gap Analyzer
**Endpoint:** `POST /api/analyze-gap`
**Purpose:** Predicts market shortage or surplus for the next 7-10 days.

**Request Payload:**
```json
{
  "crop_name": "Potato",
  "market": "Surat APMC",
  "current_arrival": 850.0,
  "recent_prices": [1100, 1050, 980]
}
```

---

### C. Buyer Trust Engine
**Endpoint:** `POST /api/buyer-trust/{buyer_id}`
**Purpose:** Evaluates buyer credibility for farmer safety.

**Response:** Returns a safety rank (Highly Trusted / Low Trust) and a 0-100 reliability score.

---

### D. Farmer Profit Dashboard
**Endpoint:** `POST /api/profit-dashboard`
**Purpose:** Aggregates historical sales to show true net profit.

**Request Payload:**
```json
[
  { "date": "2025-01-10", "crop": "Onion", "quantity": 50.0, "price": 1500.0 },
  { "date": "2025-02-15", "crop": "Potato", "quantity": 100.0, "price": 1100.0 }
]
```

---

## 3. Integration Flow (Frontend to Backend)
1.  **Dashboard Load:** React frontend calls `/api/profit-dashboard` on component mount using `useEffect` or `TanStack Query`.
2.  **Market Search:** When a farmer selects a crop/mandi, the frontend calls both `/api/predict-price` and `/api/analyze-gap` in parallel.
3.  **Policy Awareness:** The frontend calls `/api/policy-awareness` to display the orange/red warning banners if the predict price is below MSP.
4.  **Buyer Profile:** Before accepting a bid, the frontend fetches `/api/buyer-trust/{id}` to show the trust badge (⭐️ Elite / ⚠️ Risky).

---
*Created for AgroLink System Engineering - 2026*
