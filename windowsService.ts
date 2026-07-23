import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

const _dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: 'Voter Services Online',

  description:
    'An online portal to assist voters with navigating municipal elections, using the VoterView API.',

  script: path.join(_dirname, 'index.js')
}
