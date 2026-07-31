import { provincesTerritories } from '@cityssm/statscan-tools';
import { countries as rawCountries } from 'countries-list';
export const countries = Object.entries(rawCountries)
    .map(([countryCode, countryData]) => [countryCode, countryData.name])
    .toSorted((a, b) => {
    if (a[1] === 'Canada')
        return -1;
    if (b[1] === 'Canada')
        return 1;
    return a[1].localeCompare(b[1], 'en', { sensitivity: 'base' });
});
export const provinces = Object.entries(provincesTerritories)
    .map(([provinceCode, provinceData]) => [provinceCode, provinceData.name])
    .toSorted((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }));
