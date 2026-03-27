/**
 * DRM Services Symbols
 *
 * Defines the dependency injection symbol identifiers for DRM services
 * and DRM services provider. Used by the inversify IoC container to
 * resolve DRM-related dependencies.
 *
 * @module DrmServicesSymbol
 * @source Module_47737
 */
export default function DrmServicesSymbol(module, exports, require) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    /** Symbol identifier for the DRM services binding */
    exports.DrmServicesSymbol = "DrmServicesSymbol";

    /** Symbol identifier for the DRM services provider binding */
    exports.aka = "DrmServicesProviderSymbol";
}
