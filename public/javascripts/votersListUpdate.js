(() => {
    async function doLoadVoterDetailLists() {
        await fetch('doGetVoterDetailLists')
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
                        residencyStatus.ResidencyStatusDescription;
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
                        occupancyStatus.OccupancyStatusDescription;
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
                    optionElement.textContent = religionCode.ReligionDescription;
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
                        frenchLanguageRights.FrenchLanguageRightsDescription;
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
    document
        .querySelector('.is-show-form-button')
        ?.addEventListener('click', () => {
        document
            .querySelector('#tabContainer--result')
            ?.classList.add('is-hidden');
        document
            .querySelector('#tabContainer--form')
            ?.classList.remove('is-hidden');
        voterServices.resizeParentIFrame();
    });
})();
