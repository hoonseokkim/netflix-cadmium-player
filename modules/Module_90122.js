/**
 * Netflix Cadmium Playercore - Module 90122
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Leaf module (no dependencies)
 * Original signature: function(t, b)
 */

// Webpack module 90122
// Parameters: t (module), b (exports)
var a;
"undefined" !== typeof Promise && (a = Promise);
b["default"] = {
    setImpl: function(d) {
        a = d;
    },
    create: function(d) {
        return new a(d);
    }
};
