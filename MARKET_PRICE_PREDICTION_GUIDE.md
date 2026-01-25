# Commodity Price Prediction Guide & Market Analysis

This document provides a detailed approach to predicting current-day commodity prices using the 25-day historical government data (Agmarknet/Data.gov.in format) as shown in your current dataset for **Gujarat**.

## 1. Market Data Analysis (Current Situation)

Based on the **Daily Price Arrival Report (Jan 1, 2026 - Jan 25, 2026)** for Ahmedabad, Gujarat, we can observe the following trends for **Onion**:

### Current Market Standing (As of Jan 25, 2026)
| Variety | Price Range (₹/Quintal) | Modal Price (₹) | Sentiment |
| :--- | :--- | :--- | :--- |
| **Nasik** | 1,500 - 2,500 | **2,250** | 📈 Bullish (Rising) |
| **Local** | 1,000 - 1,900 | **1,700** | 📉 Bearish (Falling) |
| **Other** | 700 - 1,400 | **1,250** | 📉 Bearish (Falling) |

### Key Observations:
1. **Variety Decoupling**: Prices for "Nasik" variety are consistently decoupling from "Local" variety. While local onions are seeing a supply surge (lowering prices), Nasik imports to Ahmedabad are fetching a premium.
2. **High Volatility**: The "Other" variety saw a sharp drop from ₹2,150 (early Jan) to ₹1,250 (current), representing a ~42% decrease in 25 days.
3. **Predictive Indicator**: The spread between Min and Max price is widening (up to ₹1,000 difference). This indicates market uncertainty and potential for price manipulation or varying quality arrivals.

---

## 2. Prediction Methodology

To predict "Today's Price" accurately from 25 days of data, we use a **Weighted Time-Series Model**.

### Step A: Data Preparation
We must isolate the data by **Market + Commodity + Variety**. You cannot mix "Local" and "Nasik" price dates as they follow different supply chains.

### Step B: The Mathematical Model (Linear Regression)
Instead of a simple average (which ignores the trend), we use Linear Regression ($y = mx + b$):
- **$x$**: Day index (1 to 25)
- **$y$**: Modal Price
- **$m$**: The gradient (is the price going up or down daily?)
- **$b$**: The base price

**Algorithm for "Today's Prediction":**
1. Convert the last 25 days of "Arrival Date" into a sequence (1, 2, 3...25).
2. Calculate the average daily change over the last 7 days (Recent Weighting).
3. Apply the formula: `Predicted_Price = Latest_Price + (Moving_Average_Trend * 1)`.

---

## 3. Technical Implementation (AgroLink Backend)

To automate this in your current project, we should add a prediction logic to the `marketPrice.controller.js`.

### Recommended Logic:
```javascript
// Example logic for variety-based prediction
const calculatePrediction = (records) => {
    // 1. Sort by date
    const sorted = records.sort((a,b) => new Date(a.date) - new Date(b.date));
    
    // 2. Extract last 7 modal prices
    const recentPrices = sorted.slice(-7).map(r => r.modal_price);
    
    // 3. Simple Momentum Calculation
    const momentum = (recentPrices[6] - recentPrices[0]) / 6; 
    
    // 4. Project Today
    return recentPrices[6] + momentum;
};
```

---

## 4. How to Read Your Excel for Prediction
Looking at your provided image, if you want to predict the price for **Jan 26, 2026**:

1. **Locate the last 5 entries for Ahmedabad-Onion-Nasik**:
   - Jan 21: ₹2,150
   - Jan 22: ₹2,250
   - Jan 23: ₹2,300
   - Jan 24: ₹2,250
   - Jan 25: ₹2,250
2. **Observe**: The price peaked at 2,300 and has stabilized at 2,250 for the last two days. 
3. **Prediction**: The trend is flat but slightly bullish compared to the 25-day start (2,000). 
4. **Estimated Price for Today**: **₹2,250 - ₹2,275**.

---

## 5. Summary Profile
- **Current Data Context**: Gujarat Daily Arrival Report.
- **Top Performing Commodity**: Onion (Nasik Variety).
- **Market Risk**: High volatility in "Other" and "Local" varieties due to increased arrivals.
- **Recommended Action**: Farmers holding "Nasik" variety should sell now as the trend is hitting a resistance level near ₹2,300.

---
*Created for the AgroLink Market Analysis Module - Jan 25, 2026*
