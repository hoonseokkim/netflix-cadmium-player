/**
 * Netflix Cadmium Playercore - Module 18048
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: eOb
 */

// Webpack module 18048
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function eOb(g, f, e, h, k) {
    var l, m, n, q, r, u, v, w, x;
    q = f.fl;
    r = e && e.Ve;
    u = g.Ta;
    r = (0,
    c.XH)(f, u, r);
    v = g.Db;
    g = v && v.sb && v.sb.Fa || 0;
    u = f.yl - f.Ld;
    f = f.jq;
    w = null !== (n = null === (m = null === (l = d.platform.Yfd) || undefined === l ? undefined : l.call(d.platform)) || undefined === m ? undefined : m[e.mediaType === p.l.U ? 1 : 0]) && undefined !== n ? n : -1;
    e = e && e.bn;
    l = d.platform.time.fa();
    h = {
        fl: q,
        em: r,
        BLc: g,
        htb: u,
        HPc: w,
        Dz: h,
        wO: l,
        Jec: f,
        bn: e
    };
    if (v && k && 0 < k.length) {
        x = [];
        k.forEach(function(y) {
            var A;
            A = y.stat;
            A = (y = v[y.filter]) && y[A];
            x.push(isNaN(A) ? -1 : A);
        });
        h.hQc = x;
    }
    return h;
}
;
d = a(66164);  // import from Module_66164
p = a(65161);  // import from Module_65161
c = a(732

// Detected exports: eOb
