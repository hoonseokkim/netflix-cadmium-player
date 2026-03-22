/**
 * @module MonitoringModule
 * @description Inversify container module that binds all monitoring/logging/telemetry
 * services. Registers log blob builders, metric reporters, download metrics, and
 * deferred log blob resolution that waits for configuration and feature flags.
 * @original Module_21009
 */

// Inversify container module
// import { ContainerModule } from 'inversify'; // Module 22674

// Service tokens and implementations (by original module IDs):
// Module 97996: J7 config key
// Module 31966: BCa implementation (log processor)
// Module 79428: GGa implementation (base log blob)
// Module 50723: CHa implementation (session log blob)
// Module 33345: RGa implementation (network log blob)
// Module 74621: OGa implementation (media log blob)
// Module 4203:  ConfigToken
// Module 41320: EGa implementation (buffer log blob)
// Module 69124: MGa implementation (playback log blob)
// Module 74031: NGa implementation (error log blob)
// Module 53085: valueList (scheduler reference)
// Module 33554: QC (feature flag check)
// Module 13847: f$a token (log processor token)
// Module 53234: fhb token (session log blob token)
// Module 33945: agb token (network log blob token)
// Module 31850: hG token (playback log blob token)
// Module 81829: internal_Zfb / internal_Yfb tokens (media/error log blob tokens)
// Module 45118: oq / FGa / internal_Vfb tokens (base/buffer/deferred log blob tokens)
// Module 98326: w7 / QGa tokens (metric tokens)
// Module 52025: GP implementation (metric reporter)
// Module 30895: internal_Obb token (download metrics token)
// Module 36792: DownloadMetricsBuilder implementation
// Module 74714: PGa implementation (metric collector)
// Module 73449: y7 token (secondary metric token)
// Module 26158: HP implementation (secondary metric reporter)

/**
 * Inversify ContainerModule that registers all monitoring and telemetry bindings.
 *
 * Bindings include:
 * - Base log blob builder (oq -> GGa)
 * - Session log blob builder (fhb -> CHa)
 * - Network log blob builder (agb -> RGa)
 * - Media log blob builder (internal_Zfb -> OGa)
 * - Buffer log blob builder (FGa -> EGa)
 * - Playback log blob builder (hG -> MGa)
 * - Error log blob builder (internal_Yfb -> NGa)
 * - Primary metrics reporter (w7 -> GP)
 * - Metrics collector (QGa -> PGa)
 * - Secondary metrics reporter (y7 -> HP)
 * - Download metrics builder (internal_Obb -> DownloadMetricsBuilder)
 * - Log processor (f$a -> BCa)
 * - Deferred log blob (internal_Vfb): resolves lazily after config, feature flags,
 *   and KT flag are all available
 *
 * @type {ContainerModule}
 */
export const monitoringModule = new ContainerModule((bind) => {
    bind(BaseLogBlobToken).to(BaseLogBlobBuilder).inSingletonScope();
    bind(SessionLogBlobToken).to(SessionLogBlobBuilder).inSingletonScope();
    bind(NetworkLogBlobToken).to(NetworkLogBlobBuilder).inSingletonScope();
    bind(MediaLogBlobToken).to(MediaLogBlobBuilder).inSingletonScope();
    bind(BufferLogBlobToken).to(BufferLogBlobBuilder).inSingletonScope();
    bind(PlaybackLogBlobToken).to(PlaybackLogBlobBuilder).inSingletonScope();
    bind(ErrorLogBlobToken).to(ErrorLogBlobBuilder).inSingletonScope();
    bind(PrimaryMetricsToken).to(PrimaryMetricsReporter).inSingletonScope();
    bind(MetricsCollectorToken).to(MetricsCollector).inSingletonScope();
    bind(SecondaryMetricsToken).to(SecondaryMetricsReporter).inSingletonScope();
    bind(DownloadMetricsToken).to(DownloadMetricsBuilder).inSingletonScope();
    bind(LogProcessorToken).to(LogProcessor).inSingletonScope();

    // Deferred log blob: waits for configuration readiness before resolving
    bind(DeferredLogBlobToken).toDynamicValue((context) => {
        return function () {
            return context.container
                .get(ConfigKey)()
                .then((config) => {
                    return new Promise((resolve) => {
                        const scheduler = context.container.get(SchedulerToken);
                        const isConfigReady = context.container.get(ConfigToken);
                        const isFeatureEnabled = context.container.get(FeatureFlagToken);

                        function checkReadiness() {
                            if (isConfigReady() && isFeatureEnabled() && config.KT) {
                                resolve(context.container.get(BaseLogBlobToken));
                            } else {
                                scheduler.scheduleHydration(checkReadiness);
                            }
                        }

                        scheduler.scheduleHydration(checkReadiness);
                    });
                });
        };
    });
});

export default monitoringModule;
