globalThis.voterServices = {
  /**
   * Debounce function
   * @param functionToDebounce - The function to debounce
   * @param waitMillis - The number of milliseconds to wait before invoking the function
   * @returns A debounced version of the function
   * @see https://davidwalsh.name/javascript-debounce-function
   */
  debounce: function (
    functionToDebounce: () => void,
    waitMillis: number
  ): () => void {
    let timeout: NodeJS.Timeout | number | undefined

    return function (this: unknown, ..._arguments): void {
      // eslint-disable-next-line unicorn/no-this-outside-of-class
      const context = this as unknown as unknown[]

      const later = function (): void {
        timeout = undefined
        functionToDebounce.apply(context, _arguments)
      }

      globalThis.clearTimeout(timeout)
      timeout = setTimeout(later, waitMillis)
    }
  }
}

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
    globalThis.voterServices.resizeParentIFrame()
  })

  window.addEventListener('resize', () => {
    globalThis.voterServices.resizeParentIFrame()
  })
})()
