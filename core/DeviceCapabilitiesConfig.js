/**
 * @module DeviceCapabilitiesConfig
 * @description Configuration for device capabilities detection, including supported
 * audio/video profiles and detector types. Used during player initialization
 * to determine what the current device can play.
 *
 * @original Module 1079
 */

import { AudioCapabilityDetectorType, VideoCapabilityDetectorType } from '../core/CapabilityDetectorTypes.js';

/**
 * Default configuration for device capabilities detection.
 *
 * @class DeviceCapabilitiesConfig
 */
export class DeviceCapabilitiesConfig {
    constructor() {
        /** @type {Array} DRM system identifiers */
        this.drmSystemIds = [];

        /** @type {Array} Supported video codec profiles */
        this.supportedVideoProfiles = [];

        /** @type {Array} Supported audio codec profiles */
        this.supportedAudioProfiles = [];

        /** @type {Array} Additional capability requirements */
        this.additionalCapabilities = [];

        /** @type {string} Type of audio capability detector to use */
        this.audioCapabilityDetectorType = AudioCapabilityDetectorType.Default;

        /** @type {string} Type of video capability detector to use */
        this.videoCapabilityDetectorType = VideoCapabilityDetectorType.Default;
    }
}

/**
 * DI token for the DeviceCapabilitiesConfig service.
 * @type {string}
 */
export const DeviceCapabilitiesConfigSymbol = "DeviceCapabilitiesConfigSymbol";
