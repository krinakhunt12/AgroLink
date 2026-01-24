from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import joblib
import os

app = FastAPI(title="AgroLink ML Service")

# Load model
MODEL_PATH = "models/agri_classifier.pkl"
model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    print("Warning: Model file not found. Please run train_model.py first.")

class VideoMetadata(BaseModel):
    videoId: str
    title: str
    description: str

class PredictionRequest(BaseModel):
    videos: List[VideoMetadata]

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
def predict_videos(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    results = []
    
    for video in request.videos:
        # Combine title and description for classification
        text = f"{video.title} {video.description}"
        
        # Predict
        prob = model.predict_proba([text])[0] # [prob_0, prob_1]
        prediction = int(model.predict([text])[0])
        confidence = float(prob[prediction])
        
        results.append({
            "videoId": video.videoId,
            "is_useful": bool(prediction),
            "confidence": confidence
        })
        
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
