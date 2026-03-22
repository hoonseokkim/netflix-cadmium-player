/**
 * Open Connect Side Channel Manager
 *
 * Manages side-channel HTTP requests to Netflix Open Connect CDN
 * appliances. Provides methods to initiate and abort side-channel
 * requests, which are used for auxiliary data transfers outside the
 * main media streaming path (e.g. pre-warming connections, health
 * checks, or telemetry).
 *
 * @module OpenConnectSideChannelManager
 * @source Module_76457
 */

import { __decorate, __param } from '../core/ReflectMetadataPolyfill';
import { injectable, injectDecorator } from '../ioc/ComponentDependencyResolver';
import { LoggerToken } from '../monitoring/Logger';
import { HttpToken } from '../network/HttpRequestWrapper';

class OpenConnectSideChannelManager {
    /**
     * @param {Object} logger       - Logger factory (provides createSubLogger).
     * @param {Object} httpService   - HTTP request service.
     */
    constructor(logger, httpService) {
        this.httpService = httpService;
        this.log = logger.createSubLogger("OpenConnectSideChannel");
    }

    /**
     * Initiate a side-channel request.
     *
     * @param {Object} request    - Request descriptor with `url` and `abortFunction` properties.
     * @param {*}      _unused    - (unused parameter)
     * @param {*}      requestData - Additional request data / payload.
     */
    internal_Pra(request, _unused, requestData) {
        const options = {
            url: request.url,
            dWc: requestData
        };
        request.abortFunction = this.httpService.XYc(options);
    }

    /**
     * Abort a previously initiated side-channel request.
     *
     * @param {Object} request - Request descriptor whose abortFunction to call.
     */
    abort(request) {
        try {
            request.abortFunction();
        } catch (error) {
            this.log.RETRY("exception aborting request");
        }
    }
}

export { OpenConnectSideChannelManager as RestartManager };

// IoC registration
OpenConnectSideChannelManager = __decorate([
    injectable(),
    __param(0, injectDecorator(LoggerToken)),
    __param(1, injectDecorator(HttpToken))
], OpenConnectSideChannelManager);
