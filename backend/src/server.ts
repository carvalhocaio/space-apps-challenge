import './config/env';
import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import gameRoutes from './controllers/game.controller';
import nasaRoutes from './controllers/nasa.controller';

const app = express();

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/nasa', nasaRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port: ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
