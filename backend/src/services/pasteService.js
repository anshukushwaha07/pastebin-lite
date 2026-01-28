import { nanoid } from 'nanoid';
import redis from '../config/redis.js';

class PasteService {
    async createPaste({ content, ttl_seconds, max_views }) {
        // Generate a short, URL-friendly unique ID
        const id = nanoid(8);
        const now = Date.now();

        const pasteData = {
            content,
            created_at: now,
            // Calculate absolute timestamp for precise logic checks (supports time travel)
            expires_at_ms: ttl_seconds ? now + (ttl_seconds * 1000) : null,
            max_views: max_views ? parseInt(max_views) : null
        };

        // Use a pipeline to send multiple commands in one network round-trip
        const pipeline = redis.pipeline();

        // Add a 1-hour buffer to the Redis TTL so we can return specific error messages before data vanishes
        const redisOptions = ttl_seconds ? ['EX', ttl_seconds + 3600] : [];

        pipeline.set(`paste:${id}:data`, JSON.stringify(pasteData), ...redisOptions);

        if (max_views) {
            // Initialize atomic view counter
            pipeline.set(`paste:${id}:views`, 0, ...redisOptions);
        }

        await pipeline.exec();
        return id;
    }

    async getPaste(id, currentTime) {
        const dataKey = `paste:${id}:data`;
        const viewKey = `paste:${id}:views`;

        const rawData = await redis.get(dataKey);
        if (!rawData) return null;

        const paste = JSON.parse(rawData);

        // Check against the provided current time (allows testing with future timestamps)
        if (paste.expires_at_ms && currentTime > paste.expires_at_ms) {
            return null;
        }

        let remaining_views = null;
        if (paste.max_views !== null) {
            // Atomically increment view count to prevent race conditions during concurrent requests
            const currentViews = await redis.incr(viewKey);

            if (currentViews > paste.max_views) return null;
            remaining_views = paste.max_views - currentViews;
        }

        return { ...paste, remaining_views };
    }
}

export default new PasteService();