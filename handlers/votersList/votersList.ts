import type { Request, Response } from 'express'

import configFunctions from '../../helpers/config.helpers.js'

export default function handler(_request: Request, response: Response): void {
  response.render('votersListCheck', {
    configFunctions,
    urlPrefix: configFunctions.getConfigProperty('reverseProxy.urlPrefix')
  })
}
