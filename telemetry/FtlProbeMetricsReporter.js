/**
 * Netflix Cadmium Player — FTL Probe Metrics Reporter
 *
 * Reports First-Time-to-Load (FTL) probe error metrics to the Netflix
 * telemetry backend. Captures network timing information (DNS, TCP, TLS,
 * TTFB) from probe requests and logs them as structured events.
 *
 * @module telemetry/FtlProbeMetricsReporter
 * @original Module_76691
 */

import { __decorate, __param } from '../ads/AdBreakMismatchLogger.js'; // tslib decorators
import { injectable, injectDecorator } from '../ads/AdBreakMismatchLogger.js'; // DI framework
import { unitConversion as BYTES } from '../ase/ThroughputSample.js'; // byte unit
import { MILLISECONDS } from '../drm/LicenseBroker.js'; // millisecond unit
import { oq as MediaFactoryToken } from '../monitoring/MonitoringModule.js'; // media factory DI token
import { hG as EventLoggerToken } from '../monitoring/MonitoringModule.js'; // event logger DI token

/**
 * Reports FTL probe error metrics with detailed network timing breakdown.
 */
class FtlProbeMetricsReporter {
  /**
   * @param {object} mediaFactory - Media factory for logging blobs.
   * @param {object} eventLogger - Event logger for constructing structured events.
   */
  constructor(mediaFactory, eventLogger) {
    /** @private */
    this.mediaFactory = mediaFactory;
    /** @private */
    this.eventLogger = eventLogger;
  }

  /**
   * Report an FTL probe error event with network timing data.
   *
   * @param {object} probeResult - The probe result to report.
   * @param {string} probeResult.url - The probed URL.
   * @param {number} probeResult.status - HTTP status code.
   * @param {string} probeResult.pf_err - Platform error description.
   * @param {object} [probeResult.nodeModuleRef] - Network timing details (if available).
   */
  reportMetrics(probeResult) {
    const event = this.eventLogger.tu(
      'ftlProbeError',
      'info',
      FtlProbeMetricsReporter.buildMetricsPayload(
        { url: probeResult.url, sc: probeResult.status, pf_err: probeResult.pf_err },
        probeResult,
      ),
    );
    this.mediaFactory.logblob(event);
  }

  /**
   * Build the metrics payload by appending network timing fields.
   *
   * @param {object} payload - Base payload with url, status code, and error.
   * @param {object} probeResult - Full probe result with optional timing data.
   * @returns {object} Enriched payload with timing fields.
   * @static
   */
  static buildMetricsPayload(payload, probeResult) {
    if (probeResult.nodeModuleRef) {
      const timing = probeResult.nodeModuleRef;
      FtlProbeMetricsReporter.setTimingField(payload, 'd', timing.duration);
      FtlProbeMetricsReporter.setTimingField(payload, 'dns', timing.internal_Oxb);
      FtlProbeMetricsReporter.setTimingField(payload, 'tcp', timing.e7a);
      FtlProbeMetricsReporter.setTimingField(payload, 'tls', timing.x7a);
      FtlProbeMetricsReporter.setTimingField(payload, 'ttfb', timing.q7a);
      FtlProbeMetricsReporter.setTimingField(payload, 'client_send_ts', timing.qQb);
      FtlProbeMetricsReporter.setTimingField(payload, 'client_recv_ts', timing.FQb);
      payload.sz = timing.size.toUnit(BYTES);
    }
    return payload;
  }

  /**
   * Set a timing field on the payload, converting to milliseconds.
   * Only sets the field if the timing value is defined.
   *
   * @param {object} payload - Target payload object.
   * @param {string} key - Field name.
   * @param {object} [timingValue] - Duration object with toUnit() method.
   * @static
   */
  static setTimingField(payload, key, timingValue) {
    if (timingValue) {
      payload[key] = timingValue.toUnit(MILLISECONDS);
    }
  }
}

export { FtlProbeMetricsReporter };

// Apply DI decorators
const DecoratedFtlProbeMetricsReporter = __decorate(
  [
    injectable(),
    __param(0, injectDecorator(MediaFactoryToken)),
    __param(1, injectDecorator(EventLoggerToken)),
  ],
  FtlProbeMetricsReporter,
);

export { DecoratedFtlProbeMetricsReporter };
