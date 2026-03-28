/**
 * Netflix Cadmium Playercore - Module 89350
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Configuration
 * Exports: khb
 */

// Webpack module 89350
// Parameters: t, b

function a(d, p, c) {
    this.Kd = d;
    this.config = p;
    this.getTime = c;
}
export const khb = undefined;
a.prototype.observe = function(d, p) {
    var c;
    c = this;
    this.cancel();
    this.Em = this.Kd.gV(this.config.$Cb(), function() {
        c.getTime() >= d && (c.cancel(),
        p());
    });
}
;
a.prototype.cancel = function() {
    this.Em && (this.Em.cancel(),
    this.Em = undefined);
}
;
export const khb = a;

// Detected exports: khb
