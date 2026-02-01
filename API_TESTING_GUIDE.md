# 🧪 Complete API Testing Guide
## AgroLink Platform - All Endpoints

This guide provides ready-to-use API requests for testing all endpoints in the AgroLink platform.

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [Product APIs](#product-apis)
4. [Bid APIs](#bid-apis)
5. [Order APIs](#order-apis)
6. [ML Intelligence APIs](#ml-intelligence-apis)
7. [Security APIs](#security-apis)
8. [Privacy APIs](#privacy-apis)
9. [Audit APIs](#audit-apis)
10. [File Upload APIs](#file-upload-apis)

---

## 🔐 Authentication APIs

### 1. Register Farmer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ramjibhai Patel",
    "phone": "9876543210",
    "email": "ramji@example.com",
    "password": "password123",
    "userType": "farmer",
    "location": "Talala, Gir, Gujarat"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ramjibhai Patel",
    "phone": "9876543210",
    "userType": "farmer",
    "location": "Talala, Gir, Gujarat"
  }
}
```

---

### 2. Register Buyer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mukeshbhai Shah",
    "phone": "9876543220",
    "email": "mukesh@example.com",
    "password": "password123",
    "userType": "buyer",
    "location": "Ahmedabad, Gujarat"
  }'
```

---

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ramjibhai Patel",
    "phone": "9876543210",
    "userType": "farmer"
  }
}
```

---

### 4. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 5. Logout
```bash
curl -X POST http://localhost:5000/api/security/auth/logout \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 👤 User Management APIs

### 1. Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/<USER_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 2. Update Profile
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "name=Updated Name" \
  -F "location=New Location" \
  -F "avatar=@/path/to/image.jpg"
```

---

### 3. Delete Account
```bash
curl -X DELETE http://localhost:5000/api/users/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🌾 Product APIs

### 1. Get All Products
```bash
curl -X GET "http://localhost:5000/api/products?category=vegetables&minPrice=10&maxPrice=100" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 2. Get Single Product
```bash
curl -X GET http://localhost:5000/api/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 3. Create Product (Farmer Only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -F "name=Fresh Tomatoes" \
  -F "description=Organic red tomatoes from Gujarat" \
  -F "category=<CATEGORY_ID>" \
  -F "quantity=100" \
  -F "unit=kg" \
  -F "price=50" \
  -F "isNegotiable=true" \
  -F "location=Talala, Gujarat" \
  -F "image=@/path/to/tomato.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Fresh Tomatoes",
    "description": "Organic red tomatoes from Gujarat",
    "quantity": 100,
    "unit": "kg",
    "price": 50,
    "images": ["/uploads/products/tomato-123456.jpg"],
    "farmer": "507f1f77bcf86cd799439011",
    "status": "available"
  }
}
```

---

### 4. Update Product (Farmer Only)
```bash
curl -X PUT http://localhost:5000/api/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -F "price=55" \
  -F "quantity=150"
```

---

### 5. Delete Product (Farmer Only)
```bash
curl -X DELETE http://localhost:5000/api/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>"
```

---

### 6. Get Farmer's Products
```bash
curl -X GET http://localhost:5000/api/products/farmer/<FARMER_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 💰 Bid APIs

### 1. Create Bid (Buyer Only)
```bash
curl -X POST http://localhost:5000/api/bids \
  -H "Authorization: Bearer <BUYER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439012",
    "amount": 45,
    "quantity": 50,
    "message": "I would like to purchase 50kg at Rs. 45/kg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Bid created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "product": "507f1f77bcf86cd799439012",
    "buyer": "507f1f77bcf86cd799439020",
    "amount": 45,
    "quantity": 50,
    "status": "pending"
  }
}
```

---

### 2. Get My Bids (Buyer Only)
```bash
curl -X GET http://localhost:5000/api/bids/my-bids \
  -H "Authorization: Bearer <BUYER_TOKEN>"
```

---

### 3. Get Product Bids (Farmer Only)
```bash
curl -X GET http://localhost:5000/api/bids/product/<PRODUCT_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>"
```

---

### 4. Accept/Reject Bid (Farmer Only)
```bash
# Accept Bid
curl -X PUT http://localhost:5000/api/bids/<BID_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'

# Reject Bid
curl -X PUT http://localhost:5000/api/bids/<BID_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected"
  }'
```

---

## 📦 Order APIs

### 1. Create Order (Buyer Only)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <BUYER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439012",
    "quantity": 50,
    "deliveryAddress": "123 Market Street, Ahmedabad, Gujarat",
    "paymentMethod": "upi",
    "notes": "Please deliver before 5 PM"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "product": "507f1f77bcf86cd799439012",
    "buyer": "507f1f77bcf86cd799439020",
    "farmer": "507f1f77bcf86cd799439011",
    "quantity": 50,
    "totalPrice": 2500,
    "status": "pending"
  }
}
```

---

### 2. Get All Orders
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 3. Get Single Order
```bash
curl -X GET http://localhost:5000/api/orders/<ORDER_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 4. Update Order Status (Farmer Only)
```bash
curl -X PUT http://localhost:5000/api/orders/<ORDER_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "dispatched"
  }'
```

---

## 🤖 ML Intelligence APIs

### 1. Price Prediction with XAI
```bash
curl -X POST http://localhost:5000/api/intelligence/predict-price \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "crop_name": "Tomato",
    "location": {
      "state": "Gujarat",
      "district": "Ahmedabad",
      "market": "APMC Ahmedabad"
    },
    "month": 2,
    "quantity": 100,
    "recent_prices": [45, 48, 50, 52, 49]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "predicted_price": 51.5,
    "confidence_score": 0.87,
    "xai_explanation": [
      {
        "feature": "month",
        "importance": 0.35,
        "description": "February is peak season for tomatoes"
      },
      {
        "feature": "recent_trend",
        "importance": 0.28,
        "description": "Prices have been rising steadily"
      }
    ]
  }
}
```

---

### 2. Demand-Supply Gap Analysis
```bash
curl -X POST http://localhost:5000/api/intelligence/analyze-gap \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "crop_name": "Tomato",
    "market": "APMC Ahmedabad",
    "current_arrival": 5000,
    "recent_prices": [45, 48, 50, 52, 49]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "market_status": "BALANCED",
    "gap_percentage": 5.2,
    "risk_level": 0.3,
    "insight": "Market is well-balanced. Current supply meets demand.",
    "estimated_supply": 5000,
    "estimated_demand": 4750
  }
}
```

---

### 3. Buyer Trust Score
```bash
curl -X POST http://localhost:5000/api/intelligence/buyer-trust/<BUYER_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "total_deals": 50,
    "completed_deals": 48,
    "on_time_payments": 45,
    "delayed_payments": 3,
    "failed_payments": 2,
    "disputes_count": 1,
    "years_on_platform": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "buyer_id": "507f1f77bcf86cd799439020",
    "score": 88.5,
    "rank": "EXCELLENT",
    "risk_level": "LOW",
    "verdict": "Highly reliable buyer with excellent payment history"
  }
}
```

---

### 4. Farmer Profit Dashboard
```bash
curl -X POST http://localhost:5000/api/intelligence/profit-dashboard \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "date": "2026-01-15",
      "crop": "Tomato",
      "quantity": 100,
      "price": 50
    },
    {
      "date": "2026-01-20",
      "crop": "Potato",
      "quantity": 200,
      "price": 30
    }
  ]'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_net_profit": 11000,
    "avg_profit_margin": 35.5,
    "most_profitable_crop": "Tomato",
    "best_selling_windows": ["January", "February"],
    "monthly_profit_trend": {
      "January": 11000
    }
  }
}
```

---

### 5. MSP & Policy Awareness
```bash
curl -X GET "http://localhost:5000/api/intelligence/policy-awareness?crop=Wheat&district=Ahmedabad&market=APMC&current_price=2100" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "crop": "Wheat",
    "official_msp": 2125,
    "predicted_price": 2100,
    "status": "BELOW_MSP",
    "gap": -25,
    "guidance": "Current market price is below MSP. Consider selling to government procurement centers.",
    "risk_assessment": "MEDIUM"
  }
}
```

---

### 6. Blockchain - Seal Trade
```bash
curl -X POST http://localhost:5000/api/intelligence/blockchain/seal \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "507f1f77bcf86cd799439011",
    "buyer_id": "507f1f77bcf86cd799439020",
    "crop_type": "Tomato",
    "quantity": 100,
    "agreed_price": 50
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Trade permanently sealed on Blockchain",
  "data": {
    "transaction_hash": "a3f5b8c9d2e1f4a7b6c5d8e9f2a3b4c5",
    "block_index": 42,
    "timestamp": "2026-02-01T10:36:53Z"
  }
}
```

---

### 7. Blockchain - Verify Ledger
```bash
curl -X GET http://localhost:5000/api/intelligence/blockchain/verify \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "total_blocks": 42,
    "latest_block_hash": "a3f5b8c9d2e1f4a7b6c5d8e9f2a3b4c5"
  }
}
```

---

### 8. Smart Contract - Initiate Escrow
```bash
curl -X POST http://localhost:5000/api/intelligence/contracts/start-escrow \
  -H "Authorization: Bearer <BUYER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "507f1f77bcf86cd799439011",
    "buyer_id": "507f1f77bcf86cd799439020",
    "crop": "Tomato",
    "quantity": 100,
    "price": 50
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Smart Contract Escrow Initiated. Payment Locked.",
  "data": {
    "contract_id": "contract_123456",
    "status": "LOCKED",
    "amount": 5000,
    "farmer_id": "507f1f77bcf86cd799439011",
    "buyer_id": "507f1f77bcf86cd799439020"
  }
}
```

---

### 9. Smart Contract - Dispatch Order
```bash
curl -X POST http://localhost:5000/api/intelligence/contracts/dispatch/<CONTRACT_ID> \
  -H "Authorization: Bearer <FARMER_TOKEN>"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Crop marked as DISPATCHED on the Blockchain",
  "data": {
    "contract_id": "contract_123456",
    "status": "DISPATCHED"
  }
}
```

---

### 10. Smart Contract - Confirm Delivery
```bash
curl -X POST http://localhost:5000/api/intelligence/contracts/confirm-delivery/<CONTRACT_ID> \
  -H "Authorization: Bearer <BUYER_TOKEN>"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Delivery Confirmed. Payment Released to Farmer via Smart Contract.",
  "data": {
    "contract_id": "contract_123456",
    "status": "COMPLETED",
    "payment_released": true
  }
}
```

---

### 11. Get Contract Status
```bash
curl -X GET http://localhost:5000/api/intelligence/contracts/get/<CONTRACT_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 12. Fraud Detection - Audit Transaction
```bash
curl -X POST http://localhost:5000/api/intelligence/audit \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_data": {
      "amount": 5000,
      "quantity": 100,
      "price_per_unit": 50
    },
    "user_data": {
      "user_id": "507f1f77bcf86cd799439020",
      "transaction_count": 5,
      "avg_transaction_amount": 3000
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "AI Anomaly Detection Audit Complete",
  "data": {
    "transaction_id": "txn_123456",
    "user_id": "507f1f77bcf86cd799439020",
    "risk_score": 25.5,
    "risk_level": "LOW",
    "verdict": "APPROVED",
    "audit_code": "AUDIT_PASS",
    "flags": []
  }
}
```

---

## 🔒 Security APIs

### 1. Get Security Metrics (Admin Only)
```bash
curl -X GET http://localhost:5000/api/security/admin/security/metrics \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 2. Refresh Token
```bash
curl -X POST http://localhost:5000/api/security/auth/refresh-token \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🔐 Privacy APIs

### 1. Export User Data
```bash
curl -X GET http://localhost:5000/api/privacy/export-data \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Your data has been exported successfully",
  "data": {
    "user": {
      "name": "Ramjibhai Patel",
      "email": "ramji@example.com",
      "phone": "9876543210"
    },
    "products": [...],
    "orders": [...],
    "bids": [...]
  },
  "exportDate": "2026-02-01T10:36:53Z"
}
```

---

### 2. Check Deletion Eligibility
```bash
curl -X GET http://localhost:5000/api/privacy/deletion-eligibility \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

### 3. Request Account Deletion
```bash
curl -X POST http://localhost:5000/api/privacy/request-deletion \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "No longer using the platform"
  }'
```

---

### 4. Get Privacy Settings
```bash
curl -X GET http://localhost:5000/api/privacy/privacy-settings \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 📊 Audit APIs

### 1. Get Dashboard Statistics
```bash
curl -X GET "http://localhost:5000/api/audit/dashboard/stats?hours=24" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 2. Get Recent Security Events
```bash
curl -X GET "http://localhost:5000/api/audit/security/recent?limit=100" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 3. Get Failed Logins
```bash
curl -X GET "http://localhost:5000/api/audit/security/failed-logins?hours=24" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

### 4. Get Audit Logs
```bash
curl -X GET "http://localhost:5000/api/audit/logs?eventType=LOGIN_FAILED&riskLevel=HIGH&page=1&limit=50" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 📁 File Upload APIs

### 1. Upload Product Image
```bash
curl -X POST http://localhost:5000/api/upload/product-image \
  -H "Authorization: Bearer <FARMER_TOKEN>" \
  -F "file=@/path/to/image.jpg"
```

---

### 2. Upload Profile Picture
```bash
curl -X POST http://localhost:5000/api/upload/profile-picture \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "file=@/path/to/avatar.jpg"
```

---

## 🎯 Complete Test Workflow

### Scenario: Complete Order Flow

```bash
# 1. Register Farmer
FARMER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "phone": "9999999999",
    "password": "password123",
    "userType": "farmer",
    "location": "Gujarat"
  }')

FARMER_TOKEN=$(echo $FARMER_RESPONSE | jq -r '.token')

# 2. Create Product
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -F "name=Test Tomatoes" \
  -F "description=Fresh tomatoes" \
  -F "quantity=100" \
  -F "unit=kg" \
  -F "price=50")

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data._id')

# 3. Register Buyer
BUYER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Buyer",
    "phone": "8888888888",
    "password": "password123",
    "userType": "buyer",
    "location": "Gujarat"
  }')

BUYER_TOKEN=$(echo $BUYER_RESPONSE | jq -r '.token')

# 4. Create Bid
BID_RESPONSE=$(curl -s -X POST http://localhost:5000/api/bids \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"amount\": 45,
    \"quantity\": 50
  }")

BID_ID=$(echo $BID_RESPONSE | jq -r '.data._id')

# 5. Accept Bid
curl -X PUT http://localhost:5000/api/bids/$BID_ID \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'

# 6. Create Order
ORDER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"quantity\": 50,
    \"deliveryAddress\": \"Test Address\",
    \"paymentMethod\": \"upi\"
  }")

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data._id')

# 7. Update Order Status
curl -X PUT http://localhost:5000/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "dispatched"}'

echo "✅ Complete order flow tested successfully!"
```

---

## 📝 Notes

- Replace `<YOUR_TOKEN>`, `<FARMER_TOKEN>`, `<BUYER_TOKEN>`, `<ADMIN_TOKEN>` with actual JWT tokens
- Replace `<USER_ID>`, `<PRODUCT_ID>`, `<BID_ID>`, `<ORDER_ID>`, `<CONTRACT_ID>` with actual IDs
- All endpoints return JSON responses
- Failed requests return appropriate HTTP status codes (400, 401, 403, 404, 500)

---

**API Testing Guide Version**: 1.0  
**Last Updated**: February 1, 2026  
**Total Endpoints Documented**: 60+
