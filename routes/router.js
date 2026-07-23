import { Router } from 'express';
import handler_doGetAddressDetails from '../handlers/doGetAddressDetails.js';
import handler_doGetAddresses from '../handlers/doGetAddresses.js';
import handler_main from '../handlers/main.js';
export const router = Router();
router
    .get('/', handler_main)
    .get('/doGetAddresses', handler_doGetAddresses)
    .get('/doGetAddressDetails', handler_doGetAddressDetails);
export default router;
