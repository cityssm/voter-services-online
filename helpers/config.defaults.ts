export const configDefaultValues = {
  'application.httpPort': 9000,

  'application.applicationName': 'Voter Services Online',

  'reverseProxy.disableCompression': false,
  'reverseProxy.disableEtag': false,
  'reverseProxy.disableRateLimit': false,
  'reverseProxy.trafficIsForwarded': false,
  'reverseProxy.urlPrefix': '',

  'voterViewApi.countyMunicipalityCode': '',
  'voterViewApi.password': '',
  'voterViewApi.username': '',
  'voterViewApi.useTrainingDatabase': false,

  'settings.defaultCity': '',
  'settings.defaultProvince': 'ON'
}

export default configDefaultValues
