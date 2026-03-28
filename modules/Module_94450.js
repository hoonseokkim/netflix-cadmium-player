/**
 * Netflix Cadmium Playercore - Module 94450
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Class/prototype-based
 * Original signature: function(t, b)
 */

// Webpack module 94450
// Parameters: t (module), b (exports)
t = (function() {
    function a(d, p, c) {
        this.total = 0;
        this.counter = d.counter(p, c);
    }
    a.prototype.nB = function(d) {
        undefined === d && (d = 1);
        this.total += d;
        this.counter.nB(d);
    }
    ;
    return a;
}
)();
export const Counter = t;
