import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import productRoutes from './src/routes/product.routes.js';
import bidRoutes from './src/routes/bid.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import youtubeRoutes from './src/routes/youtube.js';
import agricultureVideoRoutes from './src/routes/videoRoutes.js';
import agricultureNewsRoutes from './src/routes/newsRoutes.js';
import agricultureSchemeRoutes from './src/routes/schemeRoutes.js';
import marketPriceRoutes from './src/routes/marketPrice.routes.js';
import agricultureDashboardRoutes from './src/routes/agricultureDashboardRoutes.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Cookie parsing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
app.use('/api/', rateLimiter);

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'AgroLink API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/agriculture-videos", agricultureVideoRoutes);
app.use("/api/agriculture-news", agricultureNewsRoutes);
app.use("/api/agriculture-schemes", agricultureSchemeRoutes);
app.use("/api/agriculture", agricultureDashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
