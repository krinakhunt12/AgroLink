# AgroLink Backend API

Backend API for AgroLink - An agricultural marketplace platform connecting farmers directly with buyers.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Farmer/Buyer)
- **Product Management**: CRUD operations for agricultural products
- **Bidding System**: Buyers can bid on negotiable products
- **Order Management**: Complete order lifecycle tracking
- **File Uploads**: Image upload support for products and user avatars
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── user.controller.js   # User management
│   │   ├── product.controller.js # Product CRUD
│   │   ├── bid.controller.js    # Bidding system
│   │   └── order.controller.js  # Order management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── upload.js            # File upload (Multer)
│   ├── models/
│   │   ├── User.model.js        # User schema
│   │   ├── Product.model.js     # Product schema
│   │   ├── Bid.model.js         # Bid schema
│   │   └── Order.model.js       # Order schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── user.routes.js       # User endpoints
│   │   ├── product.routes.js    # Product endpoints
│   │   ├── bid.routes.js        # Bid endpoints
│   │   ├── order.routes.js      # Order endpoints
│   │   └── category.routes.js   # Category endpoints
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding
│   ├── utils/
│   │   └── auth.js              # Auth utilities
│   └── server.js                # Entry point
├── uploads/                     # Uploaded files
├── .env.example                 # Environment variables template
├── .gitignore
└── package.json
```

## 🛠️ Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS
- `GEMINI_API_KEY`: Google Gemini API key (optional)

4. **Create uploads directory**
```bash
mkdir uploads
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)
- `GET /api/products/farmer/:farmerId` - Get farmer's products

### Bids
- `POST /api/bids` - Create bid (Buyer only)
- `GET /api/bids/my-bids` - Get buyer's bids (Buyer only)
- `GET /api/bids/product/:productId` - Get product bids (Farmer only)
- `PUT /api/bids/:id` - Update bid status (Farmer only)

### Orders
- `POST /api/orders` - Create order (Buyer only)
- `GET /api/orders` - Get orders (role-based)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (Farmer only)

### Categories
- `GET /api/categories` - Get all categories

## 🔒 Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Sample Credentials (After Seeding)

**Farmer:**
- Phone: `9876543210`
- Password: `password123`

**Buyer:**
- Phone: `9876543220`
- Password: `password123`

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **JWT**: Secure authentication
- **bcrypt**: Password hashing
- **Input Validation**: Express-validator

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agrolink
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License
