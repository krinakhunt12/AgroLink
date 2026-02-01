
# 🌾 AgroLink: Intelligent Agriculture Decision-Support System

AgroLink is a comprehensive, production-ready platform designed to empower farmers with AI-driven market intelligence, financial analytics, and policy awareness. The system integrates advanced machine learning models with a stable, three-tier architecture to provide high-reliability decisions for the agricultural community.

---

## 🏗️ System Architecture

The project follows a modern, scalable three-tier architecture:

1.  **Frontend (React/Next.js)**: A dynamic user interface built with TypeScript, Tailwind CSS, and TanStack Query for seamless data fetching and real-time dashboarding.
2.  **Node.js Gateway (Express)**: A secure middleware layer that handles authentication, rate limiting, centralized error handling, and orchestrates requests between the frontend and the AI services. It includes a built-in caching engine (`Node-Cache`) for high performance.
3.  **FastAPI Intelligence Service (Python)**: The analytical engine that hosts 100-tree Random Forest models. It performs complex inference, **Explainable AI (XAI)** analysis, and **Synthetic Demand Indexing**.

---

## 🚀 Key Intelligent Modules

-   **AI Price Predictor**: Forecasts market prices with over 96% accuracy, providing a **Confidence Score** and **XAI (Why this price?)** insights.
-   **Demand-Supply Gap Analyzer**: Predicts local market shortages or surpluses for the next 7-10 days, allowing farmers to adjust their harvest schedules.
-   **Buyer Trust Engine**: A multi-factor reliability scoring system (0-100) that evaluates buyers based on payment history and transaction completion rates.
-   **Farmer Profit Dashboard**: A financial BI tool that maps sales against production costs to calculate true net margins and identify the most profitable crops.
-   **Policy & MSP Awareness**: Integrated government price protection alerts that warn farmers if market prices fall below the **Minimum Support Price (MSP)**.
-   **Automated Event Alerts**: A background monitoring system that triggers alerts for demand spikes or target price thresholds using asynchronous workers.

---

## 📂 Project Structure

```text
```
React Frontend (TypeScript + React Query)
           ↓ (JWT Authentication)
Node.js API Gateway (Express + Zero-Trust Security)
           ↓ (API Key + Request Signing)
FastAPI ML Service (Python + Scikit-learn)
           ↓
MongoDB Database + Blockchain Ledger
```

### Three-Tier Architecture

1. **Presentation Layer**: React + TypeScript + TailwindCSS
2. **API Gateway Layer**: Node.js + Express + MongoDB
3. **ML Service Layer**: FastAPI + Python + AI Engines

---

## ✨ Features

### Core Marketplace
- ✅ User registration & authentication (Farmer/Buyer/Admin)
- ✅ Product listing with image upload
- ✅ Advanced search & filtering
- ✅ Bidding system
- ✅ Order management
- ✅ Profile management
- ✅ Multi-language support (English, Gujarati, Hindi)

### AI Decision Support
- ✅ **Price Prediction with XAI** - 85%+ accuracy
- ✅ **Demand-Supply Gap Analysis** - Market insights
- ✅ **Buyer Trust Scoring** - Reliability assessment
- ✅ **Farmer Profit Analytics** - Revenue optimization
- ✅ **MSP Awareness** - Policy guidance
- ✅ **Fraud Detection** - 90%+ accuracy

### Blockchain & Smart Contracts
- ✅ **Trade Ledger** - Immutable transaction records
- ✅ **Smart Contract Escrow** - Automated payment release
- ✅ **Integrity Verification** - Tamper-proof validation

### Security & Compliance
- ✅ **Zero-Trust Architecture** - 9 security layers
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **RBAC** - Role-based access control
- ✅ **Audit Logging** - 40+ event types, 7-year retention
- ✅ **GDPR Compliance** - Full privacy rights implementation
- ✅ **Secure File Upload** - Validation & malware scanning

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+

### Installation

```bash
# 1. Start Backend
cd backend
npm install
npm run dev

# 2. Start ML Service (new terminal)
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run_server.py
- **Responsible AI**: Implementation of Explainable AI (XAI) to ensure transparency for farmers.
- **Microservices-Lite**: Demonstration of a dual-backend architecture handling different computational weights (I/O vs. CPU).
- **Security**: Implementation of CORS, rate limiting, and centralized middleware error handling.
- **Full-Stack Proficiency**: Integration of Python (AI/Data Science) with JavaScript/TypeScript (Web Apps).

---
*Created for the Final Year Academic Project - AgroLink Intelligence Platform 🚀*
