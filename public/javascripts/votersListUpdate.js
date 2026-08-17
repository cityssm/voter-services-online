(() => {
    function initializePreferredContactMethodToggle(elementIdPrefix) {
        const preferredContactMethodSelectElement = document.querySelector(`#${elementIdPrefix}--preferredContactMethod`);
        preferredContactMethodSelectElement?.addEventListener('change', () => {
            const phoneNumberInputElement = document.querySelector(`#${elementIdPrefix}--phoneNumber`);
            if (preferredContactMethodSelectElement.value === 'Phone') {
                phoneNumberInputElement?.setAttribute('required', 'true');
            }
            else {
                phoneNumberInputElement?.removeAttribute('required');
            }
        });
    }
    function toggleProvinceInput(elementIdPrefix) {
        const countrySelectElement = document.querySelector(`#${elementIdPrefix}--mailingCountry`);
        const provinceCanadaSelectElement = document.querySelector(`#${elementIdPrefix}--mailingProvinceCanada`);
        const provinceOtherInputElement = document.querySelector(`#${elementIdPrefix}--mailingProvinceOther`);
        const postalCodeInputElement = document.querySelector(`#${elementIdPrefix}--mailingPostalCode`);
        if (countrySelectElement === null ||
            provinceCanadaSelectElement === null ||
            provinceOtherInputElement === null ||
            postalCodeInputElement === null) {
            return;
        }
        const isCanada = countrySelectElement.selectedOptions[0].dataset.isCanada === 'true';
        if (isCanada) {
            provinceCanadaSelectElement.removeAttribute('disabled');
            provinceCanadaSelectElement
                .closest('.field')
                ?.classList.remove('is-hidden');
            provinceOtherInputElement.setAttribute('disabled', 'true');
            provinceOtherInputElement.closest('.field')?.classList.add('is-hidden');
        }
        else {
            provinceCanadaSelectElement.setAttribute('disabled', 'true');
            provinceCanadaSelectElement.closest('.field')?.classList.add('is-hidden');
            provinceOtherInputElement.removeAttribute('disabled');
            provinceOtherInputElement.closest('.field')?.classList.remove('is-hidden');
        }
        const postalCodePattern = countrySelectElement.selectedOptions[0].dataset.postalCodePattern ?? '';
        if (postalCodePattern === '') {
            postalCodeInputElement.removeAttribute('pattern');
        }
        else {
            postalCodeInputElement.setAttribute('pattern', postalCodePattern);
        }
    }
    function initializeProvinceToggle(elementIdPrefix) {
        document
            .querySelector(`#${elementIdPrefix}--mailingCountry`)
            ?.addEventListener('change', () => {
            toggleProvinceInput(elementIdPrefix);
        });
    }
    function initializeUploadElement(elementIdPrefix) {
        const uploadIDFileInputElement = document.querySelector(`#${elementIdPrefix}--uploadID`);
        uploadIDFileInputElement?.addEventListener('change', () => {
            const uploadIDFileNameElement = document.querySelector(`#${elementIdPrefix}--uploadIDFileName`);
            if (uploadIDFileNameElement !== null &&
                uploadIDFileInputElement.files?.length === 1) {
                const fileSizeInBytes = uploadIDFileInputElement.files[0].size;
                if (fileSizeInBytes > 10 * 1024 * 1024) {
                    bulmaJS.alert({
                        message: 'The file you selected is too large. Please select a file that is less than 10 MB in size.',
                        contextualColorName: 'danger',
                        okButton: {
                            text: 'OK',
                            callbackFunction: () => {
                                uploadIDFileInputElement.focus();
                            }
                        }
                    });
                    uploadIDFileInputElement.value = '';
                    uploadIDFileNameElement.textContent = '';
                    return;
                }
                uploadIDFileNameElement.textContent =
                    uploadIDFileInputElement.files[0].name;
            }
        });
    }
    function initializeCommonFormElements(elementIdPrefix) {
        initializePreferredContactMethodToggle(elementIdPrefix);
        initializeProvinceToggle(elementIdPrefix);
        initializeUploadElement(elementIdPrefix);
    }
    document
        .querySelector('.is-show-form-button')
        ?.addEventListener('click', () => {
        document
            .querySelector('#tabContainer--result')
            ?.classList.add('is-hidden');
        document
            .querySelector('#tabContainer--form')
            ?.classList.remove('is-hidden');
        voterServices.resizeParentIFrame?.();
    });
    document
        .querySelector('.is-show-vote-by-mail-button')
        ?.addEventListener('click', () => {
        document
            .querySelector('#tabContainer--result')
            ?.classList.add('is-hidden');
        document
            .querySelector('#tabContainer--voteByMail')
            ?.classList.remove('is-hidden');
        voterServices.resizeParentIFrame?.();
    });
    async function doLoadVoterDetailLists() {
        await fetch(`${voterServices.urlPrefix}/votersList/doGetVoterDetailLists`)
            .then(async (response) => (await response.json()))
            .then((voterDetailListsResponse) => {
            const residencyStatusSelectElement = document.querySelector('#votersListUpdate--residencyStatus');
            const occupancyStatusSelectElement = document.querySelector('#votersListUpdate--occupancyStatus');
            const religionCodeSelectElement = document.querySelector('#votersListUpdate--religion');
            const schoolSupportCodeSelectElement = document.querySelector('#votersListUpdate--schoolSupport');
            const frenchLanguageRightsSelectElement = document.querySelector('#votersListUpdate--frenchLanguageRights');
            if (residencyStatusSelectElement !== null) {
                for (const residencyStatus of voterDetailListsResponse.residencyStatuses) {
                    const optionElement = document.createElement('option');
                    optionElement.value = residencyStatus.ResidencyStatusCode;
                    optionElement.textContent =
                        residencyStatus.ResidencyStatusDescription === ''
                            ? '(Select a Status)'
                            : residencyStatus.ResidencyStatusDescription;
                    if (residencyStatus.ResidencyStatusCode ===
                        residencyStatusSelectElement.dataset.defaultValue) {
                        optionElement.selected = true;
                    }
                    residencyStatusSelectElement.append(optionElement);
                }
            }
            if (occupancyStatusSelectElement !== null) {
                for (const occupancyStatus of voterDetailListsResponse.occupancyStatuses) {
                    const optionElement = document.createElement('option');
                    optionElement.value = occupancyStatus.OccupancyStatusCode;
                    optionElement.textContent =
                        occupancyStatus.OccupancyStatusDescription === ''
                            ? '(Select a Status)'
                            : occupancyStatus.OccupancyStatusDescription;
                    if (occupancyStatus.OccupancyStatusCode ===
                        occupancyStatusSelectElement.dataset.defaultValue) {
                        optionElement.selected = true;
                    }
                    occupancyStatusSelectElement.append(optionElement);
                }
            }
            if (religionCodeSelectElement !== null) {
                for (const religionCode of voterDetailListsResponse.religionCodes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = religionCode.ReligionCode;
                    optionElement.textContent =
                        religionCode.ReligionDescription === ''
                            ? '(Select a Status)'
                            : religionCode.ReligionDescription;
                    if (religionCode.ReligionCode ===
                        religionCodeSelectElement.dataset.defaultValue) {
                        optionElement.selected = true;
                    }
                    religionCodeSelectElement.append(optionElement);
                }
            }
            if (schoolSupportCodeSelectElement !== null) {
                for (const schoolSupportCode of voterDetailListsResponse.schoolSupportCodes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = schoolSupportCode.SchoolSupportCode;
                    optionElement.textContent =
                        schoolSupportCode.SchoolSupportDescription;
                    if (schoolSupportCode.SchoolSupportCode ===
                        schoolSupportCodeSelectElement.dataset.defaultValue) {
                        optionElement.selected = true;
                    }
                    schoolSupportCodeSelectElement.append(optionElement);
                }
            }
            if (frenchLanguageRightsSelectElement !== null) {
                for (const frenchLanguageRights of voterDetailListsResponse.frenchRightsCodes) {
                    const optionElement = document.createElement('option');
                    optionElement.value = frenchLanguageRights.FrenchLanguageRightsCode;
                    optionElement.textContent =
                        frenchLanguageRights.FrenchLanguageRightsDescription === ''
                            ? '(Select a Status)'
                            : frenchLanguageRights.FrenchLanguageRightsDescription;
                    if (frenchLanguageRights.FrenchLanguageRightsCode ===
                        frenchLanguageRightsSelectElement.dataset.defaultValue) {
                        optionElement.selected = true;
                    }
                    frenchLanguageRightsSelectElement.append(optionElement);
                }
            }
        });
    }
    void doLoadVoterDetailLists();
    void voterServices.doLoadStreetNames(() => {
        const streetNameSelectElement = document.querySelector('#votersListUpdate--streetName');
        if (streetNameSelectElement !== null) {
            const defaultStreetName = streetNameSelectElement.dataset.defaultValue;
            if (defaultStreetName !== undefined) {
                const optionElement = streetNameSelectElement.querySelector(`option[value="${CSS.escape(defaultStreetName)}"]`);
                if (optionElement !== null) {
                    optionElement.selected = true;
                }
            }
        }
    });
    document
        .querySelector('#votersListUpdate--copyResidentialAddress')
        ?.addEventListener('click', () => {
        const residentialStreetNumberInputElement = document.querySelector('#votersListUpdate--streetNumber');
        const residentialStreetNumberSuffixInputElement = document.querySelector('#votersListUpdate--streetNumberSuffix');
        const residentialStreetNameSelectElement = document.querySelector('#votersListUpdate--streetName');
        const residentialUnitNumberInputElement = document.querySelector('#votersListUpdate--unitNumber');
        const address1InputElement = document.querySelector('#votersListUpdate--mailingAddress1');
        let address = residentialStreetNumberInputElement.value;
        if (residentialStreetNumberSuffixInputElement.value !== '') {
            address += ` ${residentialStreetNumberSuffixInputElement.value}`;
        }
        if (residentialStreetNameSelectElement.selectedOptions[0].value !== '') {
            address += ` ${residentialStreetNameSelectElement.selectedOptions[0].textContent}`;
        }
        if (residentialUnitNumberInputElement.value !== '') {
            address += `, UNIT ${residentialUnitNumberInputElement.value}`;
        }
        address1InputElement.value = address;
        const mailingCityInputElement = document.querySelector('#votersListUpdate--mailingCity');
        mailingCityInputElement.value =
            mailingCityInputElement.dataset.configValue ?? '';
        const mailingCountrySelectElement = document.querySelector('#votersListUpdate--mailingCountry');
        mailingCountrySelectElement.value =
            mailingCountrySelectElement.querySelector('option[data-is-canada="true"]')?.value ?? '';
        toggleProvinceInput('votersListUpdate');
        const mailingProvinceCanadaSelectElement = document.querySelector('#votersListUpdate--mailingProvinceCanada');
        mailingProvinceCanadaSelectElement.value =
            mailingProvinceCanadaSelectElement.dataset.configValue ?? '';
    });
    initializeCommonFormElements('votersListUpdate');
    if (document.querySelector('#form--voteByMailUpdate') !== null) {
        initializeCommonFormElements('voteByMailUpdate');
    }
})();
