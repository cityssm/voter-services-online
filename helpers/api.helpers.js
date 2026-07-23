import { VoterViewApi } from '@cityssm/voterview-api';
import { getConfigProperty } from './config.helpers.js';
export const voterViewApi = new VoterViewApi(getConfigProperty('voterViewApi.countyMunicipalityCode'), getConfigProperty('voterViewApi.username'), getConfigProperty('voterViewApi.password'), getConfigProperty('voterViewApi.useTrainingDatabase'));
