/**
 * Netflix Cadmium Playercore - Module 52991
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Khb
 */

// Webpack module 52991
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Khb = undefined;
t = (function() {
    function a() {}
    a.prototype.fa = function() {
        var d;
        d = process.Igd();
        return 1E3 * d[0] + d[1] / 1E6;
    }
    ;
    a.prototype.$va = function(d) {
        return d - this.fa() + this.now();
    }
    ;
    a.prototype.Mwa = function(d) {
        return d - this.now() + this.fa();
    }
    ;
    a.prototype.now = function() {
        return Date.now();
    }
    ;
    return a;
}
)();
export const Khb = t;

// Detected exports: Khb
