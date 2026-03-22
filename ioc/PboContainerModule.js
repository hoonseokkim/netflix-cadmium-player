/**
 * Netflix Cadmium Player — PBO IoC Container Module
 *
 * Dependency injection container module for the PBO (Playback Operations)
 * subsystem. Registers all PBO-related services, commands, event handlers,
 * and manifest request transformers into the inversify container.
 *
 * This module wires together:
 * - PBO service and bind/unbind/manifest commands
 * - Event lookup (start, pause, resume, splice, etc.)
 * - Manifest request transformer (native vs non-native processor)
 * - Session history, CDN reporting, and metrics services
 *
 * @module ioc/PboContainerModule
 * @original Module_18880
 */

import { readFloat32 as ContainerModule } from '../modules/Module_22674.js'; // inversify ContainerModule
import { internal_Tib as PboSessionSymbol } from '../modules/Module_40953.js';
import { LIa as PboSessionImpl } from '../modules/Module_30543.js';
import { NIa as PboUnbindSymbol } from '../modules/Module_72639.js';
import { MIa as PboUnbindImpl } from '../modules/Module_86563.js';
import { wIa as PboCommandSymbol } from '../modules/Module_81378.js';
import { vIa as PboCommandImpl } from '../modules/Module_13158.js';
import { internal_Qib as PboConfigSymbol } from '../modules/Module_16257.js';
import { HIa as PboConfigImpl } from '../modules/Module_46303.js';
import { JIa as PboDispatcherSymbol } from '../modules/Module_829.js';
import { IIa as PboDispatcherImpl } from '../modules/Module_45830.js';
import { internal_Rlb, internal_Wlb, $eb, internal_Olb, internal_Gib, internal_Qkb, internal_Bcb, $o as PboEventType, XEa as PboEventLookupSymbol } from '../modules/Module_87607.js';
import { RKa as StartEventImpl } from '../modules/Module_84860.js';
import { VKa as TimerEventImpl } from '../modules/Module_35329.js';
import { we as NfError } from '../modules/Module_31149.js';
import { ea as ErrorCodes } from '../modules/Module_36129.js';
import { kGa as WuaEventImpl } from '../modules/Module_25546.js';
import { PKa as SpliceEventImpl } from '../modules/Module_69740.js';
import { uIa as PauseEventImpl } from '../modules/Module_22503.js';
import { gKa as ResumeEventImpl } from '../modules/Module_52137.js';
import { SEa as EndEventImpl } from '../modules/Module_88951.js';
import { io as PboServiceToken } from '../modules/Module_83998.js';
import { CIa as PboServiceImpl } from '../modules/Module_54949.js';
import { internal_Kib as PboBindSymbol } from '../modules/Module_62898.js';
import { zIa as PboBindImpl } from '../modules/Module_15153.js';
import { internal_Lib as PboManifestSymbol } from '../modules/Module_70285.js';
import { AIa as PboManifestImpl } from '../modules/Module_76427.js';
import { PIa as PboTransformImpl } from '../modules/Module_36642.js';
import { e5b as PboTransformSymbol } from '../modules/Module_15614.js';
import { internal_Pib as PboCdnSymbol } from '../modules/Module_95738.js';
import { GIa as PboCdnImpl } from '../modules/Module_82306.js';
import { nativeProcessor as ConfigToken } from '../modules/Module_7605.js';
import { internal_Uib as ManifestTransformerSymbol } from '../modules/Module_67658.js';
import { OIa as NonNativeTransformerImpl } from '../modules/Module_3035.js';
import { $Ia as NativeTransformerImpl } from '../modules/Module_46320.js';
import { nCa as SessionHistoryImpl } from '../modules/Module_595.js';
import { oCa as SessionHistorySymbol, mCa as SessionMetricsSymbol } from '../modules/Module_49917.js';
import { lCa as SessionMetricsImpl } from '../modules/Module_49449.js';
import { ygb as PboReportSymbol } from '../modules/Module_41332.js';
import { AGa as PboReportImpl } from '../modules/Module_20424.js';
import { internal_Iib as PboHeaderSymbol } from '../modules/Module_36475.js';
import { xIa as PboHeaderImpl } from '../modules/Module_25743.js';
import { fma as PboFallbackSymbol } from '../modules/Module_54861.js';
import { MKa as PboFallbackImpl } from '../modules/Module_70885.js';
import { JKa as PboRecoverySymbol, IKa as PboRecoveryImpl } from '../modules/Module_21015.js';

/**
 * PBO IoC Container Module.
 *
 * Registers all PBO subsystem bindings into the inversify container.
 * Includes conditional binding for the manifest request transformer
 * based on whether native processing is enabled.
 */
export const pboContainerModule = new ContainerModule((bind) => {
  // Core PBO service
  bind(PboServiceToken).to(PboServiceImpl);

  // Fallback & recovery
  bind(PboFallbackSymbol).to(PboFallbackImpl).sa();
  bind(PboRecoverySymbol).to(PboRecoveryImpl).sa();

  // PBO commands
  bind(PboSessionSymbol).to(PboSessionImpl);
  bind(PboBindSymbol).to(PboBindImpl);
  bind(PboManifestSymbol).to(PboManifestImpl);
  bind(PboUnbindSymbol).to(PboUnbindImpl);

  // Manifest request transformer - conditional on native processor support
  bind(ManifestTransformerSymbol).toDynamicValue((context) => {
    return () => {
      const config = context.onConfigChanged.key(ConfigToken);
      return config && config.iXb
        ? context.onConfigChanged.resolve(NativeTransformerImpl)
        : context.onConfigChanged.resolve(NonNativeTransformerImpl);
    };
  });

  // PBO sub-services
  bind(PboCommandSymbol).to(PboCommandImpl);
  bind(PboConfigSymbol).to(PboConfigImpl);
  bind(PboDispatcherSymbol).to(PboDispatcherImpl);

  // PBO event handlers (start, timer, wua, splice, pause, resume, end)
  bind(internal_Rlb).to(StartEventImpl);
  bind(internal_Wlb).to(TimerEventImpl);
  bind($eb).to(WuaEventImpl);
  bind(internal_Olb).to(SpliceEventImpl);
  bind(internal_Gib).to(PauseEventImpl);
  bind(internal_Qkb).to(ResumeEventImpl);
  bind(internal_Bcb).to(EndEventImpl);

  // PBO transform, CDN, headers
  bind(PboTransformSymbol).to(PboTransformImpl);
  bind(PboHeaderSymbol).to(PboHeaderImpl);
  bind(PboCdnSymbol).to(PboCdnImpl);

  // Session history & metrics
  bind(SessionHistorySymbol).to(SessionHistoryImpl);
  bind(SessionMetricsSymbol).to(SessionMetricsImpl);

  // Event lookup factory - resolves event handler by event type
  bind(PboEventLookupSymbol).toDynamicValue((context) => {
    return (eventType) => {
      switch (eventType) {
        case PboEventType.start:
          return context.onConfigChanged.key(internal_Rlb);
        case PboEventType.aseTimer:
          return context.onConfigChanged.key(internal_Wlb);
        case PboEventType.wua:
          return context.onConfigChanged.key($eb);
        case PboEventType.splice:
          return context.onConfigChanged.key(internal_Olb);
        case PboEventType.pause:
          return context.onConfigChanged.key(internal_Gib);
        case PboEventType.resume:
          return context.onConfigChanged.key(internal_Qkb);
        case PboEventType.O_:
          return context.onConfigChanged.key(internal_Bcb);
      }
      throw new NfError(
        ErrorCodes.PBO_EVENTLOOKUP_FAILURE,
        undefined, undefined, undefined, undefined,
        'The event key was invalid - ' + eventType,
      );
    };
  });

  // PBO reporting
  bind(PboReportSymbol).to(PboReportImpl);
});

export { pboContainerModule as internal_Rub };
