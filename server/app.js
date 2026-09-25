import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
const app = express();


// Connect to MongoDB
connectDB();
// Enable Cross-Origin Resource Sharing (CORS) so React client can communicate with API
app.use( 
  cors()
);

// Body parser middleware to handle JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Chhattisgarh Tourist Guide API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.send('API is running for Chhattisgarh Tourist Guide Platform.');
});

// Middleware for handling undefined routes (404)
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
