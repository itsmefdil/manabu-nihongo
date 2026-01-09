import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
// Parse CORS origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = corsOrigin.includes(',')
    ? corsOrigin.split(',').map(o => o.trim())
    : corsOrigin;

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;
