import { voterViewApi } from '../../helpers/api.helpers.js';
export default function handler(_request, response) {
    response.render('votersListCheck', {});
    response.on('finish', () => {
        void voterViewApi.getGenders();
        void voterViewApi.getSchoolSupportCodes();
        void voterViewApi.getOccupancyStatuses();
        void voterViewApi.getRomanCatholicReligionCodes();
        void voterViewApi.getResidencyStatuses();
        void voterViewApi.getFrenchLanguageRightsCodes();
    });
}
