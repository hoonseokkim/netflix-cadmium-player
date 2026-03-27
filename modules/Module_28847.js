/**
 * Netflix Cadmium Playercore - Module 28847
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 28847
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Zrc = function(p, c, g) {
    var f, e, h;
    f = 0;
    if (g) {
        p.some(function(k) {
            var l;
            l = k.b;
            k = k.m;
            if (c <= l)
                return (f = h && l !== e ? h + (k - h) / (l - e) * (c - e) : k,
                !0);
            e = l;
            f = h = k;
            return !1;
        });
    } else
        p.some(function(k) {
            f = k.m;
            return c <= k.b;
        });
    return f;
}
;
b.jOb = function(p, c, g) {
    var f;
    c = (null === (f = c.sb) || void 0 === f ? void 0 : f.Fa) || 0;
    return p.Ksb ? (p = (0,
    d.zTa)(p.Jsb, g.yl - g.Ld, 1),
    c * (1 - p)) : c * p.MV / 100;
}
;
b.Orb = function(p, c) {
    return p < 2 * c ? p / 2 : p - c;
}
;
d = a(65167);


// Detected exports: Zrc, jOb, Orb