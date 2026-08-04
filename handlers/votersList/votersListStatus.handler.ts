import { enhanceVoterApplicationStatus } from '@cityssm/voterview-api'
import Debug from 'debug'
import type { Request, Response } from 'express'

import { DEBUG_NAMESPACE } from '../../debug.config.js'
import { voterViewApi } from '../../helpers/api.helpers.js'

interface VotersListStatusRequest {
  confirmationCode: string
  lastName: string
}

const debug = Debug(`${DEBUG_NAMESPACE}:handlers:votersList:votersListStatus`)

export default async function handler(
  request: Request<unknown, unknown, VotersListStatusRequest>,
  response: Response
): Promise<void> {
  const lastName = request.body.lastName.trim()
  const confirmationCode = request.body.confirmationCode.trim()

  const rawVoterStatus = await voterViewApi.getVoterApplicationStatus(
    confirmationCode,
    lastName
  )

  const voterStatus = enhanceVoterApplicationStatus(rawVoterStatus)

  debug('Status response: ', rawVoterStatus)

  response.render('votersListStatus', {
    voterStatus,

    confirmationCode,
    lastName
  })
}
