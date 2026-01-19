# 🚀 Quick Start Guide - Backend Setup

## ✅ Files Created
- `.env` file with default configuration

## 📋 Prerequisites

1. **Node.js** installed (v16 or higher)
2. **MongoDB** installed and running locally OR MongoDB Atlas account

## 🔧 Setup Steps

### Option 1: Using Local MongoDB (Recommended for Development)

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Compass for GUI: https://www.mongodb.com/try/download/compass

2. **Start MongoDB**:
   ```bash
   # Windows (if installed as service, it's already running)
   # Check if running by opening MongoDB Compass or:
   mongod
   ```

3. **Install Dependencies**:
   ```bash
   cd "d:\Agro Link\backend"
   npm install
   ```

4. **Seed Database** (Optional - adds sample data):
   ```bash
   npm run seed
   ```

5. **Start Backend Server**:
   ```bash
   npm run dev
   ```

### Option 2: Using MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrolink
   ```
   Replace `username`, `password`, and `cluster` with your actual values

4. **Install Dependencies & Start**:
   ```bash
   cd "d:\Agro Link\backend"
   npm install
   npm run seed  # Optional
   npm run dev
   ```

## ⚠️ Important Commands

**ALWAYS use npm scripts, NOT direct node commands:**

✅ **Correct**:
```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm run seed     # Seed database with sample data
```

❌ **Incorrect**:
```bash
node server.js           # Wrong! File is in src/
node src/server.js       # Works but doesn't use nodemon
```

## 🎯 Verify Backend is Running

1. **Check Terminal Output**:
   You should see:
   ```
   🚀 Server running on port 5000 in development mode
   ✅ MongoDB Connected: ...
   ```

2. **Test Health Endpoint**:
   Open browser and go to: http://localhost:5000/health
   
   You should see:
   ```json
   {
     "status": "OK",
     "message": "AgroLink API is running",
     "timestamp": "2024-01-17T..."
   }
   ```

3. **Test Auth Endpoint**:
   The following endpoints should be available:
   - POST http://localhost:5000/api/auth/register
   - POST http://localhost:5000/api/auth/login
   - GET http://localhost:5000/api/auth/me

## 🐛 Troubleshooting

### Error: "Cannot find module 'D:\Agro Link\backend\server.js'"
**Solution**: Use `npm run dev` instead of `node server.js`

### Error: "MongooseServerSelectionError"
**Solution**: 
- Make sure MongoDB is running locally
- Or update MONGODB_URI in `.env` to use MongoDB Atlas
- Check if port 27017 is available

### Error: "Port 5000 is already in use"
**Solution**:
- Kill the process using port 5000
- Or change PORT in `.env` to another port (e.g., 5001)

### Error: "Cannot find module 'express'"
**Solution**: Run `npm install` to install dependencies

## 📦 Sample Data (After Seeding)

**Farmers**:
- Phone: `9876543210` | Password: `password123` | Name: રામજીભાઈ પટેલ
- Phone: `9876543211` | Password: `password123` | Name: કાનજીભાઈ આહિર

**Buyers**:
- Phone: `9876543220` | Password: `password123` | Name: મુકેશભાઈ શાહ
- Phone: `9876543221` | Password: `password123` | Name: રાજેશભાઈ પટેલ

## 🔗 Next Steps

Once backend is running:
1. ✅ Backend should be on http://localhost:5000
2. ✅ Frontend should be on http://localhost:5173
3. ✅ Test registration at http://localhost:5173/register
4. ✅ Test login at http://localhost:5173/login

## 📝 Environment Variables Explained

- **PORT**: Server port (default: 5000)
- **NODE_ENV**: Environment mode (development/production)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT tokens (change in production!)
- **JWT_EXPIRE**: Token expiration time (default: 7 days)
- **FRONTEND_URL**: Frontend URL for CORS (default: http://localhost:5173)
