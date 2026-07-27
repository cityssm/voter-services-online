import { Router } from 'express';
import handler_votersList from '../handlers/votersList/votersList.js';
import handler_votersListResult from '../handlers/votersList/votersListResult.js';
export const router = Router();
router.get('/', handler_votersList).post('/result', handler_votersListResult);
export default router;
