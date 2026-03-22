/**
 * @file PlatformConfigExports - Barrel re-export of platform configuration modules
 * @module core/PlatformConfigExports
 * @description Aggregates and re-exports all platform configuration sub-modules.
 * This is a convenience barrel file that imports and re-exports everything from
 * the individual platform config modules, making them available through a single
 * import path.
 *
 * Re-exported modules:
 *   - Module 84915 - Platform detection / capabilities
 *   - Module 83403 - Platform feature flags
 *   - Module 93926 - Platform media capabilities
 *   - Module 77985 - Platform DRM capabilities
 *   - Module 7954  - Platform codec support
 *   - Module 67111 - Platform display / HDR info
 *   - Module 92884 - Platform audio capabilities
 *   - Module 13779 - Platform network info
 *
 * @original Module_66164
 */

// Re-export all platform configuration sub-modules
export * from './PlatformDetection.js';       // Module 84915
export * from './PlatformFeatureFlags.js';     // Module 83403
export * from './PlatformMediaCapabilities.js'; // Module 93926
export * from './PlatformDrmCapabilities.js';  // Module 77985
export * from './PlatformCodecSupport.js';     // Module 7954
export * from './PlatformDisplayInfo.js';      // Module 67111
export * from './PlatformAudioCapabilities.js'; // Module 92884
export * from './PlatformNetworkInfo.js';      // Module 13779
