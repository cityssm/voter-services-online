import { Router } from 'express';
import handler_doGetAddressDetails from '../handlers/main/doGetAddressDetails.handler.js';
import handler_doGetAddresses from '../handlers/main/doGetAddresses.handler.js';
import handler_main from '../handlers/main/main.handler.js';
export const router = Router();
router
    .get('/', handler_main)
    .get('/doGetAddresses', handler_doGetAddresses)
    .get('/doGetAddressDetails', handler_doGetAddressDetails);
export default router;
