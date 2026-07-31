import { parseMicrosoftJsonDate } from '@cityssm/voterview-api';
import { voterViewApi } from '../../helpers/api.helpers.js';
export default async function handler(request, response) {
    const ward = request.query.ward ?? '';
    const streetName = request.query.streetName ?? '';
    const streetNumber = request.query.streetNumber ?? '';
    const rawVotingLocations = await voterViewApi.getVotingLocationsByStreetAddress(streetNumber, streetName);
    const currentDate = new Date();
    const votingLocations = rawVotingLocations
        .filter((votingLocation) => {
        if (!votingLocation.IsAdvancePoll) {
            return true;
        }
        const dateOpen = parseMicrosoftJsonDate(votingLocation.DateOpenLocal);
        if (dateOpen === undefined) {
            return false;
        }
        if (dateOpen.getFullYear() === currentDate.getFullYear() &&
            dateOpen.getMonth() === currentDate.getMonth() &&
            dateOpen.getDate() === currentDate.getDate()) {
            return true;
        }
        if (dateOpen < currentDate) {
            return false;
        }
        return true;
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
    }));
    const rawCandidateList = await voterViewApi.getCandidateListByWard(ward);
    const positions = rawCandidateList.Positions.filter((position) => position.Candidates.length > 0).map((position) => ({
        NumberPositions: position.NumberPositions,
        PositionName: position.PositionName,
        Candidates: position.Candidates.map((candidate) => ({
            CandidateName: candidate.CandidateName,
            IsAcclaimed: candidate.IsAcclaimed
        }))
    }));
    response.json({
        positions,
        votingLocations
    });
}
