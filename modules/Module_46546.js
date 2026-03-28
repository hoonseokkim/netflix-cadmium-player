/**
 * Netflix Cadmium Playercore - Module 46546
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [58380]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 46546
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(58380);
p = Object.prototype.toString;
t.exports = function() {
    return "[object Arguments]" === p.call(arguments) ? function(c) {
        return "[object Arguments]" === p.call(c);
    }
    : function(c) {
        return d("callee", c);
    }
    ;
}
;
