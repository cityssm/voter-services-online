import type { DoGetAllStreetNamesResponse } from '../../handlers/votersList/doGetAllStreetNames.handler.js'

;(() => {
  async function doLoadStreetNames(): Promise<void> {
    await fetch('votersList/doGetAllStreetNames')
      .then(
        async (response) =>
          (await response.json()) as DoGetAllStreetNamesResponse
      )
      .then((streetNamesResponse) => {
        const streetNamesSelectElement =
          document.querySelector<HTMLSelectElement>('#votersList--streetName')

        if (streetNamesSelectElement !== null) {
          streetNamesSelectElement.innerHTML =
            '<option value="">(Select a street name)</option>'

          for (const streetName of streetNamesResponse.streetNames) {
            const optionElement = document.createElement('option')
            optionElement.value = streetName
            optionElement.textContent = streetName
            streetNamesSelectElement.append(optionElement)
          }
        }
      })
  }

  void doLoadStreetNames()
})()
