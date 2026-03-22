/**
 * Startup Logblob Builder
 *
 * Builds and sends a startup telemetry logblob when the player initializes.
 * Collects browser info, performance timing data, feature experiment serial
 * numbers (fesn), and module load metrics, then dispatches the blob via
 * the log-blob batcher infrastructure.
 *
 * @module StartupLogblobBuilder
 * @source Module_93114
 */

import { getOdbMetrics } from '../core/AppInfoConfig';
import { SUCCESS } from '../core/PlayerConstants';
import { config } from '../config/PlayerConfiguration';
import { playbackInstanceHolder } from '../core/PlaybackInstance';
import { internal_Shc as getNavigationStartTime } from '../core/FtlComponentInit';
import { ea as ComponentEvents } from '../core/ComponentHost';
import { disposableList } from '../core/CompoundComponent';
import { ZX as ModuleMetricsSymbol } from '../symbols/LogBatcherSymbols';
import { browserua, bla as browserLocation, $i as documentRef, $C as windowPerformance } from '../core/AsejsEngine';
import { scheduleAsync } from '../core/RootTaskScheduler';
import { n1 as isNonEmptyString } from '../core/ConfigParameterValidators';
import { oq as LogBlobServiceSymbol } from '../symbols/LogBatcherSymbols';
import { hG as TelemetryFormatterSymbol } from '../symbols/LogBatcherSymbols';
import { vk as StartupComponentKey } from '../symbols/LogBatcherSymbols';

const startupComponent = disposableList.key(StartupComponentKey);

startupComponent.register(ComponentEvents.INIT_COMPONENT_LOGBLOBBATCHER, function (callback) {
    let telemetryFormatter;
    let logBlobService;
    let moduleMetrics;

    function buildAndSendStartupLogblob() {
        const startTime = startupComponent.startTime;
        const logData = {
            browserua: browserua,
            browserhref: browserLocation.toString,
            initstart: startTime,
            initdelay: startupComponent.endTime - startTime
        };

        // Include document mode if available (IE-specific)
        const documentMode = documentRef.documentMode;
        if (documentMode) {
            logData.browserdm = "" + documentMode;
        }

        // Include feature experiment serial number if configured
        if (isNonEmptyString(config.fesn)) {
            logData.fesn = config.fesn;
        }

        // Merge in app info / ODB metrics
        Object.assign(logData, getOdbMetrics());

        // Collect performance timing entries
        const performanceTiming = windowPerformance && windowPerformance.timing;
        if (performanceTiming) {
            config.logPerformanceTiming.map(function (timingKey) {
                const timingValue = performanceTiming[timingKey];
                if (timingValue) {
                    logData["pt_" + timingKey] = timingValue - getNavigationStartTime();
                }
            });
        }

        // Collect per-module load metrics
        const moduleLoadMetrics = moduleMetrics.internal_Bxc();
        Object.entries(moduleLoadMetrics).forEach(function (entry) {
            const iterator = Fa(entry);
            const moduleName = iterator.next().value;
            const moduleTime = iterator.next().value;
            logData["m_" + moduleName] = moduleTime;
        });

        // Build and send the startup telemetry blob
        const logBlob = telemetryFormatter.tu(
            "startup",
            "info",
            logData,
            playbackInstanceHolder.jUa
        );
        logBlobService.logblob(logBlob);
    }

    telemetryFormatter = disposableList.key(TelemetryFormatterSymbol);
    logBlobService = disposableList.key(LogBlobServiceSymbol);
    moduleMetrics = disposableList.key(ModuleMetricsSymbol);

    startupComponent.internal_Nda(function () {
        logBlobService.data();
        scheduleAsync(buildAndSendStartupLogblob);
    });

    callback(SUCCESS);
});
