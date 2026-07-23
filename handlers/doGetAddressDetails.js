import { NodeCache } from '@cacheable/node-cache';
import { voterViewApi } from '../helpers/api.helpers.js';
const positionsCache = new NodeCache({
    stdTTL: 2 * 60
});
export default async function handler(request, response) {
    const ward = request.query.ward ?? '';
    const streetName = request.query.streetName ?? '';
    const streetNumber = request.query.streetNumber ?? '';
    const rawVotingLocations = await voterViewApi.findVotingLocationsByStreetAddress(streetNumber, streetName);
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
    }));
    let positions = positionsCache.get(ward);
    if (positions === undefined) {
        const rawCandidateList = await voterViewApi.getCandidateListByWard(ward);
        positions = rawCandidateList.Positions.map((position) => ({
            NumberPositions: position.NumberPositions,
            PositionName: position.PositionName,
            Candidates: position.Candidates.map((candidate) => ({
                CandidateName: candidate.CandidateName
            }))
        }));
        positionsCache.set(ward, positions);
    }
    response.json({
        positions,
        votingLocations
    });
}
