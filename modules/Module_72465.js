/**
 * Netflix Cadmium Playercore - Module 72465
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: iIa
 */

// Webpack module 72465
// Parameters: t, b

function a(d) {
    this.value = d;
}
export const iIa = undefined;
a.empty = function() {
    return a.of(undefined);
}
;
a.of = function(d) {
    return new a(d);
}
;
a.prototype.or = function(d) {
    return undefined === this.value ? d instanceof Function ? d() : d : this.value;
}
;
a.prototype.map = function(d) {
    return undefined === this.value ? a.empty() : a.of(d(this.value));
}
;
export const iIa = a;

// Detected exports: iIa
