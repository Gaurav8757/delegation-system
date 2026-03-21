import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {serve, setup} from "swagger-ui-express";
import { swaggerSpec } from "../../swagger_docs/swagger_api.js";
import { connectDB } from '../config/dbConfig.js';
import { globalErrorHandler } from '../middlewares/globalErrorHandler.js';
import { corsPolicy } from '../middlewares/cors.middleware.js';
import { authLimiter, globalLimiter } from '../middlewares/rate_limiter.js';

import { v4 as uuidv4 } from 'uuid';
import indexRouter from '../routes/index.route.js';

// Initialize express app
const app = express();

// Security Headers handled 12+ security headers
app.use(helmet());

// CORS
app.use(corsPolicy);

// Request Tracing
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
});

// HTTP Logger
app.use(morgan('dev'));

// connect to Database
connectDB();

// rate limiter
app.use(globalLimiter);

// auth rate limiter
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body Parsers
app.use(express.json({ limit: '10kb' })); // reject large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Swagger route
app.use("/api-docs", serve, setup(swaggerSpec));

// Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Delegation System API is running 🚀',
        version: '1.0.0',
        requestId: req.requestId,
    });
});

// API Routes
app.use('/api', indexRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler (always last)
app.use(globalErrorHandler);

export default app;