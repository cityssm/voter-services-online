"use strict";
globalThis.voterServices = {
    debounce: function (functionToDebounce, waitMillis) {
        let timeout;
        return function (..._arguments) {
            const context = this;
            const later = function () {
                timeout = undefined;
                functionToDebounce.apply(context, _arguments);
            };
            globalThis.clearTimeout(timeout);
            timeout = setTimeout(later, waitMillis);
        };
    }
};
(() => {
    const parentIFrame = window.parent.document.querySelector('iframe#iframe--votersList');
    if (parentIFrame === null) {
        return;
    }
    globalThis.voterServices.resizeParentIFrame = function () {
        parentIFrame.style.height = `${document.body.scrollHeight}px`;
    };
    window.addEventListener('load', () => {
        globalThis.voterServices.resizeParentIFrame();
    });
    window.addEventListener('resize', () => {
        globalThis.voterServices.resizeParentIFrame();
    });
})();
