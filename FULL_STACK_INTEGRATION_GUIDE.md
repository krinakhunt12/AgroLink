
# 🏗️ AgroLink Full-Stack Intelligence Architecture

This document explains the three-tier integration between the **Frontend**, the **Node.js Gateway**, and the **FastAPI ML Service**.

## 1. System Architecture Diagram
```text
[ React Frontend ]  <-- (API Calls) -->  [ Node.js (Express) ]  <-- (Service Calls) -->  [ FastAPI (Python) ]
     (Next.js)                            (Gateway/Middleware)                           (ML & Intelligence)
```

---

## 2. Layer Responsibilities

### 🔹 Layer 1: React Frontend (Next.js)
*   **Role:** User Interface & Interaction.
*   **Service Layer:** `AgroLink/src/services/intelligenceService.ts`.
*   **Handling:** Manages loading states, displays TanStack Query notifications, and renders interactive dashboards.

### 🔹 Layer 2: Node.js Gateway (Express)
*   **Role:** Security, Middleware, and API Orchestration.
*   **Location:** `backend/src/routes/ml.routes.js` and `backend/src/controllers/mlController.js`.
*   **Responsibilities:**
    - Authentication & Rate Limiting.
    - Centralized Error Handling (Prevents frontend crashes).
    - Environment Variable Management (`ML_SERVICE_URL`).
    - Standardizing JSON responses for the UI.

### 🔹 Layer 3: FastAPI Intelligence Service (Python)
*   **Role:** Heavy Data Processing & ML Inference.
*   **Location:** `ml-service/app/main.py`.
*   **Responsibilities:**
    - Loading Scikit-learn models (`.pkl`).
    - Performing **Explainable AI (XAI)** analysis.
    - Running **Synthetic Demand Indexing** for market gaps.
    - Calculating weighted **Buyer Trust Scores**.

---

## 3. End-to-End Data Flow Example
**Scenario: A farmer requests a price prediction for Onions.**

1.  **Frontend:** `intelligenceService.getPricePrediction()` sends a `POST` request to `http://localhost:5000/api/intelligence/predict-price`.
2.  **Node.js Gateway:** Receives the request, logs it, and forwards it to the private FastAPI service at `http://localhost:8000/api/predict-price`.
3.  **FastAPI:** Receives the data, performs the Random Forest prediction, calculates the 96% confidence score, and identifies the top 3 influencing factors (XAI).
4.  **Node.js Gateway:** Receives the result from FastAPI, formats it into a standard `{ success: true, data: [...] }` object, and sends it back to the frontend.
5.  **Frontend:** The `UI` component receives the data and renders the price prediction with a confidence badge and a "Why this price?" info-box.

---

## 4. Key Security & Stability Features
- **Timeout Protection:** Node.js enforces a 10s timeout on all ML calls to ensure the UI doesn't hang.
- **Circuit Breaking:** If the ML service is down, Node.js caught the error and returns a clean `503 Service Unavailable` instead of crashing.
- **Type Safety:** TypeScript interfaces ensure consistent data structures from the UI down to the API.

---
*Developed for AgroLink Intelligence Implementation - 2026*
