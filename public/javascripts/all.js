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
    globalThis.voterServices = {
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
            await fetch(`${document.body.dataset.urlPrefix}/votersList/doGetAllStreetNames`)
                .then(async (response) => (await response.json()))
                .then((streetNamesResponse) => {
                streetNames = streetNamesResponse.streetNames;
                sessionStorage.setItem(streetNamesSessionStorageKey, JSON.stringify(streetNames));
                renderStreetNamesSelectElement();
            })
                .finally(() => {
                if (callback !== undefined) {
                    callback();
                }
            });
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
