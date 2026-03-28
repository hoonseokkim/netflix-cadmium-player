/**
 * Netflix Cadmium Playercore - Module 49587
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: qnb
 */

// Webpack module 49587
// Parameters: t, b

function a(d, p) {
    this.j = p;
    this.iU = true;
    this.jBa = false;
    this.Ja = d;
}
export const qnb = undefined;
a.prototype.k1a = function() {
    this.iU && (this.iU = false,
    this.j.paused.set(false));
}
;
a.prototype.j1a = function() {
    this.iU || (this.iU = true,
    this.j.paused.set(true));
}
;
a.prototype.pause = function() {
    var d;
    this.paused || (this.iU = true,
    null === (d = this.Ja) || undefined === d ? undefined : d.pause());
}
;
a.prototype.play = function() {
    var d, p;
    d = this;
    return this.paused && !this.jBa ? (this.jBa = true,
    Promise.resolve(null === (p = this.Ja) || undefined === p ? undefined : p.play()).then(function() {
        d.jBa = false;
    }).catch(function(c) {
        var g;
        d.jBa = false;
        d.iU = !(null === (g = d.Ja) || undefined === g || !g.paused);
        throw c;
    })) : Promise.resolve();
}
;
a.prototype.close = function() {
    this.Ja = undefined;
}
;
Ha.Object.defineProperties(a.prototype, {
    paused: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.iU;
        }
    }
});
export const qnb = a;

// Detected exports: qnb
