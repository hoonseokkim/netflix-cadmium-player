/**
 * @module DrmSessionDependencies
 * @description Injectable dependency container for DRM session management.
 * Aggregates all services needed by a DRM session: EME session handler,
 * HTTP transport, version info, key system operations, license broker,
 * security configuration, and diagnostic reporting.
 * @see Module_54949
 */

import { __decorate, __param } from '../core/tslib.js';
import { injectable, inject as injectDecorator } from '../core/inversify.js';
import { jja as EmeSessionToken } from '../drm/EmeSession.js';
import { nativeProcessor as VersionToken } from '../core/VersionInfo.js';
import { KeySystemOpsToken as KeySystemOpsToken } from '../drm/KeySystemOps.js';
import { gG as LicenseBrokerToken } from '../drm/LicenseBroker.js';
import { HttpToken } from '../network/HttpTransport.js';
import { jnb as SecurityConfigToken } from '../drm/SecurityConfig.js';
import { DiagReporterToken as DiagReporterToken } from '../drm/DiagReporter.js';
import { $ib as DrmPolicyToken } from '../drm/DrmPolicy.js';
import { QC as DrmContextToken } from '../drm/DrmContext.js';

/**
 * Holds all injected dependencies required for DRM session operations.
 * Passed into DRM session constructors to avoid excessive parameter lists.
 */
@injectable()
export class DrmSessionDependencies {
    /**
     * @param {Object} emeSession - EME (Encrypted Media Extensions) session handler.
     * @param {Object} httpTransport - HTTP transport for license requests.
     * @param {Object} versionInfo - Player version information.
     * @param {Object} keySystemOps - Key system operations (generateRequest, update, close).
     * @param {Object} licenseBroker - License acquisition broker.
     * @param {Object} securityConfig - Security/DRM configuration.
     * @param {Object} diagReporter - Diagnostic event reporter.
     * @param {Object} drmPolicy - DRM policy enforcement.
     * @param {Object} drmContext - DRM context/state.
     */
    constructor(emeSession, httpTransport, versionInfo, keySystemOps, licenseBroker,
                securityConfig, diagReporter, drmPolicy, drmContext) {
        /** @type {Object} EME session handler. */
        this.emeSession = emeSession;
        /** @type {Object} HTTP transport for license server communication. */
        this.httpTransport = httpTransport;
        /** @type {Object} Player version info. */
        this.versionInfo = versionInfo;
        /** @type {Object} Key system operations interface. */
        this.keySystemOps = keySystemOps;
        /** @type {Object} License acquisition broker. */
        this.licenseBroker = licenseBroker;
        /** @type {Object} Security configuration. */
        this.securityConfig = securityConfig;
        /** @type {Object} Diagnostic reporter. */
        this.diagReporter = diagReporter;
        /** @type {Object} DRM policy manager. */
        this.drmPolicy = drmPolicy;
        /** @type {Object} DRM context/state. */
        this.drmContext = drmContext;
    }
}
