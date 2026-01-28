import pasteService from '../services/pasteService.js';
import pasteSchema from '../models/pasteSchema.js';
import { getCurrentTime } from '../utils/time.js';

export const healthCheck = async (req, res) => {
    // Simple health check to verify the API is running and accessible
    res.json({ ok: true });
}

export const create = async (req, res, next) => {
    try {
        // Validate the request body against our schema, collecting all errors at once
        const { error, value } = pasteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Return a detailed list of validation issues so the client can fix them
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details.map(detail => detail.message)
            });
        }

        // Pass the sanitized values (not the raw body) to the service layer
        const id = await pasteService.createPaste(value);

        // Detect the correct protocol (https) when running behind a proxy like Render
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        res.status(201).json({
            id,
            url: `${protocol}://${host}/p/${id}`
        });
    } catch (err) {
        next(err);
    }
}

export const getOne = async (req, res, next) => {
    try {
        // Get current time, respecting the test-mode header for deterministic testing
        const currentTime = getCurrentTime(req);

        // Fetch the paste if it exists and passes all expiration/view logic
        const paste = await pasteService.getPaste(req.params.id, currentTime);

        if (!paste) {
            return res.status(404).json({ error: 'Paste not found or unavailable' });
        }

        res.json({
            content: paste.content,
            remaining_views: paste.remaining_views,
            expires_at: paste.expires_at_ms
                ? new Date(paste.expires_at_ms).toISOString()
                : null
        });
    } catch (err) {
        next(err);
    }
}