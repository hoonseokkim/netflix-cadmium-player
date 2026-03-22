/**
 * Netflix Cadmium Player - Resource Load State Enum
 * Deobfuscated from Module_94025
 *
 * Enumeration representing the lifecycle states of a loadable resource
 * (e.g., media segments, manifests, DRM licenses).
 */

export const ResourceLoadState = {
    NOT_LOADED: 0,
    LOADING: 1,
    LOADED: 2,
    LOAD_FAILED: 3,
    PARSE_FAILED: 4
};

// Reverse mapping for debugging
ResourceLoadState[0] = "NOT_LOADED";
ResourceLoadState[1] = "LOADING";
ResourceLoadState[2] = "LOADED";
ResourceLoadState[3] = "LOAD_FAILED";
ResourceLoadState[4] = "PARSE_FAILED";
