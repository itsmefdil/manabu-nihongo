import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;
