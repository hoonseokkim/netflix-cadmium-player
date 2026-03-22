/**
 * Network Client Wrapper
 *
 * Injectable wrapper around a network client that provides request(),
 * start(), disconnect(), and connection status (iua) functionality.
 * Manages logging configuration for the laser log sink.
 *
 * Also exports default queue configuration limits for different
 * network message types (logblob, events, manifest, license, etc.).
 *
 * @module NetworkClientWrapper
 * @source Module_70885
 */
export default function NetworkClientWrapper(module, exports, require) {
    var tslib, inversify, GlobalRegistryModule;

    function NetworkClientWrapperClass() {}

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MKa = exports.internal_Dnb = void 0;

    tslib = require(22970);
    inversify = require(22674);
    GlobalRegistryModule = require(57349);

    /**
     * Default queue configuration for each network message type.
     * Controls maximum payload size (bytes) and queue depth.
     */
    exports.internal_Dnb = {
        logblob: {
            maxLengthBytes: 204800,   // 200 KB
            maxInQueue: 4
        },
        events: {
            maxInQueue: undefined      // unlimited
        },
        manifest: {
            maxInQueue: undefined
        },
        license: {
            maxInQueue: undefined
        },
        ntlBatch: {
            maxLengthBytes: 204800,   // 200 KB
            maxInQueue: 4
        },
        ntlSendImmediate: {
            maxInQueue: undefined
        },
        laser: {
            maxInQueue: undefined
        },
        laserNtl: {
            maxInQueue: undefined
        }
    };

    /**
     * Initializes the wrapper with a network client and config.
     * Registers the laser log sink globally.
     *
     * @param {Object} client - The underlying network client
     * @param {Object} config - Configuration object
     */
    NetworkClientWrapperClass.prototype.data = function initialize(client, config) {
        var self = this;
        this.client = client;
        this.config = config;
        GlobalRegistryModule.k_.QRc("laserLogSink", function () {
            return self.client.A1a;
        });
    };

    /**
     * Sends a network request through the wrapped client.
     * @param {Object} requestData - The request to send
     * @returns {*} Response from the client
     */
    NetworkClientWrapperClass.prototype.request = function (requestData) {
        return this.client.request(requestData);
    };

    /**
     * Starts the network client.
     */
    NetworkClientWrapperClass.prototype.start = function () {
        this.client.start();
    };

    /**
     * Disconnects the network client.
     */
    NetworkClientWrapperClass.prototype.disconnect = function () {
        this.client.disconnect();
    };

    Ha.Object.defineProperties(NetworkClientWrapperClass.prototype, {
        iua: {
            configurable: true,
            enumerable: true,
            key: function () {
                var client;
                return !(null === (client = this.client) || undefined === client || !client.iua);
            }
        }
    });

    var ExportedClass = NetworkClientWrapperClass;
    exports.MKa = ExportedClass;
    exports.MKa = ExportedClass = tslib.__decorate([
        (0, inversify.injectable)()
    ], ExportedClass);
}
