import type { DoGetAllStreetNamesResponse } from '../../handlers/votersList/doGetAllStreetNames.handler'

declare global {
  var voterServices: {
    urlPrefix: string

    debounce: (
      functionToDebounce: () => void,
      delayMillis: number
    ) => () => void
    doLoadStreetNames: (callback?: () => void) => Promise<void>

    resizeParentIFrame?: () => void
  }
}

;(() => {
  const streetNamesSessionStorageKey = 'voterServices.streetNames'

  let streetNames: string[]

  try {
    streetNames = JSON.parse(
      sessionStorage.getItem(streetNamesSessionStorageKey) ?? '[]'
    ) as string[]
  } catch {
    streetNames = []
  }

  function renderStreetNamesSelectElement(): void {
    const streetNamesSelectElement = document.querySelector<HTMLSelectElement>(
      'form select[name="streetName"]'
    )

    if (streetNamesSelectElement !== null) {
      if (!Array.isArray(streetNames)) {
        return
      }

      streetNamesSelectElement.innerHTML =
        '<option value="">(Select a Street Name)</option>'

      for (const streetName of streetNames) {
        const optionElement = document.createElement('option')
        optionElement.value = streetName
        optionElement.textContent = streetName
        streetNamesSelectElement.append(optionElement)
      }
    }
  }

  globalThis.window.voterServices = {
    urlPrefix: document.body.dataset.urlPrefix ?? '',

    /**
     * Debounce function
     * @param functionToDebounce - The function to debounce
     * @param delayMillis - The number of milliseconds to wait before invoking the function
     * @returns A debounced version of the function
     * @see https://davidwalsh.name/javascript-debounce-function
     */
    debounce(functionToDebounce: () => void, delayMillis: number): () => void {
      let timeout: NodeJS.Timeout | number | undefined

      return function (this: unknown, ..._arguments): void {
        const context = this as unknown as unknown[]

        const later = function (): void {
          timeout = undefined
          functionToDebounce.apply(context, _arguments)
        }

        globalThis.clearTimeout(timeout)
        timeout = setTimeout(later, delayMillis)
      }
    },

    async doLoadStreetNames(callback?: () => void): Promise<void> {
      if (streetNames.length > 0) {
        renderStreetNamesSelectElement()

        if (callback !== undefined) {
          callback()
        }

        return
      }

      const response = await fetch(
        `${document.body.dataset.urlPrefix}/votersList/doGetAllStreetNames`
      )

      const streetNamesResponse =
        (await response.json()) as DoGetAllStreetNamesResponse

      // eslint-disable-next-line require-atomic-updates
      streetNames = streetNamesResponse.streetNames

      sessionStorage.setItem(
        streetNamesSessionStorageKey,
        JSON.stringify(streetNames)
      )

      renderStreetNamesSelectElement()

      if (callback !== undefined) {
        callback()
      }
    }
  }
})()

/*
 * Iframe resizing
 */
;(() => {
  const parentIFrame = window.parent.document.querySelector<HTMLIFrameElement>(
    'iframe#iframe--votersList'
  )

  if (parentIFrame === null) {
    return
  }

  globalThis.voterServices.resizeParentIFrame = function (): void {
    parentIFrame.style.height = `${document.body.scrollHeight}px`
  }

  window.addEventListener('load', () => {
    globalThis.voterServices.resizeParentIFrame?.()
  })

  window.addEventListener('resize', () => {
    globalThis.voterServices.resizeParentIFrame?.()
  })
})()

/*
 * Form Submission Limit
 */

{
  const formElements =
    document.querySelectorAll<HTMLFormElement>('form[action]')

  for (const formElement of formElements) {
    formElement.addEventListener('submit', () => {
      for (const submitButtonElement of formElement.querySelectorAll<HTMLButtonElement>(
        'button[type="submit"]'
      )) {
        submitButtonElement.disabled = true
        submitButtonElement.classList.add('is-loading')
      }
    })
  }
}
