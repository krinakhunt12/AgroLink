import uvicorn
import os
import sys

# Ensure the root directory is in the path so we can import 'app'
sys.path.append(os.path.dirname(__file__))

if __name__ == "__main__":
    print("🚀 Starting AgroLink Integrated ML Backend...")
    print("📡 Environment: Development")
    print("🔗 API Docs: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
