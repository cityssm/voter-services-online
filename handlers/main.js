import configFunctions from '../helpers/config.helpers.js';
import packageJson from '../package.json' with { type: 'json' };
export const version = packageJson.version;
export default function handler(_request, response) {
    response.render('main', {
        buildNumber: version,
        configFunctions,
        urlPrefix: configFunctions.getConfigProperty('reverseProxy.urlPrefix')
    });
}
