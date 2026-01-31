
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
AgroLink/
├── backend/                # Node.js Gateway Tier (Express)
│   ├── src/
│   │   ├── controllers/    # Request handling logic
│   │   ├── services/       # Axio-based ML Service with caching
│   │   └── routes/         # REST API definitions
│   └── server.js           # Server entry point
│
├── ml-service/             # FastAPI Intelligence Tier (Python)
│   ├── app/                # Main API application & Pydantic schemas
│   ├── models/             # Pre-trained Random Forest (.pkl) files
│   ├── datasets/           # Historical market data (CSV)
│   └── run_server.py       # Python server runner
│
└── AgroLink/               # Frontend Tier (React/Next.js)
    ├── src/
    │   ├── services/       # TypeScript API service layer
    │   └── pages/          # Dashboards and Analytics UI
```

---

## 🛠️ Setup & Local Installation

### 1. Prerequisite
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas Account

### 2. Configure Environment Variables
Create `.env` files in both `/backend` and `/ml-service` (if needed) using the provided `.env.example` templates.
Ensure `ML_SERVICE_URL=http://localhost:8000` is set in the `/backend/.env`.

### 3. Start the FastAPI Intelligence Service
```bash
cd ml-service
pip install -r requirements.txt
python run_server.py
```

### 4. Start the Node.js Gateway
```bash
cd backend
npm install
npm run dev
```

### 5. Start the Frontend
```bash
cd AgroLink
npm install
npm run dev
```

---

## 📡 API Data Flow
1.  **UI Trigger**: User interacts with a chart or search bar on the React dashboard.
2.  **Request Flow**: `Frontend Service` -> `Node.js Gateway (Port 5000)` -> `FastAPI Intelligence (Port 8000)`.
3.  **Analytics**: FastAPI loads the Scikit-learn model, performs inference, and generates XAI explanations.
4.  **Response Flow**: FastAPI returns structured JSON -> Node.js caches results -> React renders the data with animated transitions.

---

## 🔬 Academic Evaluation Points
- **Responsible AI**: Implementation of Explainable AI (XAI) to ensure transparency for farmers.
- **Microservices-Lite**: Demonstration of a dual-backend architecture handling different computational weights (I/O vs. CPU).
- **Security**: Implementation of CORS, rate limiting, and centralized middleware error handling.
- **Full-Stack Proficiency**: Integration of Python (AI/Data Science) with JavaScript/TypeScript (Web Apps).

---
*Created for the Final Year Academic Project - AgroLink Intelligence Platform 🚀*
