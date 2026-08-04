export const config = {
    application: {
        httpPort: 8080,
        applicationName: 'Sample City Voter Services'
    },
    reverseProxy: {},
    voterViewApi: {
        countyMunicipalityCode: '9999',
        username: 'SAMPLE',
        password: 'samplePass',
        useTrainingDatabase: true
    },
    settings: {
        city: 'Sample City',
        province: 'ON'
    }
};
export default config;
