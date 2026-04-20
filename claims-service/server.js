import express from 'express';
import cors from 'cors';
import claimsRoutes from './routes/claims.route.js';
import {authenticate} from './middleware/auth.middleware.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async () => {
  try {
    const {MONGO_URI} = process.env;
    if (!MONGO_URI) {
      console.error('MONGO_URI is not defined in environment variables');
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

dotenv.config();
const app = express();
connectDB();

app.use(cors(
  // { origin: 'http://localhost:5173' }
)); //add specific url
app.use(express.json());
app.get('/health', (_, res) => res.json({status: 'ok'}));
// app.use(authenticate);
app.use('/claims', claimsRoutes);

export default app;
