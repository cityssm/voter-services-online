import { Router } from 'express'
import multer from 'multer'

import handler_doGetAllStreetNames from '../handlers/votersList/doGetAllStreetNames.handler.js'
import handler_doGetVoterDetailLists from '../handlers/votersList/doGetVoterDetailLists.handler.js'
import handler_votersListCheck from '../handlers/votersList/votersListCheck.handler.js'
import handler_votersListResult from '../handlers/votersList/votersListResult.handler.js'
import handler_votersListStatus from '../handlers/votersList/votersListStatus.handler.js'
import handler_votersListSubmit from '../handlers/votersList/votersListSubmit.handler.js'

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const fileSizeLimit = 10 * 1024 * 1024 // 10 MB

const upload = multer({
  limits: {
    files: 1,

    // eslint-disable-next-line sonarjs/content-length
    fileSize: fileSizeLimit
  },
  storage: multer.memoryStorage()
})

export default function votersListRouter(): Router {
  const router = Router()

  router
    .get('/', handler_votersListCheck)
    .get('/doGetAllStreetNames', handler_doGetAllStreetNames)

  router.post('/status', handler_votersListStatus)

  router
    .post('/result', handler_votersListResult)
    .get('/doGetVoterDetailLists', handler_doGetVoterDetailLists)

  router.post('/submit', upload.single('uploadID'), handler_votersListSubmit)

  return router
}
