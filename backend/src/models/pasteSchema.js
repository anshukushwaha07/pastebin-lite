import Joi from 'joi';

const pasteSchema = Joi.object({
    // Content is mandatory and cannot be an empty string
    content: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.empty': 'Content cannot be empty',
            'any.required': 'Content is required'
        }),

    // Optional TTL: If provided, it must be a positive integer (seconds)
    ttl_seconds: Joi.number()
        .integer()
        .min(1)
        .optional()
        .allow(null),

    // Optional View Limit: If provided, it must be a positive integer
    max_views: Joi.number()
        .integer()
        .min(1)
        .optional()
        .allow(null)
});

export default pasteSchema;