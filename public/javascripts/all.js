;
(() => {
    const streetNamesSessionStorageKey = 'voterServices.streetNames';
    let streetNames;
    try {
        streetNames = JSON.parse(sessionStorage.getItem(streetNamesSessionStorageKey) ?? '[]');
    }
    catch {
        streetNames = [];
    }
    function renderStreetNamesSelectElement() {
        const streetNamesSelectElement = document.querySelector('form select[name="streetName"]');
        if (streetNamesSelectElement !== null) {
            if (!Array.isArray(streetNames)) {
                return;
            }
            streetNamesSelectElement.innerHTML =
                '<option value="">(Select a Street Name)</option>';
            for (const streetName of streetNames) {
                const optionElement = document.createElement('option');
                optionElement.value = streetName;
                optionElement.textContent = streetName;
                streetNamesSelectElement.append(optionElement);
            }
        }
    }
    globalThis.window.voterServices = {
        urlPrefix: document.body.dataset.urlPrefix ?? '',
        debounce(functionToDebounce, delayMillis) {
            let timeout;
            return function (..._arguments) {
                const context = this;
                const later = function () {
                    timeout = undefined;
                    functionToDebounce.apply(context, _arguments);
                };
                globalThis.clearTimeout(timeout);
                timeout = setTimeout(later, delayMillis);
            };
        },
        async doLoadStreetNames(callback) {
            if (streetNames.length > 0) {
                renderStreetNamesSelectElement();
                if (callback !== undefined) {
                    callback();
                }
                return;
            }
            const response = await fetch(`${document.body.dataset.urlPrefix}/votersList/doGetAllStreetNames`);
            const streetNamesResponse = (await response.json());
            streetNames = streetNamesResponse.streetNames;
            sessionStorage.setItem(streetNamesSessionStorageKey, JSON.stringify(streetNames));
            renderStreetNamesSelectElement();
            if (callback !== undefined) {
                callback();
            }
        }
    };
})();
(() => {
    const parentIFrame = window.parent.document.querySelector('iframe#iframe--votersList');
    if (parentIFrame === null) {
        return;
    }
    globalThis.voterServices.resizeParentIFrame = function () {
        parentIFrame.style.height = `${document.body.scrollHeight}px`;
    };
    window.addEventListener('load', () => {
        globalThis.voterServices.resizeParentIFrame?.();
    });
    window.addEventListener('resize', () => {
        globalThis.voterServices.resizeParentIFrame?.();
    });
})();
{
    const formElements = document.querySelectorAll('form[action]');
    for (const formElement of formElements) {
        formElement.addEventListener('submit', () => {
            for (const submitButtonElement of formElement.querySelectorAll('button[type="submit"]')) {
                submitButtonElement.disabled = true;
                submitButtonElement.classList.add('is-loading');
            }
        });
    }
}
