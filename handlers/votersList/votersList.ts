import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const streetNamesResult = await voterViewApi.getAllStreetNames()

  const streetNames = streetNamesResult
    .map((streetName) => streetName.Label)
    .toSorted((a, b) => a.localeCompare(b))

  response.render('votersListCheck', {
    streetNames
  })
}
