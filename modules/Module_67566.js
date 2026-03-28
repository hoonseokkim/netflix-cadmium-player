/**
 * Netflix Cadmium Playercore - Module 67566
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Class/prototype-based
 * Original signature: function(t, b)
 */

// Webpack module 67566
// Parameters: t (module), b (exports)
t = (function() {
    function a(d) {
        this.bH = d;
    }
    a.prototype.uwa = function() {
        var d, p, c;
        d = this.bH.axc();
        p = this.bH.bxc();
        c = this.bH.cxc();
        if ("number" === typeof d && "number" === typeof p && "number" === typeof c)
            return (c - d) / p;
    }
    ;
    return a;
}
)();
export const I3b = t;
