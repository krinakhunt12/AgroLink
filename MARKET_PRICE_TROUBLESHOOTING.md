# Market Price API Troubleshooting Guide

## Issue: Empty Data Array `{"success":true,"count":0,"data":[]}`

### Quick Diagnosis Steps

#### Step 1: Test the API Connection

Visit this URL in your browser or use curl:
```
http://localhost:5000/api/market-prices/test
```

This will show you:
- If the external API is responding
- The structure of the response
- How many records are being received
- A sample record

#### Step 2: Check Backend Logs

Look at your backend terminal (where `node server.js` is running) for console logs that show:
- API request parameters
- Response status
- Number of records received
- Any error messages

#### Step 3: Common Issues & Solutions

##### Issue 1: API Key Not Loaded
**Symptom**: Error message about missing API key

**Solution**:
1. Check `.env` file has: `MARKET_PRICE_API_KEY=579b464db66ec23bdd000001ac8e7840678a434e6c77797f9230665b`
2. Restart the backend server after changing `.env`
3. Verify with: `http://localhost:5000/api/market-prices/test`

##### Issue 2: External API Returns No Records
**Symptom**: `total: 14556` but `records: []` or `records: 0`

**Possible Causes**:
- The limit parameter might be causing issues
- The external API might have pagination limits
- The API might require specific filters

**Solution**:
Try the test endpoint first, then try these URLs:

```bash
# Test with no filters
http://localhost:5000/api/market-prices?limit=10

# Test with commodity filter
http://localhost:5000/api/market-prices?commodity=Wheat&limit=10

# Test states endpoint
http://localhost:5000/api/market-prices/states
```

##### Issue 3: CORS or Network Error
**Symptom**: Request fails completely

**Solution**:
1. Check if backend is running: `http://localhost:5000/health`
2. Check CORS settings in `server.js`
3. Try accessing from backend directly using curl

#### Step 4: Manual API Test

Test the external API directly:

```bash
curl "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001ac8e7840678a434e6c77797f9230665b&format=json&limit=5"
```

This will show if the external API itself is working.

### Debug Checklist

- [ ] Backend server is running (`node server.js`)
- [ ] `.env` file has the correct API key
- [ ] Test endpoint returns data: `/api/market-prices/test`
- [ ] External API is accessible (test with curl)
- [ ] Check backend console for error messages
- [ ] Try different endpoints (states, commodities, etc.)

### Expected Response from Test Endpoint

```json
{
  "success": true,
  "message": "API connection successful",
  "responseStructure": {
    "status": 200,
    "dataKeys": ["created", "updated", "active", "records", ...],
    "total": 14556,
    "count": 5,
    "limit": "5",
    "offset": "0",
    "recordsReceived": 5,
    "sampleRecord": {
      "state": "Madhya Pradesh",
      "district": "Hoshangabad",
      "market": "Pipariya APMC",
      "commodity": "Wheat",
      ...
    }
  }
}
```

### If Test Endpoint Shows Records But States Endpoint Doesn't

This means the issue is in how we're processing the data. Check:

1. **Response structure**: The records might be nested differently
2. **Data extraction**: The `map` function might be failing
3. **Filtering**: The unique set extraction might have issues

### Quick Fix Commands

```bash
# Restart backend
cd d:\Agro Link\backend
# Stop current server (Ctrl+C)
node server.js

# Test endpoints
curl http://localhost:5000/api/market-prices/test
curl http://localhost:5000/api/market-prices/states
curl "http://localhost:5000/api/market-prices?limit=5"
```

### Contact Points

If none of the above works:

1. Share the output from `/api/market-prices/test`
2. Share any error messages from backend console
3. Share the exact URL you're trying to access
4. Check if the external government API is down

### Advanced Debugging

Add this to your code to see raw response:

```javascript
console.log('Full API Response:', JSON.stringify(response.data, null, 2));
```

This will show exactly what the external API is returning.
