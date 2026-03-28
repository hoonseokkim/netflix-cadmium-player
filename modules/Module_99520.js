/**
 * Netflix Cadmium Playercore - Module 99520
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [22970, 71724]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 99520
// Parameters: t (module), b (exports), a (require)
var d;
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function(g) {
        p.prototype.parse.call(this, g);
        return true;
    }
    ;
    return c;
}
)(a(71724).default);
b["default"] = t;
