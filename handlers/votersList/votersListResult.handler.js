import formatCivicAddress, { postalCodeRegex } from '@cityssm/civic-address-format';
import { isCanada } from '@cityssm/statscan-tools';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from '../../debug.config.js';
import { countries, provinces } from '../../helpers/address.helpers.js';
import { voterViewApi } from '../../helpers/api.helpers.js';
import { getConfigProperty } from '../../helpers/config.helpers.js';
const debug = Debug(`${DEBUG_NAMESPACE}:handlers:votersList:votersListResult`);
export default async function handler(request, response) {
    const voterRecord = (await voterViewApi.getVotersListRecord({
        FirstName: request.body.firstName.trim(),
        LastName: request.body.lastName.trim(),
        BirthDay: request.body.dateOfBirthDay.trim(),
        BirthMonth: request.body.dateOfBirthMonth.trim(),
        BirthYear: request.body.dateOfBirthYear.trim(),
        StreetName: request.body.streetName.trim(),
        StreetType: '',
        StreetNumber: request.body.streetNumber.trim(),
        UnitNumber: request.body.unitNumber.trim()
    }));
    voterRecord.FirstName ??= request.body.firstName.trim();
    voterRecord.LastName ??= request.body.lastName.trim();
    voterRecord.FullName ??= `${voterRecord.FirstName} ${voterRecord.LastName}`;
    voterRecord.DateOfBirth ??=
        `${request.body.dateOfBirthYear.trim()}-${request.body.dateOfBirthMonth.trim()}-${request.body.dateOfBirthDay.trim().padStart(2, '0')}`;
    voterRecord.PropertyAddress ??= formatCivicAddress({
        civicNumber: request.body.streetNumber.trim(),
        streetName: request.body.streetName.trim(),
        unitNumber: request.body.unitNumber.trim()
    });
    voterRecord.StreetName = request.body.streetName.trim();
    voterRecord.StreetNumber = request.body.streetNumber.trim();
    voterRecord.Unit = request.body.unitNumber.trim();
    voterRecord.City ??= getConfigProperty('settings.city');
    voterRecord.Province ??= getConfigProperty('settings.province');
    voterRecord.Country ??= 'Canada';
    debug('Voter Record: %O', voterRecord);
    const voterRecordIsCanada = isCanada(voterRecord.Country);
    response.render('votersListUpdate', {
        voterRecord,
        countries,
        provinces,
        voterRecordIsCanada,
        isCanada,
        postalCodeRegex
    });
}
