/**
 * Netflix Cadmium Playercore - Module 30326
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 30326
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.kPa = function(p) {
    var c, g, f, e;
    c = p.Ys;
    g = p.loadTime;
    p = p.ITa;
    f = (0,
    d.wc)(g) ? g : 0;
    e = c[p.target] || ({});
    c[p.target] !== e && (c[p.target] = e);
    Object.entries(p.fields).forEach(function(h) {
        var k, l, m, n;
        k = Fa(h);
        h = k.next().value;
        k = k.next().value;
        if ("object" !== typeof k || null === k)
            e[h] = k;
        else {
            l = k.type;
            if ("count" === l)
                (void 0 === e[h] && (e[h] = 0),
                ++e[h]);
            else if (void 0 !== k.value) {
                if ("array" === l) {
                    l = e[h];
                    m = k.adjust;
                    n = k.value;
                    l || (l = e[h] = []);
                    m && 0 < m.length && m.forEach(function(q) {
                        n[q] -= f || 0;
                    });
                    l.push(n);
                } else
                    e[h] = "sum" === l ? (e[h] || 0) + k.value : k.value;
            } else
                e[h] = k;
        }
    });
}
;
d = a(32687);


// Detected exports: kPa