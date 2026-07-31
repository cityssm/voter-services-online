import { provincesTerritories } from '@cityssm/statscan-tools'
import { countries as rawCountries } from 'countries-list'

/**
 * Countries list from the `countries-list` package, sorted by country name.
 * Each entry is an array of two strings: the country code and the country name.
 * i.e. ['CA', 'Canada']
 */
export const countries: string[][] = Object.entries(rawCountries)
  .map(([countryCode, countryData]) => [countryCode, countryData.name])
  // Sort the countries by name, ignoring case and diacritics, but put "Canada" at the top of the list
  .toSorted((a, b) => {
    if (a[1] === 'Canada') return -1
    if (b[1] === 'Canada') return 1
    return a[1].localeCompare(b[1], 'en', { sensitivity: 'base' })
  })

export const provinces: string[][] = Object.entries(provincesTerritories)
  .map(([provinceCode, provinceData]) => [provinceCode, provinceData.name])
  .toSorted((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }))
