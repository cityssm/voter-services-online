"use strict";
;
(() => {
    void voterServices.doLoadStreetNames();
    const tabLinkElements = document.querySelectorAll('.tabs li a');
    const tabContentElements = document.querySelectorAll('.tabs-content .tab-content');
    function switchTab(clickEvent) {
        clickEvent.preventDefault();
        const selectedTabLinkElement = clickEvent.currentTarget;
        const tabId = selectedTabLinkElement.getAttribute('aria-controls');
        if (tabId === null) {
            return;
        }
        for (const tabLinkElement of tabLinkElements) {
            tabLinkElement.parentElement?.classList.toggle('is-active', tabLinkElement.getAttribute('aria-controls') === tabId);
        }
        for (const tabContentElement of tabContentElements) {
            tabContentElement.classList.toggle('is-hidden', tabContentElement.id !== tabId);
        }
        voterServices.resizeParentIFrame?.();
    }
    for (const tabLinkElement of tabLinkElements) {
        tabLinkElement.addEventListener('click', switchTab);
    }
    document.querySelector('#votersList--firstName')?.focus();
})();
