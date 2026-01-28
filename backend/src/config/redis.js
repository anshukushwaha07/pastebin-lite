import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Crash immediately if the database URL is missing in production
if (!process.env.KV_URL && process.env.NODE_ENV === 'production') {
    throw new Error('KV_URL is not defined');
}

// Connect to the Render Redis instance, or fallback to localhost for development
const redis = new Redis(process.env.KV_URL || 'redis://localhost:6379');

export default redis;