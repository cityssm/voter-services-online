import { Router } from 'express'

import handler_doGetAddressDetails from '../handlers/main/doGetAddressDetails.js'
import handler_doGetAddresses from '../handlers/main/doGetAddresses.js'
import handler_main from '../handlers/main/main.js'

export const router = Router()

router
  .get('/', handler_main)
  .get('/doGetAddresses', handler_doGetAddresses)
  .get('/doGetAddressDetails', handler_doGetAddressDetails)

export default router
