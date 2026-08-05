import { isSameDay } from '@cityssm/utils-datetime'
import {
  type CandidateList,
  type VotingLocation,
  parseMicrosoftJsonDate
} from '@cityssm/voterview-api'
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

  const currentDate = new Date()

  const votingLocations = rawVotingLocations
    .filter((votingLocation) => {
      if (!votingLocation.IsAdvancePoll) {
        return true
      }

      const dateOpen = parseMicrosoftJsonDate(votingLocation.DateOpenLocal)

      if (dateOpen === undefined) {
        return false
      }

      if (isSameDay(dateOpen, currentDate)) {
        return true
      }

      return dateOpen >= currentDate
    })
    .map((votingLocation) => ({
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

  const positions = rawCandidateList.Positions.filter(
    (position) => position.Candidates.length > 0
  ).map((position) => ({
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
