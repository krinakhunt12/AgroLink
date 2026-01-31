from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import joblib
import os
import pandas as pd
from datetime import datetime

app = FastAPI(title="AgroLink ML Service")

# --- Model Loading ---

# 1. Video Classifier
VIDEO_MODEL_PATH = "models/agri_classifier.pkl"
video_model = None
if os.path.exists(VIDEO_MODEL_PATH):
    video_model = joblib.load(VIDEO_MODEL_PATH)
    print("Video classifier loaded.")

# 2. Price Predictor
PRICE_MODEL_PATH = "models/price_regressor.pkl"
PRICE_ENCODERS_PATH = "models/price_encoders.pkl"
PRICE_FEATURES_PATH = "models/price_features.pkl"

price_model = None
price_encoders = None
price_features = None

if all(os.path.exists(p) for p in [PRICE_MODEL_PATH, PRICE_ENCODERS_PATH, PRICE_FEATURES_PATH]):
    price_model = joblib.load(PRICE_MODEL_PATH)
    price_encoders = joblib.load(PRICE_ENCODERS_PATH)
    price_features = joblib.load(PRICE_FEATURES_PATH)
    print("Price predictor loaded.")
else:
    print("Warning: Price prediction models not found. Run train_price_predictor.py first.")

# --- Pydantic Models ---

class VideoMetadata(BaseModel):
    videoId: str
    title: str
    description: str

class PredictionRequest(BaseModel):
    videos: List[VideoMetadata]

class PricePredictionRequest(BaseModel):
    state: str = "Gujarat"
    district: str
    market: str
    commodity: str
    variety: str
    grade: str
    arrival_date: str  # Format: YYYY-MM-DD or DD-MM-YYYY
    arrival_quantity: float = 0.0

# --- Endpoints ---

@app.get("/health")
def health():
    return {
        "status": "ok", 
        "video_model_loaded": video_model is not None,
        "price_model_loaded": price_model is not None
    }

@app.post("/predict")
def predict_videos(request: PredictionRequest):
    if video_model is None:
        raise HTTPException(status_code=500, detail="Video model not loaded")
    
    results = []
    for video in request.videos:
        text = f"{video.title} {video.description}"
        prob = video_model.predict_proba([text])[0]
        prediction = int(video_model.predict([text])[0])
        confidence = float(prob[prediction])
        
        results.append({
            "videoId": video.videoId,
            "is_useful": bool(prediction),
            "confidence": confidence
        })
    return {"results": results}

@app.post("/predict-price")
def predict_price(request: PricePredictionRequest):
    if price_model is None or price_encoders is None:
        raise HTTPException(status_code=500, detail="Price prediction model not loaded")
    
    try:
        # 1. Parse Date
        try:
            dt = datetime.strptime(request.arrival_date, "%Y-%m-%d")
        except ValueError:
            dt = datetime.strptime(request.arrival_date, "%d-%m-%Y")
        
        # 2. Prepare Input Data with defaults for new features
        # In a real app, you would fetch Prev_Day_Price from a database
        input_data = {
            'State': request.state,
            'District': request.district,
            'Market': request.market,
            'Commodity Group': "Vegetables", # Default for this dataset
            'Commodity': request.commodity,
            'Variety': request.variety,
            'Grade': request.grade,
            'Day': dt.day,
            'Month': dt.month,
            'DayOfWeek': dt.weekday(),
            'Arrival Quantity': request.arrival_quantity,
            'Price Range': 500.0, # Average spread default
            'Prev_Day_Price': 1500.0, # Base default
            'Rolling_Mean_3': 1500.0, # Base default
            'Prev_Day_Arrival': request.arrival_quantity,
            'Is_Weekend': 1 if dt.weekday() >= 5 else 0
        }
        
        # 3. Encode Categorical Features
        for col, encoder in price_encoders.items():
            val = str(input_data.get(col, ""))
            try:
                input_data[col] = encoder.transform([val])[0]
            except ValueError:
                input_data[col] = 0 
        
        # 4. Create DataFrame in correct order
        X = pd.DataFrame([input_data])[price_features]
        
        # 5. Predict
        predicted_price = float(price_model.predict(X)[0])
        
        return {
            "predicted_modal_price": round(predicted_price, 2),
            "unit": "Rs./Quintal",
            "currency": "INR"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
