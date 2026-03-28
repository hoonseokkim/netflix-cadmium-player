/**
 * Netflix Cadmium Playercore - Module 87606
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: assert; Dependencies: [22970]
 * Original signature: function(t, b, a)
 */

// Webpack module 87606
// Parameters: t (module), b (exports), a (require)
var d, p;
export function assert(c, g) {
    if (!c)
        throw new p(g || "Assertion failed");
}
;
d = a(22970);
p = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    return g;
}
)(Error);
