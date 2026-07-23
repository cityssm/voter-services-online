import { NodeCache } from '@cacheable/node-cache'
import type { StreetAddress } from '@cityssm/voterview-api/types'
import type { Request, Response } from 'express'

import { voterViewApi } from '../helpers/api.helpers.js'

interface DoGetAddressesRequest {
  civicAddress?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Better compatibility with client-side code
export type DoGetAddressesResponse = {
  addresses: Array<
    Pick<
      StreetAddress,
      'Address' | 'PollAndSuffix' | 'StreetNumber' | 'Ward'
    > & {
      StreetNameFull: string
    }
  >
}

const addressesCache = new NodeCache<DoGetAddressesResponse['addresses']>({
  stdTTL: 2 * 60 // 2 minutes
})

export default async function handler(
  request: Request<unknown, unknown, unknown, DoGetAddressesRequest>,
  response: Response
): Promise<void> {
  const civicAddress = (request.query.civicAddress ?? '')
    .trim()
    .toLocaleLowerCase()

  let addresses = addressesCache.get(civicAddress)

  if (addresses === undefined) {
    const rawAddresses = await voterViewApi.getStreetAddresses(civicAddress)

    addresses = rawAddresses
      .filter((address) => address.UnitNumber === '')
      .toSorted((streetAddressA, streetAddressB) =>
        streetAddressA.Address.localeCompare(streetAddressB.Address)
      )
      .slice(0, 10)
      .map((address) => ({
        Address: address.Address,
        PollAndSuffix: address.PollAndSuffix,
        StreetNameFull:
          `${address.StreetName} ${address.StreetType} ${address.StreetDirection}`.trim(),
        StreetNumber: address.StreetNumber,
        Ward: address.Ward
      }))

    addressesCache.set(civicAddress, addresses)
  }

  response.json({
    addresses
  } satisfies DoGetAddressesResponse)
}
