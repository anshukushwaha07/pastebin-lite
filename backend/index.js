import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/api.js';

dotenv.config();

const app = express();

//  Robust CORS Config for Production
// This allows your Vercel frontend to send requests and custom headers (like for time travel)
app.use(cors({
    origin: '*', // In strict production, replace '*' with your Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-test-now-ms']
}));

app.use(express.json());

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

export default app;