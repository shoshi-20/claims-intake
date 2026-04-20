import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import {authenticate} from './middleware/auth.middleware.js';

const app = express();

app.use(cors(
  // {origin: 'http://localhost:5173'}
));
app.use(express.json());
app.use('/auth', authRoutes);
app.get('/health', (_, res) => res.json({status: 'ok'}));
// app.use(authenticate);

export default app;
