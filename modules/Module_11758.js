/**
 * Netflix Cadmium Playercore - Module 11758
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 11758
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.KCa = void 0;
d = a(22970);
a(66164);
p = a(52571);
t = (function(c) {
    function g(f, e, h, k, l, m, n, q) {
        f = c.call(this, f, e, h, k, l, m, n, q) || this;
        (0,
        p.assert)(0 === h.responseType);
        (0,
        p.assert)(h.ji);
        f.ji = h.ji;
        return f;
    }
    d.__extends(g, c);
    Object.defineProperties(g.prototype, {
        stream: {
            get: function() {
                return this.bf;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    return g;
}
)(a(47743).HCa);
b.KCa = t;


// Detected exports: KCa