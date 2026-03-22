/**
 * Manifest Exports Index
 *
 * Barrel file that re-exports all manifest-related modules:
 * - Module 80635: ManifestPropertyNormalizer (property name aliasing)
 * - Module 38180: (manifest-related export)
 * - Module 60490: (manifest-related export)
 * - Module 94490: (manifest-related export)
 *
 * @module ManifestExportsIndex
 * @source Module_75347
 */
export default function ManifestExportsIndex(module, exports, require) {
    var tslib;

    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });

    tslib = require(22970);
    tslib.__exportStar(require(80635), exports);  // ManifestPropertyNormalizer
    tslib.__exportStar(require(38180), exports);
    tslib.__exportStar(require(60490), exports);
    tslib.__exportStar(require(94490), exports);
}
