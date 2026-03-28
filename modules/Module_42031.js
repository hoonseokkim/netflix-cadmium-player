/**
 * Netflix Cadmium Playercore - Module 42031
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: TBb
 * Original signature: function(t, b)
 */

// Webpack module 42031
// Parameters: t (module), b (exports)
export function TBb(a) {
    if ("undefined" !== typeof process)
        return ({
            NODE_ENV: "production",
            PLATFORM: "cadmium",
            ASEBUILD: "release",
            OBFUSCATE: "obfuscate",
            BUILD_VERSION: "6.0055.939.911"
        })[a];
}
;
