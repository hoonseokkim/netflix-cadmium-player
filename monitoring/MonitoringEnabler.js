/**
 * @module MonitoringEnabler
 * @description Conditionally enables the monitoring/instrumentation system.
 * Only activates monitoring when the debug flag is set.
 *
 * @original Module 10787
 */

import { DEBUG } from '../utils/DebugFlags.js';
import { enable as enableMonitoring } from '../monitoring/MonitoringCore.js';

/**
 * Enables the monitoring subsystem if debug mode is active.
 * This is typically called during player initialization to conditionally
 * activate performance monitoring and diagnostics.
 */
export function enableIfDebug() {
    if (DEBUG) {
        enableMonitoring();
    }
}
