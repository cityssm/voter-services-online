import formatCivicAddress from '@cityssm/civic-address-format'
import { isCanada } from '@cityssm/statscan-tools'
import type { VotersListFoundRecord } from '@cityssm/voterview-api/types'
import Debug from 'debug'
import type { Request, Response } from 'express'

import { DEBUG_NAMESPACE } from '../../debug.config.js'
import { countries, provinces } from '../../helpers/address.helpers.js'
import { voterViewApi } from '../../helpers/api.helpers.js'
import { getConfigProperty } from '../../helpers/config.helpers.js'

interface VotersListResultRequest {
  firstName: string
  lastName: string

  dateOfBirthDay: string
  dateOfBirthMonth: string
  dateOfBirthYear: string

  streetName: string
  streetNumber: string
  unitNumber: string
}

const debug = Debug(`${DEBUG_NAMESPACE}:handlers:votersList:votersListResult`)

export default async function handler(
  request: Request<Request, unknown, VotersListResultRequest>,
  response: Response
): Promise<void> {
  const voterRecord = (await voterViewApi.getVotersListRecord({
    FirstName: request.body.firstName.trim(),
    LastName: request.body.lastName.trim(),

    BirthDay: request.body.dateOfBirthDay.trim(),
    BirthMonth: request.body.dateOfBirthMonth.trim(),
    BirthYear: request.body.dateOfBirthYear.trim(),

    StreetName: request.body.streetName.trim(),
    StreetType: '',

    StreetNumber: request.body.streetNumber.trim(),
    UnitNumber: request.body.unitNumber.trim()
  })) as Record<keyof VotersListFoundRecord, unknown> & {
    StreetName: string
    StreetNumber: string
    Unit: string
  }

  voterRecord.FirstName ??= request.body.firstName.trim()
  voterRecord.LastName ??= request.body.lastName.trim()
  voterRecord.FullName ??= `${voterRecord.FirstName as string} ${voterRecord.LastName as string}`

  voterRecord.DateOfBirth ??=
    `${request.body.dateOfBirthYear.trim()}-${request.body.dateOfBirthMonth.trim()}-${request.body.dateOfBirthDay.trim().padStart(2, '0')}` as `${number}-${number}-${number}`

  voterRecord.PropertyAddress ??= formatCivicAddress({
    civicNumber: request.body.streetNumber.trim(),
    streetName: request.body.streetName.trim(),
    unitNumber: request.body.unitNumber.trim()
  })

  voterRecord.StreetName = request.body.streetName.trim()
  voterRecord.StreetNumber = request.body.streetNumber.trim()
  voterRecord.Unit = request.body.unitNumber.trim()

  voterRecord.City ??= getConfigProperty('settings.city')
  voterRecord.Province ??= getConfigProperty('settings.province')
  voterRecord.Country ??= 'Canada'

  debug('Voter Record: %O', voterRecord)

  const voterRecordIsCanada = isCanada(voterRecord.Country as string)

  response.render('votersListUpdate', {
    voterRecord,

    countries,
    provinces,
    voterRecordIsCanada,

    isCanada
  })
}
