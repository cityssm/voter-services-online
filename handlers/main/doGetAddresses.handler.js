import { voterViewApi } from '../../helpers/api.helpers.js';
export default async function handler(request, response) {
    const civicAddress = (request.query.civicAddress ?? '')
        .trim()
        .toLocaleLowerCase();
    const rawAddresses = await voterViewApi.getStreetAddresses(civicAddress);
    const addresses = rawAddresses
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
    response.json({
        addresses
    });
}
