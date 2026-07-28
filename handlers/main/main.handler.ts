import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'
import packageJson from '../../package.json' with { type: 'json' }

export const version = packageJson.version

export default function handler(_request: Request, response: Response): void {
  response.render('main', {
    buildNumber: version
  })

  response.on('finish', () => {
    void voterViewApi.getAllStreetNames()
  })
}
