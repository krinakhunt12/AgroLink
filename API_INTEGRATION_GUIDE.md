# AgroLink API Integration Guide

## ✅ Authentication APIs are Ready!

The login and signup (register) APIs have been fully implemented and integrated into your frontend.

## 🔗 API Endpoints

### Authentication
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Get Current User**: `GET /api/auth/me` (Protected)

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd "D:/Agro Link/backend"

# Install dependencies (first time only)
npm install

# Create .env file
copy .env.example .env

# Edit .env and configure:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (any random secret key)

# Seed database with sample data
npm run seed

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Configure Frontend Environment

Create a `.env` file in your frontend directory:

```bash
cd "D:/Agro Link/AgroLink"
copy .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Test the Integration

1. **Register a new user**:
   - Go to `/register`
   - Fill in the form
   - Choose user type (Farmer/Buyer)
   - Submit

2. **Login**:
   - Go to `/login`
   - Use the credentials you just created
   - Or use sample credentials from seeded data:
     - Farmer: `9876543210` / `password123`
     - Buyer: `9876543220` / `password123`

## 📝 How It Works

### Frontend Integration

The frontend now uses the `authAPI` service from `src/services/api.ts`:

```typescript
import { authAPI } from '../services/api';

// Register
await authAPI.register({
  name: 'રામજીભાઈ પટેલ',
  phone: '9876543210',
  password: 'password123',
  userType: 'farmer',
  location: 'તાલાલા, ગીર'
});

// Login
await authAPI.login({
  phone: '9876543210',
  password: 'password123'
});

// Get current user
const user = await authAPI.getMe();

// Logout
authAPI.logout();
```

### Authentication Flow

1. **Register/Login**: User credentials are sent to backend
2. **Token Storage**: JWT token is saved to localStorage
3. **Auto-Include**: Token is automatically included in all API requests
4. **Protected Routes**: Backend validates token for protected endpoints

### Available API Services

The `src/services/api.ts` file provides:

- ✅ `authAPI` - Authentication (register, login, logout)
- ✅ `productsAPI` - Product management
- ✅ `bidsAPI` - Bidding system
- ✅ `ordersAPI` - Order management
- ✅ `usersAPI` - User profiles
- ✅ `categoriesAPI` - Categories

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation
- **CORS**: Configured for your frontend URL

## 🧪 Testing

### Sample Data (After Seeding)

**Farmers:**
- રામજીભાઈ પટેલ: `9876543210` / `password123`
- કાનજીભાઈ આહિર: `9876543211` / `password123`
- સુરેશભાઈ ઠાકોર: `9876543212` / `password123`

**Buyers:**
- મુકેશભાઈ શાહ: `9876543220` / `password123`
- રાજેશભાઈ પટેલ: `9876543221` / `password123`

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9999999999",
    "password": "test123",
    "userType": "farmer",
    "location": "Test Location"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9999999999",
    "password": "test123"
  }'
```

## 🎯 Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is integrated
3. ⏳ Start both servers
4. ⏳ Test registration and login
5. ⏳ Implement protected routes in frontend
6. ⏳ Add product management features
7. ⏳ Implement bidding system
8. ⏳ Add order management

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default is `http://localhost:5173`

### MongoDB Connection Failed
- Ensure MongoDB is running locally
- Or use MongoDB Atlas connection string
- Check `MONGODB_URI` in `.env`

### Token Not Working
- Check browser console for token in localStorage
- Verify token format: `Bearer <token>`
- Check JWT_SECRET matches between requests

### 404 Errors
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify API endpoint paths

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify environment variables
4. Ensure MongoDB is connected
5. Check network tab in browser DevTools
