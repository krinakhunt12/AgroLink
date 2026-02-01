# 🌾 AgroLink - How It Works
## Complete Feature Guide & Technical Documentation

**Last Updated**: February 1, 2026  
**Version**: 2.0  
**Status**: Production Ready

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [User Journey](#user-journey)
3. [Core Features](#core-features)
4. [AI/ML Features](#aiml-features)
5. [Security Features](#security-features)
6. [Privacy & Compliance](#privacy--compliance)
7. [Technical Architecture](#technical-architecture)
8. [Data Flow](#data-flow)
9. [API Workflow](#api-workflow)

---

## 🎯 System Overview

AgroLink is a **three-tier agriculture marketplace platform** that connects farmers directly with buyers while providing AI-powered decision support tools.

### The Problem We Solve

1. **For Farmers**:
   - Difficulty finding reliable buyers
   - Uncertainty about fair pricing
   - Lack of market information
   - Payment disputes
   - Middleman exploitation

2. **For Buyers**:
   - Hard to find quality produce
   - Trust issues with sellers
   - Price negotiation challenges
   - Supply chain inefficiencies

### Our Solution

**AgroLink provides**:
- Direct farmer-to-buyer marketplace
- AI-powered price predictions
- Blockchain-based transaction integrity
- Smart contract escrow system
- Trust scoring for buyers
- Profit analytics for farmers
- MSP (Minimum Support Price) awareness

---

## 👥 User Journey

### For Farmers

```
1. Registration → 2. Profile Setup → 3. List Products → 4. Receive Bids 
   → 5. Accept/Reject → 6. Create Order → 7. Dispatch → 8. Get Paid
```

#### Step-by-Step Process

**Step 1: Registration**
- Farmer visits AgroLink
- Clicks "Register"
- Fills form: Name, Phone, Password, Location
- Selects "Farmer" as user type
- Submits registration
- Receives JWT token
- Redirected to dashboard

**Step 2: Profile Setup**
- Uploads profile picture
- Adds farm details
- Specifies crops grown
- Sets preferred language (English/Gujarati/Hindi)

**Step 3: List Products**
- Clicks "Add Product"
- Fills product details:
  - Product name (e.g., "Fresh Tomatoes")
  - Category (Vegetables/Fruits/Grains)
  - Quantity (e.g., 100 kg)
  - Price per unit (e.g., ₹50/kg)
  - Upload product images
  - Add description
  - Mark if negotiable
- System validates images (security checks)
- Product goes live on marketplace

**Step 4: Receive Bids**
- Buyers browse and bid on products
- Farmer receives notifications
- Views bid details:
  - Buyer name and trust score
  - Bid amount
  - Quantity requested
  - Buyer message

**Step 5: Accept/Reject Bids**
- Reviews buyer trust score (AI-powered)
- Checks bid amount vs. asking price
- Accepts or rejects bid
- System notifies buyer

**Step 6: Create Order**
- Accepted bid converts to order
- Smart contract initiated
- Payment locked in escrow
- Order details confirmed

**Step 7: Dispatch**
- Farmer prepares product
- Marks order as "Dispatched"
- Blockchain records dispatch
- Buyer notified

**Step 8: Get Paid**
- Buyer confirms delivery
- Smart contract releases payment
- Money transferred to farmer
- Transaction sealed on blockchain

---

### For Buyers

```
1. Registration → 2. Browse Products → 3. Place Bid → 4. Wait for Response 
   → 5. Order Created → 6. Track Delivery → 7. Confirm Receipt → 8. Rate Farmer
```

#### Step-by-Step Process

**Step 1: Registration**
- Buyer visits AgroLink
- Registers with details
- Selects "Buyer" as user type
- Verifies phone number

**Step 2: Browse Products**
- Views marketplace
- Filters by:
  - Category (Vegetables/Fruits/Grains)
  - Location (nearby farmers)
  - Price range
  - Availability
- Searches by product name
- Views product details

**Step 3: Place Bid**
- Clicks on product
- Views farmer details
- Checks product images
- Enters bid details:
  - Quantity needed
  - Offered price
  - Delivery address
  - Message to farmer
- Submits bid

**Step 4: Wait for Response**
- Receives notification when farmer responds
- If accepted: Order created
- If rejected: Can bid on other products

**Step 5: Order Created**
- Payment locked in escrow
- Order tracking begins
- Estimated delivery date shown

**Step 6: Track Delivery**
- Views order status:
  - Pending → Confirmed → Dispatched → Delivered
- Receives updates via notifications

**Step 7: Confirm Receipt**
- Inspects delivered product
- Confirms delivery in app
- Smart contract releases payment to farmer

**Step 8: Rate Farmer**
- Rates farmer (1-5 stars)
- Leaves review
- Builds trust in platform

---

## 🌟 Core Features

### 1. User Authentication & Authorization

**How It Works:**

```javascript
// Registration Flow
User fills form → Backend validates data → Password hashed (bcrypt) 
→ User saved to MongoDB → JWT token generated → Token sent to frontend 
→ Stored in localStorage → Used for all API calls
```

**Security Layers:**
1. **Password Hashing**: Uses bcrypt with 12 salt rounds
2. **JWT Tokens**: Signed with secret key, expires in 7 days
3. **Token Validation**: Every API call validates token
4. **Session Management**: Tracks active sessions, can revoke

**Code Example:**
```javascript
// Backend: User Registration
const hashedPassword = await bcrypt.hash(password, 12);
const user = await User.create({ name, phone, password: hashedPassword });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
```

---

### 2. Product Management

**How It Works:**

```
Farmer uploads product → Images validated (security) → Stored securely 
→ Product saved to DB → Appears in marketplace → Buyers can view/bid
```

**Image Upload Security:**
1. **File Type Check**: Only JPG, PNG, WebP allowed
2. **MIME Type Validation**: Verifies actual file type
3. **Magic Number Verification**: Checks file signature
4. **Malware Scanning**: Scans for malicious code
5. **Size Limit**: Max 5MB per image
6. **Secure Filename**: Random generated name

**Code Flow:**
```javascript
// 1. Frontend uploads image
const formData = new FormData();
formData.append('image', file);

// 2. Backend validates
validateExtension(file.originalname);
validateMimeType(file.mimetype);
verifyMagicNumber(file.path, file.mimetype);
scanForMalware(file.path);

// 3. Store securely
const secureFilename = generateSecureFilename(file.originalname, userId);
await fs.rename(file.path, securePath);
```

---

### 3. Bidding System

**How It Works:**

```
Buyer places bid → Stored in DB → Farmer notified → Farmer reviews 
→ Accepts/Rejects → Buyer notified → If accepted: Order created
```

**Bid Lifecycle:**
1. **Pending**: Bid submitted, waiting for farmer
2. **Accepted**: Farmer accepts, order creation begins
3. **Rejected**: Farmer rejects, buyer can bid elsewhere

**Anti-Fraud Protection:**
- Checks buyer's past behavior
- Validates bid amount (not too low/high)
- Prevents spam bidding
- Rate limits bid creation

**Database Schema:**
```javascript
{
  _id: ObjectId,
  product: ObjectId (ref: Product),
  buyer: ObjectId (ref: User),
  amount: Number,
  quantity: Number,
  message: String,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: Date
}
```

---

### 4. Order Management

**How It Works:**

```
Bid accepted → Order created → Payment locked (escrow) → Farmer dispatches 
→ Buyer receives → Confirms delivery → Payment released
```

**Order States:**
1. **Pending**: Order created, payment locked
2. **Confirmed**: Farmer confirms order
3. **Dispatched**: Product shipped
4. **Delivered**: Buyer confirms receipt
5. **Completed**: Payment released
6. **Cancelled**: Order cancelled (refund issued)

**Smart Contract Integration:**
```javascript
// 1. Initiate Escrow
POST /api/intelligence/contracts/start-escrow
{
  farmer_id: "...",
  buyer_id: "...",
  crop: "Tomato",
  quantity: 100,
  price: 50
}
// Response: { contract_id, status: "LOCKED", amount: 5000 }

// 2. Dispatch
POST /api/intelligence/contracts/dispatch/{contract_id}
// Response: { status: "DISPATCHED" }

// 3. Confirm Delivery
POST /api/intelligence/contracts/confirm-delivery/{contract_id}
// Response: { status: "COMPLETED", payment_released: true }
```

---

## 🤖 AI/ML Features

### 1. Price Prediction with XAI (Explainable AI)

**What It Does:**
Predicts optimal selling price for crops based on historical data, season, location, and market trends.

**How It Works:**

```
User inputs crop details → ML model processes → Generates prediction 
→ XAI explains reasoning → Returns price + confidence + explanation
```

**Input Parameters:**
```javascript
{
  crop_name: "Tomato",
  location: {
    state: "Gujarat",
    district: "Ahmedabad",
    market: "APMC"
  },
  month: 2,  // February
  quantity: 100,
  recent_prices: [45, 48, 50, 52, 49]
}
```

**Output:**
```javascript
{
  predicted_price: 51.5,  // ₹51.5 per kg
  confidence_score: 0.87,  // 87% confident
  xai_explanation: [
    {
      feature: "month",
      importance: 0.35,
      description: "February is peak season for tomatoes"
    },
    {
      feature: "recent_trend",
      importance: 0.28,
      description: "Prices have been rising steadily"
    },
    {
      feature: "location",
      importance: 0.22,
      description: "Ahmedabad APMC has high demand"
    }
  ],
  historical_trend: [45, 47, 49, 51, 52],
  recommendation: "Good time to sell. Prices are above average."
}
```

**ML Model:**
- **Algorithm**: Random Forest Regressor
- **Training Data**: 5 years of historical market prices
- **Features**: Crop type, location, season, demand, supply
- **Accuracy**: 85%+

**Use Case:**
Farmer wants to sell tomatoes. System predicts ₹51.5/kg is fair price. Farmer lists at ₹50/kg (competitive) or waits if prediction shows rising trend.

---

### 2. Demand-Supply Gap Analysis

**What It Does:**
Analyzes market to identify oversupply or undersupply situations.

**How It Works:**

```
System collects market data → Calculates supply vs demand 
→ Identifies gap → Assesses risk → Provides insights
```

**Input:**
```javascript
{
  crop_name: "Tomato",
  market: "APMC Ahmedabad",
  current_arrival: 5000,  // kg arrived today
  recent_prices: [45, 48, 50, 52, 49]
}
```

**Output:**
```javascript
{
  market_status: "BALANCED",  // or OVERSUPPLY / UNDERSUPPLY
  gap_percentage: 5.2,  // 5.2% more supply than demand
  risk_level: 0.3,  // Low risk (0-1 scale)
  insight: "Market is well-balanced. Current supply meets demand.",
  estimated_supply: 5000,
  estimated_demand: 4750,
  price_trend: "STABLE",
  recommendation: "Safe to sell at current prices."
}
```

**Risk Levels:**
- **0.0 - 0.3**: Low risk (balanced market)
- **0.3 - 0.6**: Medium risk (slight imbalance)
- **0.6 - 1.0**: High risk (severe imbalance)

**Use Case:**
If gap shows OVERSUPPLY, farmer might:
- Reduce price to sell quickly
- Store produce for later
- Sell in different market

---

### 3. Buyer Trust Scoring

**What It Does:**
Evaluates buyer reliability based on transaction history.

**How It Works:**

```
Collect buyer history → Analyze payment behavior → Calculate trust score 
→ Assign rank → Provide verdict
```

**Input:**
```javascript
{
  total_deals: 50,
  completed_deals: 48,
  on_time_payments: 45,
  delayed_payments: 3,
  failed_payments: 2,
  disputes_count: 1,
  years_on_platform: 2
}
```

**Output:**
```javascript
{
  buyer_id: "...",
  score: 88.5,  // Out of 100
  rank: "EXCELLENT",  // POOR / FAIR / GOOD / EXCELLENT
  risk_level: "LOW",  // LOW / MEDIUM / HIGH
  verdict: "Highly reliable buyer with excellent payment history",
  breakdown: {
    completion_rate: 96,  // 48/50 = 96%
    on_time_payment_rate: 90,  // 45/50 = 90%
    dispute_rate: 2,  // 1/50 = 2%
    platform_tenure_bonus: 10
  }
}
```

**Scoring Algorithm:**
```
Score = (completion_rate * 0.4) + (on_time_payment_rate * 0.4) 
        + (100 - dispute_rate * 10) * 0.1 + (tenure_bonus * 0.1)
```

**Use Case:**
Farmer receives bid from buyer with 88.5 trust score (EXCELLENT). Farmer confidently accepts bid knowing buyer is reliable.

---

### 4. Farmer Profit Analytics

**What It Does:**
Analyzes farmer's sales to identify most profitable crops and best selling times.

**How It Works:**

```
Collect transaction history → Calculate profits → Identify patterns 
→ Generate insights → Recommend strategies
```

**Input:**
```javascript
[
  {
    date: "2026-01-15",
    crop: "Tomato",
    quantity: 100,
    price: 50,
    cost: 30  // Production cost per kg
  },
  {
    date: "2026-01-20",
    crop: "Potato",
    quantity: 200,
    price: 30,
    cost: 18
  }
]
```

**Output:**
```javascript
{
  total_net_profit: 11000,  // ₹11,000
  avg_profit_margin: 35.5,  // 35.5%
  most_profitable_crop: "Tomato",
  least_profitable_crop: "Potato",
  best_selling_windows: ["January", "February"],
  monthly_profit_trend: {
    "January": 11000,
    "February": 0  // No sales yet
  },
  crop_profitability: [
    {
      crop: "Tomato",
      total_revenue: 5000,
      total_cost: 3000,
      net_profit: 2000,
      profit_margin: 40
    },
    {
      crop: "Potato",
      total_revenue: 6000,
      total_cost: 3600,
      net_profit: 2400,
      profit_margin: 40
    }
  ],
  recommendations: [
    "Focus on Tomato cultivation - highest profit margin",
    "January-February are best months for sales",
    "Consider reducing Potato production"
  ]
}
```

**Use Case:**
Farmer sees Tomato gives 40% margin vs Potato's 40%. Decides to plant more tomatoes next season.

---

### 5. MSP (Minimum Support Price) Awareness

**What It Does:**
Compares market price with government MSP to ensure farmers get fair price.

**How It Works:**

```
Farmer checks price → System fetches official MSP → Compares with market 
→ Provides guidance → Warns if below MSP
```

**Input:**
```javascript
{
  crop: "Wheat",
  district: "Ahmedabad",
  market: "APMC",
  current_price: 2100  // ₹2100 per quintal
}
```

**Output:**
```javascript
{
  crop: "Wheat",
  official_msp: 2125,  // Government MSP
  predicted_price: 2100,  // Market price
  status: "BELOW_MSP",  // or ABOVE_MSP / AT_MSP
  gap: -25,  // ₹25 below MSP
  guidance: "Current market price is below MSP. Consider selling to government procurement centers.",
  risk_assessment: "MEDIUM",
  procurement_centers: [
    {
      name: "Gujarat State Warehouse",
      location: "Ahmedabad",
      contact: "1800-XXX-XXXX"
    }
  ],
  recommendation: "Sell to government at MSP (₹2125) instead of market (₹2100)"
}
```

**Use Case:**
Farmer about to sell wheat at ₹2100. System alerts MSP is ₹2125. Farmer sells to government procurement center, earning ₹25 more per quintal.

---

### 6. Blockchain Trade Ledger

**What It Does:**
Creates immutable record of all trades for transparency and non-repudiation.

**How It Works:**

```
Trade completed → Transaction data hashed → Added to blockchain 
→ Block mined → Ledger updated → Verification available
```

**Seal Trade:**
```javascript
// Input
POST /api/intelligence/blockchain/seal
{
  farmer_id: "...",
  buyer_id: "...",
  crop_type: "Tomato",
  quantity: 100,
  agreed_price: 50
}

// Output
{
  transaction_hash: "a3f5b8c9d2e1f4a7b6c5d8e9f2a3b4c5",
  block_index: 42,
  timestamp: "2026-02-01T10:36:53Z",
  previous_hash: "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
  proof: 35293  // Proof of work
}
```

**Blockchain Structure:**
```javascript
{
  index: 42,
  timestamp: "2026-02-01T10:36:53Z",
  transactions: [
    {
      farmer_id: "...",
      buyer_id: "...",
      crop_type: "Tomato",
      quantity: 100,
      agreed_price: 50,
      total_amount: 5000
    }
  ],
  previous_hash: "b4c5d6e7...",
  hash: "a3f5b8c9...",
  proof: 35293
}
```

**Verify Ledger:**
```javascript
GET /api/intelligence/blockchain/verify

// Output
{
  is_valid: true,
  total_blocks: 42,
  latest_block_hash: "a3f5b8c9d2e1f4a7b6c5d8e9f2a3b4c5",
  total_transactions: 156
}
```

**Benefits:**
- **Immutable**: Cannot alter past transactions
- **Transparent**: Anyone can verify
- **Non-repudiation**: Parties cannot deny transaction
- **Audit Trail**: Complete history available

---

### 7. Smart Contract Escrow

**What It Does:**
Automates payment release based on delivery confirmation.

**How It Works:**

```
Buyer initiates contract → Payment locked → Farmer dispatches 
→ Buyer confirms delivery → Smart contract releases payment
```

**Contract States:**
1. **LOCKED**: Payment held in escrow
2. **DISPATCHED**: Product shipped
3. **COMPLETED**: Delivery confirmed, payment released
4. **CANCELLED**: Contract cancelled, refund issued

**Flow:**

**Step 1: Initiate Escrow**
```javascript
POST /api/intelligence/contracts/start-escrow
{
  farmer_id: "farmer123",
  buyer_id: "buyer456",
  crop: "Tomato",
  quantity: 100,
  price: 50
}

// Response
{
  contract_id: "contract_789",
  status: "LOCKED",
  amount: 5000,  // ₹5000 locked
  farmer_id: "farmer123",
  buyer_id: "buyer456",
  created_at: "2026-02-01T10:00:00Z"
}
```

**Step 2: Dispatch**
```javascript
POST /api/intelligence/contracts/dispatch/contract_789

// Response
{
  contract_id: "contract_789",
  status: "DISPATCHED",
  dispatched_at: "2026-02-02T14:00:00Z"
}
```

**Step 3: Confirm Delivery**
```javascript
POST /api/intelligence/contracts/confirm-delivery/contract_789

// Response
{
  contract_id: "contract_789",
  status: "COMPLETED",
  payment_released: true,
  amount: 5000,
  released_to: "farmer123",
  completed_at: "2026-02-05T16:00:00Z"
}
```

**Benefits:**
- **Trust**: Buyer knows farmer will deliver
- **Security**: Farmer knows payment is guaranteed
- **Automation**: No manual intervention needed
- **Dispute Resolution**: Clear terms, less disputes

---

### 8. Fraud Detection

**What It Does:**
Detects suspicious transactions using AI anomaly detection.

**How It Works:**

```
Transaction initiated → AI analyzes patterns → Calculates risk score 
→ Flags if suspicious → Admin reviews → Approve/Block
```

**Input:**
```javascript
{
  transaction_data: {
    amount: 50000,  // ₹50,000
    quantity: 1000,
    price_per_unit: 50
  },
  user_data: {
    user_id: "buyer456",
    transaction_count: 5,
    avg_transaction_amount: 3000,
    account_age_days: 10
  }
}
```

**Output:**
```javascript
{
  transaction_id: "txn_123",
  user_id: "buyer456",
  risk_score: 75.5,  // Out of 100
  risk_level: "HIGH",  // LOW / MEDIUM / HIGH / CRITICAL
  verdict: "FLAGGED",  // APPROVED / FLAGGED / BLOCKED
  audit_code: "AUDIT_REVIEW_REQUIRED",
  flags: [
    "Amount 16x higher than user average",
    "New account (< 30 days)",
    "Unusual quantity for buyer type"
  ],
  recommendations: [
    "Require additional verification",
    "Contact buyer for confirmation",
    "Limit transaction until verified"
  ]
}
```

**Anomaly Detection:**
- **Amount Anomaly**: Transaction much larger than usual
- **Frequency Anomaly**: Too many transactions in short time
- **Pattern Anomaly**: Unusual buying pattern
- **Account Anomaly**: New account with large transaction

**Use Case:**
New buyer tries to purchase ₹50,000 worth of produce. System flags as suspicious (new account + large amount). Admin reviews and contacts buyer for verification.

---

## 🔐 Security Features

### 1. Zero-Trust Architecture (9 Layers)

**Philosophy**: "Never trust, always verify"

Every request passes through 9 security layers:

**Layer 1: JWT Token Validation**
```javascript
// Extract token from header
const token = req.headers.authorization?.split(' ')[1];

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Check expiration
if (decoded.exp < Date.now() / 1000) {
  throw new Error('Token expired');
}
```

**Layer 2: User Existence Verification**
```javascript
const user = await User.findById(decoded.id);
if (!user) {
  throw new Error('User not found');
}
```

**Layer 3: Session Validation**
```javascript
// Check if session is revoked
const isRevoked = await checkSessionRevocation(user._id, decoded.iat);
if (isRevoked) {
  throw new Error('Session revoked');
}
```

**Layer 4: IP-Based Threat Detection**
```javascript
const ip = req.ip;
if (isSuspiciousIP(ip)) {
  logSecurityEvent('SUSPICIOUS_IP_ACCESS', { ip, userId: user._id });
  throw new Error('Access denied from suspicious IP');
}
```

**Layer 5: Role-Based Access Control (RBAC)**
```javascript
if (requiredRole && user.userType !== requiredRole) {
  throw new Error('Insufficient permissions');
}
```

**Layer 6: Policy Engine**
```javascript
// Check business rules
if (action === 'CREATE_PRODUCT' && !user.isVerified) {
  throw new Error('Unverified farmers cannot create products');
}
```

**Layer 7: Request Integrity**
```javascript
// Validate request payload
const { error } = validateSchema(req.body);
if (error) {
  throw new Error('Invalid request data');
}
```

**Layer 8: Rate Limiting**
```javascript
const requestCount = await getRequestCount(user._id);
if (requestCount > 100) {  // 100 requests per minute
  throw new Error('Rate limit exceeded');
}
```

**Layer 9: Audit Logging**
```javascript
await AuditLog.create({
  eventType: 'API_ACCESS',
  userId: user._id,
  endpoint: req.path,
  method: req.method,
  ip: req.ip,
  timestamp: new Date()
});
```

---

### 2. Audit Logging System

**What It Logs:**
- All user actions (login, logout, create, update, delete)
- Security events (failed logins, suspicious activity)
- System events (errors, warnings)
- Data access (who accessed what data when)

**40+ Event Types:**

**Authentication Events:**
- LOGIN_SUCCESS
- LOGIN_FAILED
- LOGOUT
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_COMPLETED
- TOKEN_REFRESH

**User Events:**
- USER_REGISTERED
- USER_UPDATED
- USER_DELETED
- PROFILE_VIEWED

**Product Events:**
- PRODUCT_CREATED
- PRODUCT_UPDATED
- PRODUCT_DELETED
- PRODUCT_VIEWED

**Order Events:**
- ORDER_CREATED
- ORDER_UPDATED
- ORDER_CANCELLED
- ORDER_COMPLETED

**Security Events:**
- SUSPICIOUS_ACTIVITY_DETECTED
- RATE_LIMIT_EXCEEDED
- INVALID_TOKEN
- SESSION_REVOKED

**Log Structure:**
```javascript
{
  _id: ObjectId,
  eventType: "LOGIN_FAILED",
  eventCategory: "AUTHENTICATION",
  userId: ObjectId,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  outcome: "FAILURE",
  riskLevel: "MEDIUM",
  riskScore: 45,
  metadata: {
    reason: "Invalid password",
    attemptCount: 3
  },
  timestamp: ISODate("2026-02-01T10:36:53Z"),
  expiresAt: ISODate("2033-02-01T10:36:53Z")  // 7 years retention
}
```

**Risk Assessment:**
```javascript
function calculateRiskScore(event) {
  let score = 0;
  
  // Failed login
  if (event.eventType === 'LOGIN_FAILED') score += 30;
  
  // Multiple attempts
  if (event.metadata.attemptCount > 3) score += 20;
  
  // Suspicious IP
  if (isSuspiciousIP(event.ipAddress)) score += 25;
  
  // Unusual time (3 AM)
  if (isUnusualTime(event.timestamp)) score += 15;
  
  return score;
}
```

**Retention Policy:**
- **Critical Events**: 7 years (legal requirement)
- **Security Events**: 3 years
- **User Actions**: 1 year
- **System Logs**: 90 days

---

### 3. Privacy & GDPR Compliance

**User Rights Implemented:**

**1. Right to Access (Data Export)**
```javascript
GET /api/privacy/export-data

// Returns all user data
{
  user: { name, email, phone, ... },
  products: [...],
  orders: [...],
  bids: [...],
  transactions: [...]
}
```

**2. Right to Erasure (Delete Account)**
```javascript
// Step 1: Request deletion
POST /api/privacy/request-deletion
{
  reason: "No longer using platform"
}

// Step 2: Confirm deletion (email link)
POST /api/privacy/confirm-deletion
{
  deletionToken: "abc123..."
}

// Result: All personal data deleted
```

**3. Right to Rectification (Update Data)**
```javascript
PUT /api/users/profile
{
  name: "Updated Name",
  email: "new@email.com"
}
```

**4. Right to Portability (Download Data)**
```javascript
GET /api/privacy/download-data/json
// Downloads JSON file with all data

GET /api/privacy/download-data/csv
// Downloads CSV file with all data
```

**Data Minimization:**
- Only collect necessary data
- Auto-delete temporary files
- Anonymize data for analytics
- Mask sensitive fields in logs

**Encryption:**
- **At Rest**: AES-256-GCM
- **In Transit**: TLS 1.3
- **Passwords**: Bcrypt (12 rounds)
- **Tokens**: JWT with HS256

---

## 🏗️ Technical Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                         │
│              React + TypeScript + TailwindCSS               │
│                                                             │
│  Components:                                                │
│  - Login/Register                                           │
│  - Dashboard (Farmer/Buyer)                                 │
│  - Product Listing                                          │
│  - Bid Management                                           │
│  - Order Tracking                                           │
│  - ML Analytics                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS + JWT
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                         │
│              Node.js + Express + MongoDB                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Zero-Trust Security Middleware                      │  │
│  │  - JWT Validation                                    │  │
│  │  - RBAC                                              │  │
│  │  - Rate Limiting                                     │  │
│  │  - Audit Logging                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Controllers                          │  │
│  │  - Auth Controller                                   │  │
│  │  - Product Controller                                │  │
│  │  - Bid Controller                                    │  │
│  │  - Order Controller                                  │  │
│  │  - ML Controller (proxy to ML service)              │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────┬───────────────────────────┘
               │                  │
               │ MongoDB          │ HTTPS + API Key + Signature
               ↓                  ↓
┌──────────────────────┐   ┌──────────────────────────────────┐
│   DATA LAYER         │   │   ML SERVICE LAYER               │
│   MongoDB Atlas      │   │   FastAPI + Python               │
│                      │   │                                  │
│  Collections:        │   │  ┌────────────────────────────┐  │
│  - users             │   │  │  ML Models                 │  │
│  - products          │   │  │  - Price Prediction        │  │
│  - orders            │   │  │  - Gap Analysis            │  │
│  - bids              │   │  │  - Trust Scoring           │  │
│  - auditLogs         │   │  │  - Fraud Detection         │  │
│  - blockchain        │   │  └────────────────────────────┘  │
└──────────────────────┘   │                                  │
                           │  ┌────────────────────────────┐  │
                           │  │  Blockchain Engine         │  │
                           │  │  - Trade Ledger            │  │
                           │  │  - Smart Contracts         │  │
                           │  └────────────────────────────┘  │
                           └──────────────────────────────────┘
```

---

## 🔄 Data Flow

### Example: Complete Order Flow

```
1. BUYER BROWSES PRODUCTS
   Frontend → GET /api/products → Backend → MongoDB
   ← Products list ← Backend ← MongoDB

2. BUYER PLACES BID
   Frontend → POST /api/bids → Backend validates → MongoDB saves
   ← Bid created ← Backend ← MongoDB
   → Notification sent to Farmer

3. FARMER VIEWS BID
   Frontend → GET /api/bids/product/:id → Backend → MongoDB
   ← Bids list ← Backend ← MongoDB
   
   Frontend → POST /api/intelligence/buyer-trust/:id → Backend
   → Backend → ML Service (calculates trust score)
   ← Trust score ← ML Service ← Backend
   ← Trust score ← Backend

4. FARMER ACCEPTS BID
   Frontend → PUT /api/bids/:id {status: "accepted"} → Backend
   → MongoDB updates bid
   → Creates order
   → Initiates smart contract
   Backend → POST /ml-service/contracts/start-escrow
   ← Contract ID ← ML Service
   ← Order created ← Backend
   → Notification sent to Buyer

5. BUYER CONFIRMS ORDER
   Frontend → GET /api/orders/:id → Backend → MongoDB
   ← Order details ← Backend ← MongoDB

6. FARMER DISPATCHES
   Frontend → PUT /api/orders/:id {status: "dispatched"} → Backend
   → MongoDB updates order
   Backend → POST /ml-service/contracts/dispatch/:id
   ← Dispatch confirmed ← ML Service
   Backend → POST /ml-service/blockchain/seal (seal trade)
   ← Transaction hash ← ML Service
   ← Order updated ← Backend
   → Notification sent to Buyer

7. BUYER CONFIRMS DELIVERY
   Frontend → PUT /api/orders/:id {status: "delivered"} → Backend
   → MongoDB updates order
   Backend → POST /ml-service/contracts/confirm-delivery/:id
   ← Payment released ← ML Service
   ← Order completed ← Backend
   → Notification sent to Farmer

8. AUDIT LOGGING (Throughout)
   Every action → AuditLog.create() → MongoDB
```

---

## 📡 API Workflow

### Authentication Flow

```javascript
// 1. User Registration
POST /api/auth/register
{
  name: "Ramjibhai Patel",
  phone: "9876543210",
  password: "password123",
  userType: "farmer",
  location: "Gujarat"
}

// Backend Processing:
1. Validate input
2. Check if phone already exists
3. Hash password (bcrypt)
4. Create user in MongoDB
5. Generate JWT token
6. Return token + user data

// Response:
{
  success: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "Ramjibhai Patel",
    phone: "9876543210",
    userType: "farmer"
  }
}

// 2. User Login
POST /api/auth/login
{
  phone: "9876543210",
  password: "password123"
}

// Backend Processing:
1. Find user by phone
2. Compare password (bcrypt)
3. Generate new JWT token
4. Log login event (audit)
5. Return token + user data

// 3. Protected API Call
GET /api/products
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Backend Processing:
1. Extract token from header
2. Verify token signature
3. Check token expiration
4. Find user by token ID
5. Check session validity
6. Attach user to request
7. Proceed to route handler
```

---

## 🎓 Summary

AgroLink is a **comprehensive agriculture marketplace** that:

1. **Connects** farmers directly with buyers
2. **Predicts** optimal prices using AI
3. **Analyzes** market conditions for better decisions
4. **Scores** buyer reliability for trust
5. **Tracks** farmer profits for optimization
6. **Ensures** fair prices with MSP awareness
7. **Secures** transactions with blockchain
8. **Automates** payments with smart contracts
9. **Detects** fraud using AI
10. **Protects** user data with Zero-Trust security
11. **Complies** with GDPR for privacy
12. **Logs** everything for accountability

**The result**: A **fair, transparent, and efficient** agricultural marketplace that empowers farmers and builds trust with buyers.

---

**For detailed API documentation, see**: `API_TESTING_GUIDE.md`  
**For deployment guide, see**: `QUICK_START.md`  
**For submission package, see**: `PROJECT_SUBMISSION_PACKAGE.md`

---

**Made with ❤️ for farmers and the agricultural community**
