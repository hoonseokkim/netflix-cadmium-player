/**
 * Netflix Cadmium Playercore - Module 36472
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 36472
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.slb = void 0;
d = a(22970);
p = a(91176);
c = a(99548);
g = a(52571);
f = a(8149);
b.slb = (function() {
    function e() {}
    e.qAc = function(h, k, l) {
        var m, n;
        if (h.ag) {
            m = d.__read(h.oa, 1)[0];
            if (h.oa.some(function(q) {
                return (0,
                f.Gn)(q);
            })) {
                (0,
                g.assert)((0,
                f.Gn)(m), "expected live primary track");
                (0,
                g.assert)(h.L.Ic, "Expected live viewable with position service");
                n = (0,
                c.Hga)(k, l, h.L, p.I.uh) || p.I.uh;
                h = (0,
                c.Hga)(k, l, h.L, p.I.uh) || p.I.uh;
                return {
                    EXb: n,
                    FXb: h
                };
            }
            k = null === (n = m.uk) || void 0 === n ? void 0 : n.$b;
            (0,
            g.assert)(k);
            h = h.oa.reduce(function(q, r) {
                var u;
                return (null === (u = r.uk) || void 0 === u ? 0 : u.$b) ? p.I.min(q, r.uk.$b) : q;
            }, k);
            return {
                EXb: k,
                FXb: h
            };
        }
    }
    ;
    return e;
}
)();


// Detected exports: slb