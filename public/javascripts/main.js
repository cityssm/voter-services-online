(() => {
    const addressSearchFieldElement = document.querySelector('#addressSearch--civicAddress');
    const addressSearchResultsElement = document.querySelector('#container--addressSearchResults');
    const addressDetailsElement = document.querySelector('#container--addressDetails');
    const votingLocationsElement = document.querySelector('#container--votingLocations');
    const candidatesElement = document.querySelector('#container--candidates');
    function renderVotingLocations(votingLocations) {
        if (votingLocationsElement === null) {
            return;
        }
        if (votingLocations.length === 0) {
            votingLocationsElement.innerHTML = `
        <div class="notification is-warning is-light">
          <strong>There are no voting locations available.</strong>
        </div>
      `;
        }
        else {
            let hasElectionDayPolls = false;
            const electionDayPanelElement = document.createElement('div');
            electionDayPanelElement.className = 'panel';
            electionDayPanelElement.innerHTML = `
        <p class="panel-heading">
          Election Day
        </p>
      `;
            let hasAdvancePolls = false;
            const advancePollPanelElement = document.createElement('div');
            advancePollPanelElement.className = 'panel';
            advancePollPanelElement.innerHTML = `
        <p class="panel-heading">
          Advance Polls
        </p>
      `;
            for (const votingLocation of votingLocations) {
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.innerHTML = `
          <div class="columns is-mobile">
            <div class="column">
              <span class="field--dateOpenStringLocal"></span><br />
              <span class="field--startTime"></span> to <span class="field--endTime"></span>
            </div>
            <div class="column">
              <div class="field--locationName has-text-weight-semibold"></div>
              <div class="field--address1"></div>
              <div class="field--address2"></div>
            </div>
          </div>
        `;
                panelBlockElement.querySelector('.field--dateOpenStringLocal').textContent = votingLocation.DateOpenStringLocal;
                panelBlockElement.querySelector('.field--startTime').textContent = votingLocation.StartTime;
                panelBlockElement.querySelector('.field--endTime').textContent = votingLocation.EndTime;
                if (votingLocation.MapLink === '') {
                    ;
                    panelBlockElement.querySelector('.field--locationName').textContent = votingLocation.LocationName;
                }
                else {
                    const locationLinkElement = document.createElement('a');
                    locationLinkElement.href = votingLocation.MapLink;
                    locationLinkElement.target = '_blank';
                    locationLinkElement.rel = 'noopener noreferrer';
                    locationLinkElement.textContent = votingLocation.LocationName;
                    panelBlockElement.querySelector('.field--locationName').replaceChildren(locationLinkElement);
                }
                ;
                panelBlockElement.querySelector('.field--address1').textContent = votingLocation.Address1;
                panelBlockElement.querySelector('.field--address2').textContent = votingLocation.Address2;
                if (votingLocation.IsAdvancePoll) {
                    hasAdvancePolls = true;
                    advancePollPanelElement.append(panelBlockElement);
                }
                else {
                    hasElectionDayPolls = true;
                    electionDayPanelElement.append(panelBlockElement);
                }
            }
            votingLocationsElement.replaceChildren();
            if (hasElectionDayPolls) {
                votingLocationsElement.append(electionDayPanelElement);
            }
            if (hasAdvancePolls) {
                votingLocationsElement.append(advancePollPanelElement);
            }
        }
    }
    function renderCandidates(positions) {
        if (candidatesElement === null) {
            return;
        }
        if (positions.length === 0) {
            candidatesElement.innerHTML = `
        <div class="notification is-warning is-light">
          <strong>There are no candidates available.</strong>
        </div>
      `;
        }
        else {
            candidatesElement.replaceChildren();
            for (const position of positions) {
                if (position.Candidates.length === 0) {
                    continue;
                }
                const positionElement = document.createElement('div');
                positionElement.className = 'panel';
                positionElement.innerHTML = `
          <div class="panel-heading">
            <div class="columns is-mobile">
              <div class="column">
                <span class="field--positionName"></span>
              </div>
              <div class="column is-narrow has-text-right">
                <div class="tags has-addons">
                  <span class="tag is-dark">Positions Available</span>
                  <span class="tag field--numberPositions"></span>
                </div>
              </div>
            </div>
          </div>
        `;
                positionElement.querySelector('.field--positionName').textContent = position.PositionName;
                positionElement.querySelector('.field--numberPositions').textContent = position.NumberPositions.toString();
                for (const candidate of position.Candidates) {
                    const panelBlockElement = document.createElement('div');
                    panelBlockElement.className = 'panel-block is-block';
                    panelBlockElement.innerHTML = `
            <div class="columns is-mobile">
              <div class="column">
                <span class="field--candidateName"></span>
              </div>
              <div class="column is-narrow has-text-right">
                ${candidate.IsAcclaimed
                        ? '<span class="tag is-success">Acclaimed</span>'
                        : ''}
              </div>
            </div>
          `;
                    panelBlockElement.querySelector('.field--candidateName').textContent = candidate.CandidateName;
                    positionElement.append(panelBlockElement);
                }
                candidatesElement.append(positionElement);
            }
        }
    }
    async function doDisplayAddress(address) {
        if (addressDetailsElement === null ||
            votingLocationsElement === null ||
            candidatesElement === null) {
            return;
        }
        ;
        addressDetailsElement.querySelector('#addressDetails--address').textContent = address.Address;
        addressDetailsElement.querySelector('#addressDetails--ward').textContent = address.Ward;
        addressDetailsElement.querySelector('#addressDetails--pollAndSuffix').textContent = address.PollAndSuffix;
        votingLocationsElement.innerHTML = `
      <p class="has-text-centered has-text-grey">
        <i class="fa-solid fa-4x fa-spinner fa-spin"></i><br />
        <br />
        <strong>Loading voting locations...</strong>
      </p>
    `;
        candidatesElement.innerHTML = `
      <p class="has-text-centered has-text-grey">
        <i class="fa-solid fa-4x fa-spinner fa-spin"></i><br />
        <br />
        <strong>Loading candidates...</strong>
      </p>
    `;
        addressDetailsElement.classList.remove('is-hidden');
        const urlParameters = new URLSearchParams({
            ward: address.Ward,
            streetName: address.StreetNameFull,
            streetNumber: address.StreetNumber
        });
        await fetch(`${voterServices.urlPrefix}/doGetAddressDetails?${urlParameters.toString()}`)
            .then(async (response) => (await response.json()))
            .then((addressDetails) => {
            renderVotingLocations(addressDetails.votingLocations);
            renderCandidates(addressDetails.positions);
        });
    }
    async function doAddressSearch() {
        if (addressSearchResultsElement === null) {
            return;
        }
        const civicAddress = addressSearchFieldElement.value;
        if (!/^\d/.test(civicAddress)) {
            addressSearchResultsElement.innerHTML = `
        <div class="notification is-info is-light">
          To get started, enter a civic address in the field above.<br />
          <em>i.e. 123 Main Street</em>
        </div>
      `;
            return;
        }
        await fetch(`${voterServices.urlPrefix}/doGetAddresses?civicAddress=${encodeURIComponent(civicAddress)}`)
            .then(async (response) => (await response.json()))
            .then((addressSearchResults) => {
            if (addressSearchResults.addresses.length === 0) {
                addressSearchResultsElement.innerHTML = `
            <div class="notification is-warning is-light">
              <strong>There are no addresses available.</strong><br />
              Be sure to use a complete civic address, with the civic number first.
            </div>
          `;
                return;
            }
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            for (const [addressIndex, address] of addressSearchResults.addresses.entries()) {
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.addressIndex = addressIndex.toString();
                panelBlockElement.href = '#';
                panelBlockElement.addEventListener('click', (clickEvent) => {
                    clickEvent.preventDefault();
                    addressSearchFieldElement.value = address.Address;
                    addressSearchResultsElement.classList.add('is-hidden');
                    for (const possiblePanelBlockElement of addressSearchResultsElement.querySelectorAll('.panel-block')) {
                        if (possiblePanelBlockElement.dataset.addressIndex !==
                            panelBlockElement.dataset.addressIndex) {
                            possiblePanelBlockElement.classList.add('is-hidden');
                            possiblePanelBlockElement.classList.remove('is-block');
                        }
                    }
                    void doDisplayAddress(address);
                });
                panelBlockElement.innerHTML = `
            <div class="columns is-mobile">
              <div class="column field--address"></div>
              <div class="column is-narrow has-text-right">
                Ward <span class="field--ward"></span><br />
                Poll <span class="field--pollAndSuffix"></span>
              </div>
            </div>
          `;
                panelBlockElement.querySelector('.field--address').textContent = address.Address;
                panelBlockElement.querySelector('.field--ward').textContent = address.Ward;
                panelBlockElement.querySelector('.field--pollAndSuffix').textContent = address.PollAndSuffix;
                panelElement.append(panelBlockElement);
            }
            addressSearchResultsElement.replaceChildren(panelElement);
        });
    }
    document
        .querySelector('#form--addressSearch')
        ?.addEventListener('submit', (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
    });
    document
        .querySelector('#form--addressSearch')
        ?.addEventListener('reset', (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        addressSearchFieldElement.value = '';
        addressSearchFieldElement.focus();
        void doAddressSearch();
    });
    const debouncedAddressSearch = voterServices.debounce(() => {
        void doAddressSearch();
    }, 200);
    addressSearchFieldElement.addEventListener('focus', () => {
        addressSearchResultsElement?.classList.remove('is-hidden');
    });
    addressSearchFieldElement.addEventListener('input', debouncedAddressSearch);
    void doAddressSearch();
})();
(() => {
    const votersListModalElement = document.querySelector('#modal--votersList');
    document
        .querySelector('#button--votersList')
        ?.addEventListener('click', () => {
        votersListModalElement
            ?.querySelector('iframe')
            ?.setAttribute('src', 'about:blank');
        votersListModalElement?.classList.add('is-active');
        document.documentElement.classList.add('is-clipped');
        votersListModalElement
            ?.querySelector('iframe')
            ?.setAttribute('src', 'votersList');
    });
    function closeModal(clickEvent) {
        clickEvent.preventDefault();
        clickEvent.currentTarget
            .closest('.modal')
            ?.classList.remove('is-active');
        document.documentElement.classList.remove('is-clipped');
        votersListModalElement
            ?.querySelector('iframe')
            ?.setAttribute('src', 'about:blank');
    }
    for (const closeButtonElement of document.querySelectorAll('.modal-close-button')) {
        closeButtonElement.addEventListener('click', closeModal);
    }
})();
