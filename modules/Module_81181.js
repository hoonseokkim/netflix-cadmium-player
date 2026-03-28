/**
 * Netflix Cadmium Playercore - Module 81181
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [70999]
 * Original signature: function(t, b, a)
 */

// Webpack module 81181
// Parameters: t (module), b (exports), a (require)
var p;
function d() {
    return !!p;
}
p = a(70999);
d.$Ac = function() {
    if (!p)
        return null;
    try {
        return 1 !== p([], "length", {
            value: 1
        }).length;
    } catch (c) {
        return true;
    }
}
;
t.exports = d;
