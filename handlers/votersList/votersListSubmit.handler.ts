import type {
  VotersListBaseRegistrationRequest,
  VotersListRegistrationRequest,
  VotersListUpdateRequest
} from '@cityssm/voterview-api'
import Debug from 'debug'
import type { Request, Response } from 'express'

import { DEBUG_NAMESPACE } from '../../debug.config.js'
import { voterViewApi } from '../../helpers/api.helpers.js'

interface VotersListSubmitRequest {
  voterID: string
  propertyID: string

  firstName: string
  middleName: string
  lastName: string

  dateOfBirthDay: string
  dateOfBirthMonth: string
  dateOfBirthYear: string

  residencyStatus: string
  occupancyStatus: string
  religion: string
  schoolSupport: string
  frenchLanguageRights: string

  preferredContactMethod: 'Email' | 'Phone'
  email: string
  phoneNumber: string

  streetNumber: string
  streetNumberSuffix: string
  streetName: string
  unitNumber: string

  mailingAddress1: string
  mailingAddress2: string
  mailingAddress3: string
  mailingCity: string
  mailingCountry: string
  mailingProvinceCanada?: string
  mailingProvinceOther?: string
  mailingPostalCode: string

  absenteeVoteType?: '1'

  declareCanadian?: 'Y'
}

const debug = Debug(`${DEBUG_NAMESPACE}:handlers:votersList:votersListSubmit`)

export default async function handler(
  request: Request<unknown, unknown, VotersListSubmitRequest>,
  response: Response
): Promise<void> {
  const uploadFile = request.file

  if (!uploadFile) {
    debug('No file uploaded')
    response.render('votersListSubmitError', {
      errorMessage:
        'No identification document uploaded. Please select a file to upload.'
    })

    return
  }

  const uploadIDContent = uploadFile.buffer
  const uploadIDFileName = uploadFile.originalname

  debug(
    `Uploaded file: ${uploadIDFileName}, size: ${uploadIDContent.length} bytes`
  )

  debug('Request body:', request.body)

  const baseRegistration: VotersListBaseRegistrationRequest = {
    FirstName: request.body.firstName.trim(),
    MiddleName: request.body.middleName.trim(),
    LastName: request.body.lastName.trim(),

    BirthDay: request.body.dateOfBirthDay.trim(),
    BirthMonth: request.body.dateOfBirthMonth.trim(),
    BirthYear: request.body.dateOfBirthYear.trim(),

    Email: request.body.email.trim(),
    Telephone: request.body.phoneNumber.trim(),

    SchoolSupport: request.body.schoolSupport.trim(),
    Citizenship: request.body.declareCanadian === 'Y' ? 'Y' : 'N',
    OccupancyStatus: request.body.occupancyStatus.trim(),
    ResidencyStatus: request.body.residencyStatus.trim(),
    Religion: request.body.religion.trim(),
    FrenchLanguageRights: request.body.frenchLanguageRights.trim(),

    MailingAddress1: request.body.mailingAddress1.trim(),
    MailingAddress2: request.body.mailingAddress2.trim(),
    MailingAddress3: request.body.mailingAddress3.trim(),
    MailingCity: request.body.mailingCity.trim(),

    MailingProvince:
      request.body.mailingCountry === 'Canada'
        ? (request.body.mailingProvinceCanada ?? '').trim()
        : (request.body.mailingProvinceOther ?? '').trim(),

    MailingPostalCode: request.body.mailingPostalCode.trim(),
    MailingCountry: request.body.mailingCountry.trim(),

    StreetNumber: request.body.streetNumber.trim(),
    StreetNumberSuffix: request.body.streetNumberSuffix.trim(),
    StreetName: request.body.streetName.trim(),
    UnitNumber: request.body.unitNumber.trim(),

    DriversLicenceNumber: '',
    UploadID1Content: uploadIDContent.toString('base64'),
    UploadID1FileName: uploadIDFileName,

    IPAddress: request.ip,
    PreferredContactMethod: request.body.preferredContactMethod
  }

  const isUpdateRequest =
    request.body.voterID !== '' && request.body.propertyID !== ''

  debug(
    `Submitting ${isUpdateRequest ? 'update' : 'registration'} request:`,
    baseRegistration
  )

  let voterRegistration:
    VotersListRegistrationRequest | VotersListUpdateRequest = isUpdateRequest
    ? ({
        ...baseRegistration,
        VoterID: request.body.voterID,
        PropertyID: request.body.propertyID
      } satisfies VotersListUpdateRequest)
    : ({
        ...baseRegistration
      } satisfies VotersListRegistrationRequest)

  if (isUpdateRequest && request.body.absenteeVoteType === '1') {
    voterRegistration = {
      ...(voterRegistration as VotersListUpdateRequest),

      AbsenteeVoteType: '1',
      AbsenteeAddress1: voterRegistration.MailingAddress1,
      AbsenteeAddress2: voterRegistration.MailingAddress2,
      AbsenteeAddress3: voterRegistration.MailingAddress3,
      AbsenteeCity: voterRegistration.MailingCity,
      AbsenteeProvince: voterRegistration.MailingProvince,
      AbsenteePostalCode: voterRegistration.MailingPostalCode,
      AbsenteeCountry: voterRegistration.MailingCountry
    } satisfies VotersListUpdateRequest
  }

  const registrationResponse =
    await voterViewApi.submitVotersListUpdate(voterRegistration)

  debug('Registration response: ', registrationResponse)

  if (
    typeof registrationResponse === 'string' &&
    registrationResponse !== 'An error has occurred.'
  ) {
    response.render('votersListSubmitSuccess', {
      confirmationCode: registrationResponse
    })
  } else {
    response.render('votersListSubmitError', {
      errorMessage:
        typeof registrationResponse === 'object'
          ? registrationResponse.ErrorDescription
          : 'An error has occurred.'
    })
  }
}
