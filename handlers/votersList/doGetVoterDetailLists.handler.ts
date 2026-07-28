import type {
  FrenchRightsCode,
  Gender,
  OccupancyStatus,
  ReligionCode,
  ResidencyStatus,
  SchoolSupportCode
} from '@cityssm/voterview-api'
import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Better compatibility with client-side code
export type DoGetVoterDetailListsResponse = {
  frenchRightsCodes: FrenchRightsCode[]
  genders: Gender[]
  occupancyStatuses: OccupancyStatus[]
  religionCodes: ReligionCode[]
  residencyStatuses: ResidencyStatus[]
  schoolSupportCodes: SchoolSupportCode[]
}

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const frenchRightsCodes = await voterViewApi.getFrenchLanguageRightsCodes()
  const genders = await voterViewApi.getGenders()
  const occupancyStatuses = await voterViewApi.getOccupancyStatuses()
  const religionCodes = await voterViewApi.getRomanCatholicReligionCodes()
  const residencyStatuses = await voterViewApi.getResidencyStatuses()
  const schoolSupportCodes = await voterViewApi.getSchoolSupportCodes()

  response.json({
    frenchRightsCodes,
    genders,
    occupancyStatuses,
    religionCodes,
    residencyStatuses,
    schoolSupportCodes
  } satisfies DoGetVoterDetailListsResponse)
}
