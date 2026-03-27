/**
 * Netflix Cadmium Playercore - Module 8825
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 8825
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.oG = void 0;
b.a$c = function(p, c, g, f, e) {
    return (p - c) * (e - f) / (g - c) + f;
}
;
b.zk = function(p) {
    if ((0,
    d.wc)(p))
        return (p / 1E3).toFixed(3);
}
;
d = a(32687);
b.oG = b.oG || (function(p, c, g) {
    return p >= c ? p <= g ? p : g : c;
}
);


// Detected exports: oG, zk