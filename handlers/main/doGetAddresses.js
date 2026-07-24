import { NodeCache } from '@cacheable/node-cache';
import { voterViewApi } from '../../helpers/api.helpers.js';
const addressesCache = new NodeCache({
    stdTTL: 2 * 60
});
export default async function handler(request, response) {
    const civicAddress = (request.query.civicAddress ?? '')
        .trim()
        .toLocaleLowerCase();
    let addresses = addressesCache.get(civicAddress);
    if (addresses === undefined) {
        const rawAddresses = await voterViewApi.getStreetAddresses(civicAddress);
        addresses = rawAddresses
            .filter((address) => address.UnitNumber === '')
            .toSorted((streetAddressA, streetAddressB) => streetAddressA.Address.localeCompare(streetAddressB.Address))
            .slice(0, 10)
            .map((address) => ({
            Address: address.Address,
            PollAndSuffix: address.PollAndSuffix,
            StreetNameFull: `${address.StreetName} ${address.StreetType} ${address.StreetDirection}`.trim(),
            StreetNumber: address.StreetNumber,
            Ward: address.Ward
        }));
        addressesCache.set(civicAddress, addresses);
    }
    response.json({
        addresses
    });
}
