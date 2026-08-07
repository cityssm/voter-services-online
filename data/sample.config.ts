import type { Config } from '../types/config.types.js'

export const config: Config = {
  application: {
    httpPort: 8080,

    applicationName: 'Sample City Voter Services',

    footer: '_mainFooterOntario2026'
  },

  reverseProxy: {},

  voterViewApi: {
    countyMunicipalityCode: '9999',

    username: 'SAMPLE',
    password: 'samplePass',

    useTrainingDatabase: true
  },

  settings: {
    city: 'Sample City',
    province: 'ON'
  }
}

export default config
