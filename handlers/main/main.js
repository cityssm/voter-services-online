import { voterViewApi } from '../../helpers/api.helpers.js';
import packageJson from '../../package.json' with { type: 'json' };
export const version = packageJson.version;
export default function handler(_request, response) {
    response.render('main', {
        buildNumber: version
    });
    response.on('finish', () => {
        void voterViewApi.getAllStreetNames();
    });
}
