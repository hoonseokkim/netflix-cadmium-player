/**
 * Netflix Cadmium Playercore - Module 981
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Class/prototype-based
 * Original signature: function(t, b)
 */

// Webpack module 981
// Parameters: t (module), b (exports)
function a(d, p) {
    this.t7a = d;
    this.sE = p;
}

a.prototype.cYc = function() {
    this.Ena || (this.Ena = setInterval(this.sE, this.t7a));
}
;
a.prototype.yub = function() {
    this.Ena && (clearInterval(this.Ena),
    this.Ena = undefined);
}
;
export const Akb = a;
