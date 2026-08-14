import type { provincesTerritoriesAlphaCodes } from '@cityssm/statscan-tools'

export const configDefaultValues = {
  'application.httpPort': 9000,

  'application.applicationName': 'Voter Services Online',
  'application.footer': '_mainFooterOntario2026',

  'reverseProxy.disableCompression': false,
  'reverseProxy.disableEtag': false,
  'reverseProxy.disableRateLimit': false,
  'reverseProxy.trafficIsForwarded': false,
  'reverseProxy.urlPrefix': '',

  'voterViewApi.countyMunicipalityCode': '',
  'voterViewApi.password': '',
  'voterViewApi.username': '',
  'voterViewApi.useTrainingDatabase': false,

  'settings.city': '',
  'settings.province': 'ON' as (typeof provincesTerritoriesAlphaCodes)[number],

  'settings.candidateListUrl': ''
}

export default configDefaultValues
