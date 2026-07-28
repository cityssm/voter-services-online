import { Router } from 'express'

import handler_doGetAllStreetNames from '../handlers/votersList/doGetAllStreetNames.handler.js'
import handler_doGetVoterDetailLists from '../handlers/votersList/doGetVoterDetailLists.handler.js'
import handler_votersListCheck from '../handlers/votersList/votersListCheck.handler.js'
import handler_votersListResult from '../handlers/votersList/votersListResult.handler.js'

export const router = Router()

router
  .get('/', handler_votersListCheck)
  .get('/doGetAllStreetNames', handler_doGetAllStreetNames)

router
  .post('/result', handler_votersListResult)
  .get('/doGetVoterDetailLists', handler_doGetVoterDetailLists)

export default router
