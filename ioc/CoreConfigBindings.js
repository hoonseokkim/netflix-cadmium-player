/**
 * Netflix Cadmium Player - Core Config IoC Bindings
 * Deobfuscated from Module_83810
 *
 * IoC container module that binds core configuration and platform services.
 * Registers factory providers for:
 *   - Global player configuration (from Da._cad_global.config)
 *   - Platform normalizer services (NDa, gp, BP)
 *   - Enum constants
 *   - FTL probe configuration
 *   - Report sync configuration
 */

import { ContainerModule } from "inversify"; // Module 22674
import { ConfigToken } from "../symbols/ConfigToken"; // Module 4203
import { MDa, ELa, XFa } from "../config/PlatformNormalizers"; // Module 80217
import { NDa, gp, BP } from "../config/PlatformTokens"; // Module 83767
import { enumConstants } from "../config/EnumConstants"; // Module 34231
import { oFa as EnumConstantsImpl } from "../config/EnumConstantsImpl"; // Module 33823
import { FtlProbeConfigToken } from "../symbols/FtlProbeConfigToken"; // Module 48004
import { VHa as FtlProbeConfigImpl } from "../config/FtlProbeConfigImpl"; // Module 40158
import { FtlProbeConfigSymbol } from "../symbols/FtlProbeSymbols"; // Module 69484
import { lFa as FtlProbeImpl } from "../config/FtlProbeImpl"; // Module 34731
import { SC as ReportSyncToken } from "../symbols/ReportSyncToken"; // Module 23563
import { OEa as ReportSyncImpl } from "../config/ReportSyncImpl"; // Module 18135

export const coreConfigModule = new ContainerModule(function (bind) {
    // Global config - provided as factory returning runtime global config
    bind(ConfigToken).gg(function () {
        return function () {
            return Da._cad_global.config;
        };
    });

    // Platform normalizer bindings
    bind(NDa).to(MDa).sa();
    bind(gp).to(ELa).sa();
    bind(BP).to(XFa).sa();

    // Enum constants
    bind(enumConstants).to(EnumConstantsImpl).sa();

    // FTL probe config
    bind(FtlProbeConfigToken).to(FtlProbeConfigImpl).sa();

    // FTL probe symbol binding
    bind(FtlProbeConfigSymbol).to(FtlProbeImpl).sa();

    // Report sync
    bind(ReportSyncToken).to(ReportSyncImpl).sa();
});
