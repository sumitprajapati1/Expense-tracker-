import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import expenseRoutes from './routes/expenses.js';
import authRoutes from './routes/auth.js';
import connectDB from './config/database.js';
import errorHandler from './middlewares/error.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(process.env.PORT || 5173, () => {
  console.log(`Server running on port ${process.env.PORT || 5173}`);
});

export default app;