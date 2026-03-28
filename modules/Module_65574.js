/**
 * Netflix Cadmium Playercore - Module 65574
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [57897, 32887, 14926]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 65574
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(57897);
p = a(32887);
c = a(14926);
t.exports = function() {
    var g;
    d();
    g = p();
    c(Promise.prototype, {
        "finally": g
    }, {
        "finally": function() {
            return Promise.prototype["finally"] !== g;
        }
    });
    return g;
}
;
