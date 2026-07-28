/* eslint-disable no-secrets/no-secrets */

import type { DoGetAddressDetailsResponse } from '../../handlers/main/doGetAddressDetails.handler.js'
import type { DoGetAddressesResponse } from '../../handlers/main/doGetAddresses.handler.js'

declare const voterServices: {
  debounce: (functionToDebounce: () => void, waitMillis: number) => () => void
}

;(() => {
  const addressSearchFieldElement = document.querySelector<HTMLInputElement>(
    '#addressSearch--civicAddress'
  )

  const addressSearchResultsElement = document.querySelector<HTMLDivElement>(
    '#container--addressSearchResults'
  )

  const addressDetailsElement = document.querySelector<HTMLDivElement>(
    '#container--addressDetails'
  )

  const votingLocationsElement = document.querySelector<HTMLDivElement>(
    '#container--votingLocations'
  )

  const candidatesElement = document.querySelector<HTMLDivElement>(
    '#container--candidates'
  )

  function renderVotingLocations(
    votingLocations: DoGetAddressDetailsResponse['votingLocations']
  ): void {
    if (votingLocationsElement === null) {
      return
    }

    if (votingLocations.length === 0) {
      votingLocationsElement.innerHTML = /* html */ `
        <div class="notification is-warning is-light">
          <strong>There are no voting locations available.</strong>
        </div>
      `
    } else {
      let hasElectionDayPolls = false

      const electionDayPanelElement = document.createElement('div')
      electionDayPanelElement.className = 'panel'

      electionDayPanelElement.innerHTML = /* html */ `
        <p class="panel-heading">
          Election Day
        </p>
      `

      let hasAdvancePolls = false

      const advancePollPanelElement = document.createElement('div')
      advancePollPanelElement.className = 'panel'

      advancePollPanelElement.innerHTML = /* html */ `
        <p class="panel-heading">
          Advance Polls
        </p>
      `

      for (const votingLocation of votingLocations) {
        const panelBlockElement = document.createElement('div')

        panelBlockElement.className = 'panel-block is-block'

        panelBlockElement.innerHTML = /* html */ `
          <div class="columns is-mobile">
            <div class="column">
              <span class="field--dateOpenStringLocal"></span><br />
              <span class="field--startTime"></span> to <span class="field--endTime"></span>
            </div>
            <div class="column">
              <div class="field--locationName"></div>
              <div class="field--address1"></div>
              <div class="field--address2"></div>
            </div>
          </div>
        `

        ;(
          panelBlockElement.querySelector(
            '.field--dateOpenStringLocal'
          ) as HTMLElement
        ).textContent = votingLocation.DateOpenStringLocal

        ;(
          panelBlockElement.querySelector('.field--startTime') as HTMLElement
        ).textContent = votingLocation.StartTime

        ;(
          panelBlockElement.querySelector('.field--endTime') as HTMLElement
        ).textContent = votingLocation.EndTime

        ;(
          panelBlockElement.querySelector('.field--locationName') as HTMLElement
        ).textContent = votingLocation.LocationName

        ;(
          panelBlockElement.querySelector('.field--address1') as HTMLElement
        ).textContent = votingLocation.Address1

        ;(
          panelBlockElement.querySelector('.field--address2') as HTMLElement
        ).textContent = votingLocation.Address2

        if (votingLocation.IsAdvancePoll) {
          hasAdvancePolls = true
          advancePollPanelElement.append(panelBlockElement)
        } else {
          hasElectionDayPolls = true
          electionDayPanelElement.append(panelBlockElement)
        }
      }

      votingLocationsElement.replaceChildren()

      if (hasElectionDayPolls) {
        votingLocationsElement.append(electionDayPanelElement)
      }

      if (hasAdvancePolls) {
        votingLocationsElement.append(advancePollPanelElement)
      }
    }
  }

  function renderCandidates(
    positions: DoGetAddressDetailsResponse['positions']
  ): void {
    if (candidatesElement === null) {
      return
    }

    if (positions.length === 0) {
      candidatesElement.innerHTML = /* html */ `
        <div class="notification is-warning is-light">
          <strong>There are no candidates available.</strong>
        </div>
      `
    } else {
      candidatesElement.replaceChildren()

      for (const position of positions) {
        if (position.Candidates.length === 0) {
          continue
        }

        const positionElement = document.createElement('div')
        positionElement.className = 'panel'
        positionElement.innerHTML = /* html */ `
          <div class="panel-heading">
            <div class="columns is-mobile">
              <div class="column">
                <span class="field--positionName"></span>
              </div>
              <div class="column is-narrow has-text-right">
                <div class="tags has-addons">
                  <span class="tag is-dark">Positions Available</span>
                  <span class="tag field--numberPositions"></span>
                </div>
              </div>
            </div>
          </div>
        `

        ;(
          positionElement.querySelector('.field--positionName') as HTMLElement
        ).textContent = position.PositionName

        ;(
          positionElement.querySelector(
            '.field--numberPositions'
          ) as HTMLElement
        ).textContent = position.NumberPositions.toString()

        for (const candidate of position.Candidates) {
          const panelBlockElement = document.createElement('div')

          panelBlockElement.className = 'panel-block is-block'

          // eslint-disable-next-line no-unsanitized/property
          panelBlockElement.innerHTML = /* html */ `
            <div class="columns is-mobile">
              <div class="column">
                <span class="field--candidateName"></span>
              </div>
              <div class="column is-narrow has-text-right">
                ${
                  candidate.IsAcclaimed ||
                  position.NumberPositions >= position.Candidates.length
                    ? '<span class="tag is-success">Acclaimed</span>'
                    : ''
                }
              </div>
            </div>
          `

          ;(
            panelBlockElement.querySelector(
              '.field--candidateName'
            ) as HTMLElement
          ).textContent = candidate.CandidateName

          positionElement.append(panelBlockElement)
        }

        candidatesElement.append(positionElement)
      }
    }
  }

  async function doDisplayAddress(
    address: DoGetAddressesResponse['addresses'][number]
  ): Promise<void> {
    if (
      addressDetailsElement === null ||
      votingLocationsElement === null ||
      candidatesElement === null
    ) {
      return
    }

    ;(
      addressDetailsElement.querySelector(
        '#addressDetails--address'
      ) as HTMLElement
    ).textContent = address.Address

    ;(
      addressDetailsElement.querySelector(
        '#addressDetails--ward'
      ) as HTMLElement
    ).textContent = address.Ward

    ;(
      addressDetailsElement.querySelector(
        '#addressDetails--pollAndSuffix'
      ) as HTMLElement
    ).textContent = address.PollAndSuffix

    votingLocationsElement.innerHTML = /* html */ `
      <div class="notification is-info is-light">
        <strong>Loading voting locations...</strong>
      </div>
    `

    candidatesElement.innerHTML = /* html */ `
      <div class="notification is-info is-light">
        <strong>Loading candidates...</strong>
      </div>
    `

    addressDetailsElement.classList.remove('is-hidden')

    const urlParameters = new URLSearchParams({
      ward: address.Ward,

      streetName: address.StreetNameFull,
      streetNumber: address.StreetNumber
    })

    await fetch(`doGetAddressDetails?${urlParameters.toString()}`)
      .then(
        async (response) =>
          (await response.json()) as DoGetAddressDetailsResponse
      )
      .then((addressDetails) => {
        renderVotingLocations(addressDetails.votingLocations)
        renderCandidates(addressDetails.positions)
      })
  }

  async function doAddressSearch(): Promise<void> {
    if (addressSearchResultsElement === null) {
      return
    }

    const civicAddress = addressSearchFieldElement?.value ?? ''

    // eslint-disable-next-line require-unicode-regexp
    if (!/^\d/.test(civicAddress)) {
      addressSearchResultsElement.innerHTML = /* html */ `
        <div class="notification is-info is-light">
          To get started, enter a civic address in the field above.<br />
          <em>i.e. 123 Main Street</em>
        </div>
      `

      return
    }

    await fetch(
      `doGetAddresses?civicAddress=${encodeURIComponent(civicAddress)}`
    )
      .then(
        async (response) => (await response.json()) as DoGetAddressesResponse
      )
      .then((addressSearchResults) => {
        if (addressSearchResults.addresses.length === 0) {
          addressSearchResultsElement.innerHTML = /* html */ `
            <div class="notification is-warning is-light">
              <strong>There are no addresses available.</strong><br />
              Be sure to use a complete civic address, with the civic number first.
            </div>
          `

          return
        }

        const panelElement = document.createElement('div')
        panelElement.className = 'panel'

        for (const [
          addressIndex,
          address
        ] of addressSearchResults.addresses.entries()) {
          const panelBlockElement = document.createElement('a')

          panelBlockElement.className = 'panel-block is-block'
          panelBlockElement.dataset.addressIndex = addressIndex.toString()

          panelBlockElement.href = '#'
          panelBlockElement.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault()

            // Set the address search field to the selected address
            if (addressSearchFieldElement !== null) {
              addressSearchFieldElement.value = address.Address
            }

            // Hide the address search results
            addressSearchResultsElement.classList.add('is-hidden')

            // Hide all other address search results
            for (const possiblePanelBlockElement of addressSearchResultsElement.querySelectorAll<HTMLElement>(
              '.panel-block'
            )) {
              if (
                possiblePanelBlockElement.dataset.addressIndex !==
                panelBlockElement.dataset.addressIndex
              ) {
                possiblePanelBlockElement.classList.add('is-hidden')
                possiblePanelBlockElement.classList.remove('is-block')
              }
            }

            void doDisplayAddress(address)
          })

          panelBlockElement.innerHTML = /* html */ `
            <div class="columns is-mobile">
              <div class="column field--address"></div>
              <div class="column is-narrow has-text-right">
                Ward <span class="field--ward"></span><br />
                Poll <span class="field--pollAndSuffix"></span>
              </div>
            </div>
          `

          ;(
            panelBlockElement.querySelector('.field--address') as HTMLElement
          ).textContent = address.Address

          ;(
            panelBlockElement.querySelector('.field--ward') as HTMLElement
          ).textContent = address.Ward

          ;(
            panelBlockElement.querySelector(
              '.field--pollAndSuffix'
            ) as HTMLElement
          ).textContent = address.PollAndSuffix

          panelElement.append(panelBlockElement)
        }

        addressSearchResultsElement.replaceChildren(panelElement)
      })
  }

  document
    .querySelector<HTMLFormElement>('#form--addressSearch')
    ?.addEventListener('submit', (formSubmitEvent) => {
      formSubmitEvent.preventDefault()
      void doAddressSearch()
    })

  const debouncedAddressSearch = voterServices.debounce(() => {
    void doAddressSearch()
  }, 200)

  addressSearchFieldElement?.addEventListener('focus', () => {
    addressSearchResultsElement?.classList.remove('is-hidden')
  })

  addressSearchFieldElement?.addEventListener('input', debouncedAddressSearch)

  void doAddressSearch()
})()

// Modals

;(() => {
  const votersListModalElement =
    document.querySelector<HTMLDivElement>('#modal--votersList')

  document
    .querySelector<HTMLButtonElement>('#button--votersList')
    ?.addEventListener('click', () => {
      votersListModalElement
        ?.querySelector('iframe')
        ?.setAttribute('src', 'about:blank')

      votersListModalElement?.classList.add('is-active')
      document.documentElement.classList.add('is-clipped')

      votersListModalElement
        ?.querySelector('iframe')
        ?.setAttribute('src', 'votersList')
    })

  function closeModal(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    ;(clickEvent.currentTarget as HTMLButtonElement)
      .closest('.modal')
      ?.classList.remove('is-active')

    document.documentElement.classList.remove('is-clipped')

    votersListModalElement
      ?.querySelector('iframe')
      ?.setAttribute('src', 'about:blank')
  }

  for (const closeButtonElement of document.querySelectorAll<HTMLButtonElement>(
    '.modal-background, .modal-close-button'
  )) {
    closeButtonElement.addEventListener('click', closeModal)
  }
})()
