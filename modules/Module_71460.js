/**
 * Netflix Cadmium Playercore - Module 71460
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Tdb
 */

// Webpack module 71460
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Tdb = undefined;
t = (function() {
    function a(d, p, c) {
        var g, f, e;
        this.Eb = p;
        this.ub = c;
        this.Ppb = d;
        g = this.Opb = this.$nb = this.Znb = 0;
        f = 0;
        e = 0;
        this.Ppb.length >= this.Eb.gKb && (this.Ppb.forEach(function(h) {
            g += h.avtp;
            f += 1 * h.neuhd;
            e++;
        }),
        this.Opb = e,
        this.Znb = g / e,
        this.$nb = f / e);
    }
    a.prototype.WDc = function() {
        return this.Opb >= this.Eb.gKb && this.Znb >= this.Eb.Osb.bwThreshold && this.$nb < this.Eb.Osb.nethreshold;
    }
    ;
    return a;
}
)();
export const Tdb = t;

// Detected exports: Tdb
