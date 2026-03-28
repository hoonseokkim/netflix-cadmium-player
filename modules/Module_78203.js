/**
 * Netflix Cadmium Playercore - Module 78203
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Class/prototype-based
 * Original signature: function(t, b)
 */

// Webpack module 78203
// Parameters: t (module), b (exports)
t = (function() {
    function a(d) {
        this.T1 = d;
    }
    a.prototype.CM = function(d, p) {
        var c;
        c = d.attempt < this.T1;
        return c ? p(d) : {
            At: c
        };
    }
    ;
    return a;
}
)();
export const Egb = t;
