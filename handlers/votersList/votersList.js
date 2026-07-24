import configFunctions from '../../helpers/config.helpers.js';
export default function handler(_request, response) {
    response.render('votersListCheck', {
        configFunctions,
        urlPrefix: configFunctions.getConfigProperty('reverseProxy.urlPrefix')
    });
}
