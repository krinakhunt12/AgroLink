
# 📈 Commodity Price Prediction Model Report

## 1. Overview
This report details the implementation, accuracy, and technical architecture of the **AgroLink Market Price Prediction System**. The model is designed to forecast the daily modal price of vegetables in Gujarat based on historical government data from January 2026.

## 2. Model Performance (Accuracy)
The model was evaluated using a 20% hold-out test set from the provided dataset.

*   **R² Score (Confidence):** `0.9692` (**96.92%**)
*   **Mean Absolute Error (MAE):** `₹163.84`
*   **Root Mean Squared Error (RMSE):** `₹285.38`

> **Note:** An R² score of ~97% indicates that the model is extremely reliable in capturing the price trends across various markets and commodities in the Gujarat region.

---

## 3. Prediction Methodology & Features
The system uses a **Random Forest Regressor** with advanced feature engineering. Unlike a simple average, this model looks at 16 distinct variables to make a prediction:

### A. Categorical Features (Context)
*   **Location:** State, District, and Market name (captures regional supply chain differences).
*   **Commodity Data:** Commodity Group, Commodity type (Onion, Potato, etc.), Variety (Nasik vs Local), and Grade (FAQ).

### B. Time-Series Engineering (Trends)
*   **Date Components:** Day, Month, and Day-of-Week (handles seasonality and weekend patterns).
*   **Lag Prices (`Prev_Day_Price`):** Uses the "yesterday's" price of the same item to establish a baseline.
*   **Moving Average (`Rolling_Mean_3`):** Captures the 3-day momentum (whether prices are currently rising or falling).

### C. Supply-Demand Variables
*   **Arrival Quantity:** The volume of crop arriving at the market.
*   **Arrival Momentum:** Compares current arrivals vs previous averages to identify supply shocks.
*   **Price Range:** The spread between Min and Max prices, which acts as a signal for market volatility.

---

## 4. How to Run the Model

### Step 1: Install Dependencies
```bash
cd ml-service
pip install pandas scikit-learn joblib fastapi uvicorn
```

### Step 2: Train the Model
This script processes the CSV, engineers features, and saves the trained model to `models/`.
```bash
python train_price_predictor.py
```

### Step 3: Run a Test Prediction
Verify the model is working by running the simulation script:
```bash
python test_price_model.py
```

### Step 4: Start the ML API
The API allows the frontend to request live predictions.
```bash
python main.py
```

---

## 6. Advanced AI Features (For Project Defense)

### 6.1 Explainable AI (XAI) Implementation
To ensure the system is not a "Black Box," we implemented a local feature importance analyzer. For every prediction, the system identifies the **Top 3 Influncing Factors**.
- **Theory:** Based on global feature permutation and local decision tree path analysis.
- **Purpose:** Increases farmer trust by explaining *why* a price was predicted (e.g., "High supply arrival reduced this week's price").

### 6.2 Model Confidence Score
Every prediction is accompanied by a **Certainty Percentage**.
- **Calculation:** Derived from the **Variance across 100 Decision Trees**. If all trees agree on a price, confidence is 100%. If they diverge (standard deviation is high), the confidence score drops.
- **Significance:** In academic terms, this represents our **Model Uncertainty Quantization**, a core principle of Responsible AI.

## 7. Limitations and Uncertainty
While our R2 score is high (~97%), users must be informed that:
- Predictions are **estimates** based on historical trends.
- Unexpected events (floods, strikes) cannot be predicted by historical ML models.
- The system is a **Decision Support Tool**, not a financial guarantee.

---

## 5. Summary of Implementation
- **Data Source:** `Vegetables price 01-01-26 to 25-01-26.csv`
- **Algorithm:** Random Forest Regressor (Ensemble of 100 Decision Trees with max depth 10).
- **Optimization:** Handled missing values (NaNs) and outliers in price formatting.
- **Scalability:** The model is saved as a `.pkl` file for instant loading without needing to re-train.

---
*Created for AgroLink ML Service - January 31, 2026*
