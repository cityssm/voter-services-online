;(() => {
  void voterServices.doLoadStreetNames()

  const tabLinkElements =
    document.querySelectorAll<HTMLAnchorElement>('.tabs li a')
  const tabContentElements = document.querySelectorAll<HTMLElement>(
    '.tabs-content .tab-content'
  )

  function switchTab(clickEvent: MouseEvent): void {
    clickEvent.preventDefault()

    const selectedTabLinkElement = clickEvent.currentTarget as HTMLAnchorElement
    const tabId = selectedTabLinkElement.getAttribute('aria-controls')

    if (tabId === null) {
      return
    }

    for (const tabLinkElement of tabLinkElements) {
      tabLinkElement.parentElement?.classList.toggle(
        'is-active',
        tabLinkElement.getAttribute('aria-controls') === tabId
      )
    }

    for (const tabContentElement of tabContentElements) {
      tabContentElement.classList.toggle(
        'is-hidden',
        tabContentElement.id !== tabId
      )
    }

    voterServices.resizeParentIFrame?.()
  }

  for (const tabLinkElement of tabLinkElements) {
    tabLinkElement.addEventListener('click', switchTab)
  }
})()
