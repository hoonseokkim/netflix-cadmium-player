/**
 * Netflix Cadmium Playercore - Module 67258
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [37425]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 67258
// Parameters: t (module), b (exports), a (require)
var d;
d = a(37425);
t = (function() {
    function p(c, g) {
        this.key = c;
        this.value = g;
    }
    p.prototype.toString = function() {
        return this.key === d.hK ? "named: " + this.value.toString() + " " : "tagged: { key:" + this.key.toString() + ", value: " + this.value + " }";
    }
    ;
    return p;
}
)();
export const Metadata = t;
