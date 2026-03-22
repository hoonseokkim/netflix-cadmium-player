/**
 * Netflix Cadmium Player — ES Module Marker (82010)
 *
 * Trivial module that marks its exports object as an ES module by setting
 * the `__esModule` flag. Used by the bundler to ensure interop between
 * CommonJS and ES module consumers.
 *
 * @module core/EsModuleMarker_82010
 */

export default function initModule(module, exports, require) {
  Object.defineProperties(exports, {
    __esModule: {
      value: true,
    },
  });
}
