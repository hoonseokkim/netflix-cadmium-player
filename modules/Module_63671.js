/**
 * Netflix Cadmium Playercore - Module 63671
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [8435, 58786, 5408]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 63671
// Parameters: t (module), b (exports), a (require)
var d, p, c;
b = a(8435);
d = a(58786);
p = b("RegExp.prototype.exec");
c = a(5408);
t.exports = function(g) {
    if (!d(g))
        throw new c("`regex` must be a RegExp");
    return function(f) {
        return null !== p(g, f);
    }
    ;
}
;
