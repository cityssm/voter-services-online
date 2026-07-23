import type { Request, Response } from 'express'

import configFunctions from '../helpers/config.helpers.js'
import packageJson from '../package.json' with { type: 'json' }

export const version = packageJson.version

export default function handler(_request: Request, response: Response): void {
  response.render('main', {
    buildNumber: version,
    configFunctions,
    urlPrefix: configFunctions.getConfigProperty('reverseProxy.urlPrefix')
  })
}
