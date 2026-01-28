import express from 'express';
import * as controller from '../controllers/pasteController.js';

const router = express.Router();

router.get('/healthz', controller.healthCheck);
router.post('/pastes', controller.create);
router.get('/pastes/:id', controller.getOne);

export default router;