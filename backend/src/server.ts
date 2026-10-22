import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// API Router
app.use('/api', apiRoutes);

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TrueMarriage Matrimony Express API running smoothly' });
});

app.listen(PORT, () => {
  console.log(`🚀 TrueMarriage Express Backend Server running on http://localhost:${PORT}`);
});
