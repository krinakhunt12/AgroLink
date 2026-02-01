# 🚀 Quick Start Guide - AgroLink Complete System

This guide will help you run the complete AgroLink system (Frontend + Backend + ML Service) in under 5 minutes.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Python 3.9+ installed
- ✅ MongoDB running (local or cloud)
- ✅ Git installed

---

## 🎯 Step-by-Step Setup

### Step 1: Clone and Navigate
```bash
cd "d:\Agro Link"
```

### Step 2: Setup Backend (Node.js)

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already installed)
npm install

# Create .env file (if not exists)
# Copy the content below to backend/.env
```

**Backend .env Configuration:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agrolink

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# ML Service
ML_SERVICE_URL=http://localhost:8000
ML_API_KEY=agrolink_secure_ml_key_2026
ML_SERVICE_SECRET=super_secret_ml_protection_code

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

```bash
# Start backend server
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected Successfully
```

---

### Step 3: Setup ML Service (FastAPI)

Open a **new terminal** and run:

```bash
# Navigate to ML service
cd "d:\Agro Link\ml-service"

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start ML service
python run_server.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

### Step 4: Setup Frontend (React)

Open a **new terminal** and run:

```bash
# Navigate to frontend
cd "d:\Agro Link\AgroLink"

# Install dependencies (if not already installed)
npm install

# Create .env file (if not exists)
# Copy the content below to AgroLink/.env
```

**Frontend .env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AgroLink
```

```bash
# Start frontend development server
npm run dev
```

**Expected Output:**
```
  VITE v7.2.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## ✅ Verification

### 1. Check Backend Health
Open browser: http://localhost:5000/health

**Expected Response:**
```json
{
  "status": "OK",
  "message": "AgroLink API is running",
  "timestamp": "2026-02-01T10:36:53.000Z"
}
```

### 2. Check ML Service Health
Open browser: http://localhost:8000/health

**Expected Response:**
```json
{
  "status": "ok",
  "video_model_loaded": false,
  "price_model_loaded": false
}
```

### 3. Check Frontend
Open browser: http://localhost:5173

**Expected:** You should see the AgroLink homepage

---

## 🧪 Quick Test Flow

### Test 1: Register a Farmer

1. Go to http://localhost:5173/register
2. Fill in the form:
   - Name: Test Farmer
   - Phone: 9876543210
   - Password: password123
   - User Type: Farmer
   - Location: Gujarat
3. Click Register
4. You should be redirected to login page

### Test 2: Login

1. Go to http://localhost:5173/login
2. Enter:
   - Phone: 9876543210
   - Password: password123
3. Click Login
4. You should be redirected to farmer dashboard

### Test 3: Create a Product

1. Navigate to Products section
2. Click "Add Product"
3. Fill in product details
4. Upload an image
5. Submit
6. Product should appear in your listings

### Test 4: Test ML Intelligence (via API)

```bash
# Price Prediction
curl -X POST http://localhost:5000/api/intelligence/predict-price \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "crop_name": "Tomato",
    "location": {
      "state": "Gujarat",
      "district": "Ahmedabad",
      "market": "APMC"
    },
    "month": 2,
    "quantity": 100
  }'
```

---

## 🔧 Troubleshooting

### Issue: Backend won't start

**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in backend/.env
3. If using MongoDB Atlas, check your connection string

---

### Issue: ML Service won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

---

### Issue: Frontend shows CORS error

**Error:** `Access to fetch at 'http://localhost:5000/api/...' has been blocked by CORS policy`

**Solution:**
1. Check FRONTEND_URL in backend/.env
2. Restart backend server
3. Clear browser cache

---

### Issue: JWT token expired

**Error:** `Token expired`

**Solution:**
1. Logout from the application
2. Login again
3. New token will be generated

---

## 📊 System Status Dashboard

Once all services are running, you can access:

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:5173 | Open in browser |
| Backend API | http://localhost:5000 | http://localhost:5000/health |
| ML Service | http://localhost:8000 | http://localhost:8000/health |
| API Docs (Swagger) | http://localhost:8000/docs | Open in browser |

---

## 🎯 Next Steps

After successful setup:

1. ✅ **Seed Database** (Optional):
   ```bash
   cd backend
   npm run seed
   ```
   This creates sample users, products, and categories.

2. ✅ **Explore Admin Dashboard**:
   - Login with admin credentials (if seeded)
   - Access security monitoring
   - View audit logs

3. ✅ **Test ML Features**:
   - Price Prediction
   - Demand-Supply Gap Analysis
   - Buyer Trust Scoring
   - Profit Dashboard

4. ✅ **Test Security Features**:
   - Failed login detection
   - Audit logging
   - Session management
   - Data export/deletion

---

## 🛑 Stopping Services

To stop all services:

1. **Frontend**: Press `Ctrl + C` in the frontend terminal
2. **Backend**: Press `Ctrl + C` in the backend terminal
3. **ML Service**: Press `Ctrl + C` in the ML service terminal

---

## 🔄 Restarting Services

If you need to restart:

```bash
# Backend
cd backend
npm run dev

# ML Service
cd ml-service
venv\Scripts\activate  # Windows
python run_server.py

# Frontend
cd AgroLink
npm run dev
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agrolink
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
ML_API_KEY=agrolink_secure_ml_key_2026
ML_SERVICE_SECRET=super_secret_ml_protection_code
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AgroLink
```

### ML Service (.env)
```env
API_KEY=agrolink_secure_ml_key_2026
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

---

## 🎓 For Demonstration

When demonstrating the project:

1. **Start all services** (Backend, ML, Frontend)
2. **Open browser** to http://localhost:5173
3. **Show registration** flow
4. **Show login** flow
5. **Demonstrate farmer** features (create product, view bids)
6. **Demonstrate buyer** features (browse, bid, order)
7. **Show ML features** (price prediction, gap analysis)
8. **Show security** (audit logs, failed login detection)
9. **Show privacy** (data export, account deletion)

---

## 🎉 Success!

If all services are running and you can access the frontend, **congratulations!** Your complete AgroLink system is now operational.

**System Status: ✅ READY FOR DEMONSTRATION**

---

**Quick Start Guide Version**: 1.0  
**Last Updated**: February 1, 2026  
**Estimated Setup Time**: 5-10 minutes
