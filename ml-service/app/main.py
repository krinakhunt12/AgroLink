# ML Service - FastAPI Application
# Provides video classification API using trained ML model

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging
from datetime import datetime

from app.model import VideoClassifier
from app.preprocessing import preprocess_text
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Agriculture Video Classification API",
    description="ML-powered API to classify agriculture videos as useful or not useful",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model
try:
    classifier = VideoClassifier()
    logger.info("✅ ML Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load ML model: {e}")
    classifier = None

# Pydantic models for request/response
class VideoInput(BaseModel):
    title: str
    description: str
    channel: Optional[str] = ""
    duration: Optional[float] = 0
    views: Optional[int] = 0
    engagement_rate: Optional[float] = 0

class VideoPrediction(BaseModel):
    is_useful: bool
    confidence: float
    category: str
    features: dict

class BatchVideoInput(BaseModel):
    videos: List[VideoInput]

class BatchPredictionResponse(BaseModel):
    predictions: List[VideoPrediction]
    processed_count: int
    timestamp: str

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Agriculture Video Classification API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": classifier is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if classifier is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    return {
        "status": "healthy",
        "model": "loaded",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/model-info")
async def model_info():
    """Get ML model information"""
    if classifier is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    return {
        "model": classifier.model_type,
        "version": classifier.version,
        "accuracy": classifier.accuracy,
        "features": classifier.feature_count,
        "classes": classifier.classes,
        "trained_on": classifier.training_date
    }

@app.post("/predict", response_model=VideoPrediction)
async def predict_video(video: VideoInput):
    """
    Predict if a single video is useful for farmers
    
    Args:
        video: Video metadata including title, description, etc.
    
    Returns:
        Prediction with confidence score and category
    """
    if classifier is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    try:
        logger.info(f"🔍 Predicting: {video.title[:50]}...")
        
        # Make prediction
        prediction = classifier.predict(
            title=video.title,
            description=video.description,
            channel=video.channel,
            duration=video.duration,
            views=video.views,
            engagement_rate=video.engagement_rate
        )
        
        logger.info(f"✅ Prediction: {prediction['is_useful']} (confidence: {prediction['confidence']:.2f})")
        
        return VideoPrediction(**prediction)
    
    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-predict", response_model=BatchPredictionResponse)
async def batch_predict(batch: BatchVideoInput):
    """
    Predict multiple videos in batch (more efficient)
    
    Args:
        batch: List of video metadata
    
    Returns:
        List of predictions
    """
    if classifier is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    
    try:
        logger.info(f"🔍 Batch predicting {len(batch.videos)} videos...")
        
        predictions = []
        for video in batch.videos:
            prediction = classifier.predict(
                title=video.title,
                description=video.description,
                channel=video.channel,
                duration=video.duration,
                views=video.views,
                engagement_rate=video.engagement_rate
            )
            predictions.append(VideoPrediction(**prediction))
        
        logger.info(f"✅ Batch prediction complete: {len(predictions)} videos processed")
        
        return BatchPredictionResponse(
            predictions=predictions,
            processed_count=len(predictions),
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"❌ Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def trigger_training():
    """
    Trigger model retraining (admin endpoint)
    In production, this should be protected with authentication
    """
    try:
        logger.info("🎓 Starting model training...")
        
        # Import training module
        from training.train_model import train_and_save_model
        
        # Train model
        metrics = train_and_save_model()
        
        # Reload classifier
        global classifier
        classifier = VideoClassifier()
        
        logger.info("✅ Model training complete and reloaded")
        
        return {
            "status": "success",
            "message": "Model trained and reloaded successfully",
            "metrics": metrics
        }
    
    except Exception as e:
        logger.error(f"❌ Training error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_statistics():
    """Get prediction statistics"""
    # In production, track these in a database
    return {
        "total_predictions": 0,  # Placeholder
        "useful_count": 0,
        "not_useful_count": 0,
        "average_confidence": 0.0
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
