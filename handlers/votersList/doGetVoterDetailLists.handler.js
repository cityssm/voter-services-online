import { voterViewApi } from '../../helpers/api.helpers.js';
export default async function handler(_request, response) {
    const frenchRightsCodes = await voterViewApi.getFrenchLanguageRightsCodes();
    const genders = await voterViewApi.getGenders();
    const occupancyStatuses = await voterViewApi.getOccupancyStatuses();
    const religionCodes = await voterViewApi.getRomanCatholicReligionCodes();
    const residencyStatuses = await voterViewApi.getResidencyStatuses();
    const schoolSupportCodes = await voterViewApi.getSchoolSupportCodes();
    response.json({
        frenchRightsCodes,
        genders,
        occupancyStatuses,
        religionCodes,
        residencyStatuses,
        schoolSupportCodes
    });
}
