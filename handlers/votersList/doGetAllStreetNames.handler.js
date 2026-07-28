import { streetNamesToStringArray } from '@cityssm/voterview-api';
import { voterViewApi } from '../../helpers/api.helpers.js';
export default async function handler(_request, response) {
    const rawStreetNames = await voterViewApi.getAllStreetNames();
    const streetNames = streetNamesToStringArray(rawStreetNames);
    response.json({
        streetNames
    });
}
