/**
 * Netflix Cadmium Player - Generate Screenshots Command
 * Deobfuscated from Module_82306
 *
 * API command for requesting screenshot generation from the Netflix backend.
 * Uses dependency injection (inversify) and extends the base API command class.
 * Sends requests to the /generateScreenshots endpoint.
 */

import { __extends, __decorate, __param } from '../core/tslib';
import { injectable, inject as injectDecorator } from '../ioc/inversify';
import { ApiCommandType } from '../network/ApiCommandTypes';
import { HttpMethod } from '../network/HttpRequestEnums';
import { BaseApiCommand } from '../network/BaseApiCommand';
import { httpServiceToken } from '../network/HttpServiceTokens';

/**
 * Command that requests screenshot generation for a given manifest.
 * Extends BaseApiCommand for standard API request handling.
 */
function GenerateScreenshotsCommand(httpService) {
    return BaseApiCommand.call(this, httpService, ApiCommandType.GENERATE_SCREENSHOTS) || this;
}

__extends(GenerateScreenshotsCommand, BaseApiCommand);

/**
 * Executes the generate screenshots request.
 *
 * @param {Object} manifest - The manifest object containing links
 * @param {Object} requestConfig - Additional request configuration
 * @returns {Promise<Object>} The screenshot generation result
 */
GenerateScreenshotsCommand.prototype.execute = function (manifest, requestConfig) {
    const self = this;

    const requestParams = {
        url: (manifest.links
            ? manifest.links.getLink("generateScreenshots").toString
            : undefined) || "/generateScreenshots",
        name: HttpMethod.manifestRef,
        callMode: "generateScreenshots",
        callModeFlag: 2
    };

    return this.send(manifest, requestParams, requestConfig)
        .then(function (response) {
            return response.result;
        })
        .catch(function (error) {
            throw self.errorWrapper(error);
        });
};

let GenerateScreenshotsCommandExport = GenerateScreenshotsCommand;
export { GenerateScreenshotsCommandExport as GenerateScreenshotsCommand };

// Apply dependency injection decorators
GenerateScreenshotsCommandExport = __decorate([
    injectable(),
    __param(0, injectDecorator(httpServiceToken))
], GenerateScreenshotsCommandExport);
