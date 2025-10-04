import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  // openaiApiKey: process.env.OPENAI_API_KEY,
  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  cacheTTL: parseInt(process.env.CACHE_TTL || '300', 10),
};

console.log(config)
