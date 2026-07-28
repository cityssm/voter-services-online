import type {
  CandidateList,
  VotingLocation
} from '@cityssm/voterview-api/types'
import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'

interface DoGetAddressDetailsRequest {
  ward?: string

  streetName?: string
  streetNumber?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Better compatibility with client-side code
export type DoGetAddressDetailsResponse = {
  votingLocations: Array<
    Pick<
      VotingLocation,
      | 'Address1'
      | 'Address2'
      | 'DateOpenStringLocal'
      | 'EndTime'
      | 'IsAdvancePoll'
      | 'IsVotingDayPoll'
      | 'LocationName'
      | 'MapLink'
      | 'StartTime'
    >
  >

  positions: Array<{
    NumberPositions: number
    PositionName: string

    Candidates: Array<
      Pick<
        CandidateList['Positions'][number]['Candidates'][number],
        'CandidateName' | 'IsAcclaimed'
      >
    >
  }>
}

export default async function handler(
  request: Request<unknown, unknown, unknown, DoGetAddressDetailsRequest>,
  response: Response
): Promise<void> {
  const ward = request.query.ward ?? ''
  const streetName = request.query.streetName ?? ''
  const streetNumber = request.query.streetNumber ?? ''

  /*
   * Get Voting Locations
   */

  const rawVotingLocations =
    await voterViewApi.getVotingLocationsByStreetAddress(
      streetNumber,
      streetName
    )

  const votingLocations = rawVotingLocations.map((votingLocation) => ({
    Address1: votingLocation.Address1,
    Address2: votingLocation.Address2,
    DateOpenStringLocal: votingLocation.DateOpenStringLocal,
    EndTime: votingLocation.EndTime,
    IsAdvancePoll: votingLocation.IsAdvancePoll,
    IsVotingDayPoll: votingLocation.IsVotingDayPoll,
    LocationName: votingLocation.LocationName,
    MapLink: votingLocation.MapLink,
    StartTime: votingLocation.StartTime
  })) satisfies DoGetAddressDetailsResponse['votingLocations']

  /*
   * Get Positions
   */

  const rawCandidateList = await voterViewApi.getCandidateListByWard(ward)

  const positions = rawCandidateList.Positions.map((position) => ({
    NumberPositions: position.NumberPositions,
    PositionName: position.PositionName,

    Candidates: position.Candidates.map((candidate) => ({
      CandidateName: candidate.CandidateName,
      IsAcclaimed: candidate.IsAcclaimed
    }))
  }))

  response.json({
    positions,
    votingLocations
  } satisfies DoGetAddressDetailsResponse)
}
