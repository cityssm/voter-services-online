import { Router } from 'express';
import handler_votersList from '../handlers/votersList/votersList.js';
export const router = Router();
router
    .get('/', handler_votersList);
export default router;
