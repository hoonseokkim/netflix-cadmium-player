/**
 * Netflix Cadmium Player -- ManifestModuleBindings
 *
 * IoC container module that registers bindings for the manifest subsystem.
 * Binds the manifest transformer multi-injection token and the manifest
 * parser factory.
 *
 * @module manifest/ManifestModuleBindings
 * @original Module_81737
 * @dependencies
 *   Module 22674 - inversify (ContainerModule)
 *   Module 99070 - ManifestParserFactory binding (iHa)
 *   Module 49745 - ManifestParserFactorySymbol (tX)
 *   Module 704   - ManifestTransformerSymbol (vgb)
 *   Module 3861  - ManifestTransformerBinding (jHa)
 */

import { ContainerModule } from '../ioc/InversifyCore';                          // Module 22674
import { ManifestParserFactory } from './ManifestParserFactory';                  // Module 99070 (iHa)
import { ManifestParserFactorySymbol } from '../symbols/ManifestParserFactorySymbol'; // Module 49745 (tX)
import { ManifestTransformerSymbol } from '../symbols/ManifestTransformerSymbol';     // Module 704 (vgb)
import { ManifestTransformerBinding } from './ManifestTransformerBinding';            // Module 3861 (jHa)

/**
 * Inversify ContainerModule that registers manifest-related service bindings.
 *
 * Bindings:
 *   - ManifestParserFactorySymbol -> ManifestParserFactory (singleton)
 *   - ManifestTransformerSymbol   -> ManifestTransformerBinding
 */
export const manifestModule = new ContainerModule(function (bind) {
    bind(ManifestParserFactorySymbol).to(ManifestParserFactory).inSingletonScope();
    bind(ManifestTransformerSymbol).to(ManifestTransformerBinding);
});
