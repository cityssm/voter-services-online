import type { DoGetVoterDetailListsResponse } from '../../handlers/votersList/doGetVoterDetailLists.handler.js'

;(() => {
  /*
   * Show Form Button
   */

  document
    .querySelector('.is-show-form-button')
    ?.addEventListener('click', () => {
      document
        .querySelector('#tabContainer--result')
        ?.classList.add('is-hidden')

      document
        .querySelector('#tabContainer--form')
        ?.classList.remove('is-hidden')

      voterServices.resizeParentIFrame?.()
    })

  /*
   * Load Voter Detail Lists
   */

  async function doLoadVoterDetailLists(): Promise<void> {
    await fetch(`${voterServices.urlPrefix}/votersList/doGetVoterDetailLists`)
      .then(
        async (response) =>
          (await response.json()) as DoGetVoterDetailListsResponse
      )
      .then((voterDetailListsResponse) => {
        const residencyStatusSelectElement =
          document.querySelector<HTMLSelectElement>(
            '#votersListUpdate--residencyStatus'
          )

        const occupancyStatusSelectElement =
          document.querySelector<HTMLSelectElement>(
            '#votersListUpdate--occupancyStatus'
          )

        const religionCodeSelectElement =
          document.querySelector<HTMLSelectElement>(
            '#votersListUpdate--religion'
          )

        const schoolSupportCodeSelectElement =
          document.querySelector<HTMLSelectElement>(
            '#votersListUpdate--schoolSupport'
          )

        const frenchLanguageRightsSelectElement =
          document.querySelector<HTMLSelectElement>(
            '#votersListUpdate--frenchLanguageRights'
          )

        if (residencyStatusSelectElement !== null) {
          for (const residencyStatus of voterDetailListsResponse.residencyStatuses) {
            const optionElement = document.createElement('option')
            optionElement.value = residencyStatus.ResidencyStatusCode
            optionElement.textContent =
              residencyStatus.ResidencyStatusDescription

            if (
              residencyStatus.ResidencyStatusCode ===
              residencyStatusSelectElement.dataset.defaultValue
            ) {
              optionElement.selected = true
            }

            residencyStatusSelectElement.append(optionElement)
          }
        }

        if (occupancyStatusSelectElement !== null) {
          for (const occupancyStatus of voterDetailListsResponse.occupancyStatuses) {
            const optionElement = document.createElement('option')
            optionElement.value = occupancyStatus.OccupancyStatusCode
            optionElement.textContent =
              occupancyStatus.OccupancyStatusDescription

            if (
              occupancyStatus.OccupancyStatusCode ===
              occupancyStatusSelectElement.dataset.defaultValue
            ) {
              optionElement.selected = true
            }

            occupancyStatusSelectElement.append(optionElement)
          }
        }

        if (religionCodeSelectElement !== null) {
          for (const religionCode of voterDetailListsResponse.religionCodes) {
            const optionElement = document.createElement('option')
            optionElement.value = religionCode.ReligionCode
            optionElement.textContent = religionCode.ReligionDescription

            if (
              religionCode.ReligionCode ===
              religionCodeSelectElement.dataset.defaultValue
            ) {
              optionElement.selected = true
            }

            religionCodeSelectElement.append(optionElement)
          }
        }

        if (schoolSupportCodeSelectElement !== null) {
          for (const schoolSupportCode of voterDetailListsResponse.schoolSupportCodes) {
            const optionElement = document.createElement('option')
            optionElement.value = schoolSupportCode.SchoolSupportCode
            optionElement.textContent =
              schoolSupportCode.SchoolSupportDescription

            if (
              schoolSupportCode.SchoolSupportCode ===
              schoolSupportCodeSelectElement.dataset.defaultValue
            ) {
              optionElement.selected = true
            }

            schoolSupportCodeSelectElement.append(optionElement)
          }
        }

        if (frenchLanguageRightsSelectElement !== null) {
          for (const frenchLanguageRights of voterDetailListsResponse.frenchRightsCodes) {
            const optionElement = document.createElement('option')
            optionElement.value = frenchLanguageRights.FrenchLanguageRightsCode
            optionElement.textContent =
              frenchLanguageRights.FrenchLanguageRightsDescription

            if (
              frenchLanguageRights.FrenchLanguageRightsCode ===
              frenchLanguageRightsSelectElement.dataset.defaultValue
            ) {
              optionElement.selected = true
            }

            frenchLanguageRightsSelectElement.append(optionElement)
          }
        }
      })
  }

  void doLoadVoterDetailLists()

  void voterServices.doLoadStreetNames(() => {
    const streetNameSelectElement = document.querySelector<HTMLSelectElement>(
      '#votersListUpdate--streetName'
    )

    if (streetNameSelectElement !== null) {
      const defaultStreetName = streetNameSelectElement.dataset.defaultValue

      if (defaultStreetName !== undefined) {
        const optionElement =
          streetNameSelectElement.querySelector<HTMLOptionElement>(
            `option[value="${CSS.escape(defaultStreetName)}"]`
          )

        if (optionElement !== null) {
          optionElement.selected = true
        }
      }
    }
  })

  /*
   * Contact Method Toggle
   */

  const preferredContactMethodSelectElement =
    document.querySelector<HTMLSelectElement>(
      '#votersListUpdate--preferredContactMethod'
    )

  preferredContactMethodSelectElement?.addEventListener('change', () => {
    const phoneNumberInputElement = document.querySelector<HTMLInputElement>(
      '#votersListUpdate--phoneNumber'
    )

    if (preferredContactMethodSelectElement.value === 'Phone') {
      phoneNumberInputElement?.setAttribute('required', 'true')
    } else {
      phoneNumberInputElement?.removeAttribute('required')
    }
  })

  /*
   * Country Province Toggle
   */

  const countrySelectElement = document.querySelector<HTMLSelectElement>(
    '#votersListUpdate--mailingCountry'
  )

  const provinceCanadaSelectElement = document.querySelector<HTMLSelectElement>(
    '#votersListUpdate--mailingProvinceCanada'
  )

  const provinceOtherInputElement = document.querySelector<HTMLInputElement>(
    '#votersListUpdate--mailingProvinceOther'
  )

  function toggleProvinceInput(): void {
    if (
      countrySelectElement === null ||
      provinceCanadaSelectElement === null ||
      provinceOtherInputElement === null
    ) {
      return
    }

    const isCanada =
      countrySelectElement.selectedOptions[0].dataset.isCanada === 'true'

    if (isCanada) {
      provinceCanadaSelectElement.removeAttribute('disabled')
      provinceCanadaSelectElement
        .closest('.field')
        ?.classList.remove('is-hidden')

      provinceOtherInputElement.setAttribute('disabled', 'true')
      provinceOtherInputElement.closest('.field')?.classList.add('is-hidden')
    } else {
      provinceCanadaSelectElement.setAttribute('disabled', 'true')
      provinceCanadaSelectElement.closest('.field')?.classList.add('is-hidden')

      provinceOtherInputElement.removeAttribute('disabled')
      provinceOtherInputElement.closest('.field')?.classList.remove('is-hidden')
    }
  }

  countrySelectElement?.addEventListener('change', toggleProvinceInput)

  /*
   * Copy Residential Address to Mailing Address
   */

  document
    .querySelector('#votersListUpdate--copyResidentialAddress')
    ?.addEventListener('click', () => {
      // Address

      const residentialStreetNumberInputElement =
        document.querySelector<HTMLInputElement>(
          '#votersListUpdate--streetNumber'
        ) as HTMLInputElement

      const residentialStreetNumberSuffixInputElement =
        document.querySelector<HTMLInputElement>(
          '#votersListUpdate--streetNumberSuffix'
        ) as HTMLInputElement

      const residentialStreetNameSelectElement =
        document.querySelector<HTMLSelectElement>(
          '#votersListUpdate--streetName'
        ) as HTMLSelectElement

      const residentialUnitNumberInputElement =
        document.querySelector<HTMLInputElement>(
          '#votersListUpdate--unitNumber'
        ) as HTMLInputElement

      const address1InputElement = document.querySelector<HTMLInputElement>(
        '#votersListUpdate--mailingAddress1'
      ) as HTMLInputElement

      let address = residentialStreetNumberInputElement.value

      if (residentialStreetNumberSuffixInputElement.value !== '') {
        address += ` ${residentialStreetNumberSuffixInputElement.value}`
      }

      if (residentialStreetNameSelectElement.selectedOptions[0].value !== '') {
        address += ` ${residentialStreetNameSelectElement.selectedOptions[0].textContent}`
      }

      if (residentialUnitNumberInputElement.value !== '') {
        address += `, UNIT ${residentialUnitNumberInputElement.value}`
      }

      address1InputElement.value = address

      // City

      const mailingCityInputElement = document.querySelector<HTMLInputElement>(
        '#votersListUpdate--mailingCity'
      ) as HTMLInputElement

      mailingCityInputElement.value =
        mailingCityInputElement.dataset.configValue ?? ''

      // Country

      const mailingCountrySelectElement =
        document.querySelector<HTMLSelectElement>(
          '#votersListUpdate--mailingCountry'
        ) as HTMLSelectElement

      mailingCountrySelectElement.value =
        mailingCountrySelectElement.querySelector<HTMLOptionElement>(
          'option[data-is-canada="true"]'
        )?.value ?? ''

      toggleProvinceInput()

      // Province

      const mailingProvinceCanadaSelectElement =
        document.querySelector<HTMLSelectElement>(
          '#votersListUpdate--mailingProvinceCanada'
        ) as HTMLSelectElement

      mailingProvinceCanadaSelectElement.value =
        mailingProvinceCanadaSelectElement.dataset.configValue ?? ''
    })

  /*
   * Upload ID File Input
   */

  const uploadIDFileInputElement = document.querySelector<HTMLInputElement>(
    '#votersListUpdate--uploadID'
  )

  uploadIDFileInputElement?.addEventListener('change', () => {
    const uploadIDFileNameElement = document.querySelector<HTMLSpanElement>(
      '#votersListUpdate--uploadIDFileName'
    )

    if (
      uploadIDFileNameElement !== null &&
      uploadIDFileInputElement.files?.length === 1
    ) {
      const fileSizeInBytes = uploadIDFileInputElement.files[0].size

      if (fileSizeInBytes > 10 * 1024 * 1024) {
        // eslint-disable-next-line no-alert
        alert(
          'The file you selected is too large. Please select a file that is less than 10 MB in size.'
        )

        uploadIDFileInputElement.value = ''
        uploadIDFileNameElement.textContent = ''

        return
      }

      uploadIDFileNameElement.textContent =
        uploadIDFileInputElement.files[0].name
    }
  })
})()
