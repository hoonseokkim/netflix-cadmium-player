/**
 * Manifest Command Types and Request Paths
 *
 * Defines the different manifest request types used in the Cadmium player,
 * including prefetch, postplay, and standard manifest request paths for
 * licensed manifests, live streams, and ad break hydration.
 *
 * @module ManifestCommandTypes
 * @original Module_72639
 */

/**
 * Manifest request type enumeration
 * @enum {string}
 */
export const ManifestRequestType = Object.freeze({
    PRE_FETCH: "PRE_FETCH",
    QC: "QC",
    STANDARD: "STANDARD",
    SUPPLEMENTAL: "SUPPLEMENTAL",
    DOWNLOAD: "DOWNLOAD",
});

/**
 * Postplay manifest request paths
 * @type {string[]}
 */
export const POSTPLAY_REQUEST_PATHS = [
    "postplay/licensedManifest",
    "postplay/manifest",
    "postplay/licensedManifest/live",
    "postplay/manifest/live",
    "postplay/licensedManifest/ad",
    "postplay/manifest/ad",
    "postplay/licensedManifest/live/ad",
    "postplay/manifest/live/ad",
];

/**
 * Prefetch manifest request paths
 * @type {string[]}
 */
export const PREFETCH_REQUEST_PATHS = [
    "prefetch/licensedManifest",
    "prefetch/manifest",
    "prefetch/licensedManifest/live",
    "prefetch/manifest/live",
    "prefetch/licensedManifest/ad",
    "prefetch/manifest/ad",
    "prefetch/licensedManifest/live/ad",
    "prefetch/manifest/live/ad",
];

/**
 * Standard manifest request paths (including ad break hydration and live ads)
 * @type {string[]}
 */
export const STANDARD_REQUEST_PATHS = [
    "licensedManifest",
    "manifest",
    "licensedManifest/live",
    "manifest/live",
    "adBreakHydration",
    "adBreakHydration/live",
    "prefetchLiveAds",
    "licensedManifest/ad",
    "manifest/ad",
    "licensedManifest/live/ad",
    "manifest/live/ad",
    "adBreakHydration/ad",
    "adBreakHydration/live/ad",
    "prefetchLiveAds/ad",
];

/**
 * Combined list of all ABR delay log map paths
 * @type {string[]}
 */
export const ABR_DELAY_LOG_MAP = [
    ...POSTPLAY_REQUEST_PATHS,
    ...PREFETCH_REQUEST_PATHS,
    ...STANDARD_REQUEST_PATHS,
];

/**
 * Symbol identifier for PBO manifest commands
 * @type {string}
 */
export const PBO_MANIFEST_COMMAND_SYMBOL = "PboManifestCommandSymbol";
