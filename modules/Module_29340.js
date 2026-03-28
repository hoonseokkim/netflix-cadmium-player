/**
 * Netflix Cadmium Playercore - Module 29340
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Class/prototype-based
 * Original signature: function(t, b)
 */

// Webpack module 29340
// Parameters: t (module), b (exports)
function a(d, p) {
    var c;
    d.__proto__ && d.__proto__ !== Object.prototype && a(d.__proto__, p);
    Object.getOwnPropertyNames(d).forEach(function(g) {
        c = Object.getOwnPropertyDescriptor(d, g);
        undefined !== c && Object.defineProperty(p, g, c);
    });
}
b["default"] = a;
