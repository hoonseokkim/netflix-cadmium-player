/**
 * Netflix Cadmium Playercore - Module 69193
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: eD, z5a
 */

// Webpack module 69193
// Parameters: t, b

var d;
function a(p) {
    if (!p)
        throw new TypeError("Text encoding implementation cannot be null.");
    d = p;
}
export const eD = b.z5a = b.smb = b.TC = undefined;
b.TC = {
    yG: "utf-8",
    fbd: "utf-16"
};
b.smb = (function() {
    return function() {}
    ;
}
)();
export const z5a = a;
b.eD = {
    z5a: a,
    Be: function(p, c) {
        undefined === c && (c = b.TC.yG);
        return d.Be(p, c);
    },
    Ed: function(p, c) {
        undefined === c && (c = b.TC.yG);
        return d.Ed(p, c);
    }
};

// Detected exports: eD, z5a
