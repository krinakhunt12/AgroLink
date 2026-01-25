# 🔑 YouTube API Key Setup Guide

## Current Issue

You're getting a **403 PERMISSION_DENIED** error, which means:
- The YouTube API key is missing, invalid, or not properly configured
- The YouTube Data API v3 might not be enabled for your project

---

## ✅ Step-by-Step Solution

### Step 1: Get a Valid YouTube API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name it: "AgroLink YouTube Integration"
   - Click "CREATE"

3. **Enable YouTube Data API v3**
   - In the search bar, type "YouTube Data API v3"
   - Click on "YouTube Data API v3"
   - Click "ENABLE"
   - Wait for it to enable (takes a few seconds)

4. **Create API Credentials**
   - Click "CREATE CREDENTIALS" button
   - Select "API key"
   - Copy the API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
   - Click "RESTRICT KEY" (recommended)

5. **Restrict the API Key (Optional but Recommended)**
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add: `http://localhost:5000/*`
     - Add: `http://localhost:5173/*`
   
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "YouTube Data API v3"
   
   - Click "SAVE"

### Step 2: Update Your .env File

Edit `d:\Agro Link\backend\.env` and update line 41:

```env
# YouTube API
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Replace with your actual API key from Step 1**

### Step 3: Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
# Start again
node server.js
```

### Step 4: Test the API

```bash
# Test YouTube endpoint
curl "http://localhost:5000/api/youtube/videos?q=wheat+farming&maxResults=5"
```

You should see a JSON response with video data!

---

## 🔍 Troubleshooting

### Error: "API key not valid"
- Make sure you copied the entire key
- Check for extra spaces before/after the key
- Verify YouTube Data API v3 is enabled

### Error: "Quota exceeded"
- YouTube API has a daily quota (10,000 units/day)
- Each search costs 100 units
- You can make ~100 searches per day
- Reset happens at midnight Pacific Time

### Error: "API key expired"
- API keys don't expire unless you delete them
- Check if the key was deleted in Google Cloud Console

### Error: Still getting 403
1. Wait 5 minutes after creating the key
2. Make sure you enabled YouTube Data API v3
3. Check if billing is enabled (required for some APIs)
4. Try creating a new API key

---

## 📊 API Quota Management

**YouTube Data API v3 Quota:**
- Daily quota: 10,000 units
- Search request: 100 units
- Video details: 1 unit
- Your app uses: ~101 units per search

**To monitor usage:**
1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Dashboard"
3. Click on "YouTube Data API v3"
4. View quota usage

---

## 🎯 Quick Fix (If You Don't Have Time)

If you can't get a YouTube API key right now, the system will automatically use **mock data** as a fallback. The videos will still display, but they won't be real YouTube videos.

To use mock data temporarily:
1. The system already has fallback logic
2. Videos will load from `MOCK_VIDEOS` constant
3. Everything will work, just with sample data

---

## ✨ Once API Key is Working

You'll see:
- ✅ Real YouTube videos about agriculture
- ✅ ML-filtered useful content
- ✅ Smart ranking by relevance
- ✅ Fresh, updated videos
- ✅ Category filtering (wheat, cotton, organic, etc.)

---

## 📝 Example Working .env

```env
# YouTube API Configuration
YOUTUBE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ML Service (optional - for advanced filtering)
ML_SERVICE_URL=http://localhost:8000
CONFIDENCE_THRESHOLD=0.7

# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrolink

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Expected Result

After adding a valid API key, when you visit the home page:

```
🔍 Searching YouTube for: "wheat farming"
📹 Found 50 videos from YouTube
✅ 35 videos passed quality filters
🤖 25 videos predicted as useful by ML
```

And you'll see beautiful, relevant agriculture videos in the UI!

---

**Need help?** Check the [YouTube Data API Documentation](https://developers.google.com/youtube/v3/getting-started)
