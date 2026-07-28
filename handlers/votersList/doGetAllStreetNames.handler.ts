import { streetNamesToStringArray } from '@cityssm/voterview-api'
import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Better compatibility with client-side code
export type DoGetAllStreetNamesResponse = {
  streetNames: string[]
}

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const rawStreetNames = await voterViewApi.getAllStreetNames()

  const streetNames = streetNamesToStringArray(rawStreetNames)

  response.json({
    streetNames
  } satisfies DoGetAllStreetNamesResponse)
}
