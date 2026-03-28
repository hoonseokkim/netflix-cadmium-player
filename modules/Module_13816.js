/**
 * Netflix Cadmium Playercore - Module 13816
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports: c3a, hRc
 * Original signature: function(t, b)
 */

// Webpack module 13816
// Parameters: t (module), b (exports)
export function c3a(a, d) {
    var p, c;
    return (null !== (p = a.priority) && undefined !== p ? p : 0) - (null !== (c = d.priority) && undefined !== c ? c : 0);
}
;
export function hRc(a, d) {
    var p, c;
    return (null !== (p = d.priority) && undefined !== p ? p : 0) - (null !== (c = a.priority) && undefined !== c ? c : 0);
}
;
