/**
 * Netflix Cadmium Playercore - Module 85696
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: xgb
 * Dependencies: 64274
 * Purpose: Utility module
 */

// import dep_64274 from './Module_64274.js';

// Webpack module 85696
// Parameters: t (module), b (exports), a (require)

var p;
class d {
    constructor(c, g, f, e, h) {
    this.kQa = c;
    this.j7a = g;
    this.R1c = f;
    this.c$ = e;
    this.Q8a = h;
}
    YMb(c) {
    var g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B;
    e = c.Aa;
    h = {
        correlationId: null !== (f = null === (g = e.FA) || undefined === g ? undefined : g.Sf) && undefined !== f ? f : "",
        ym: e.Ep ? "ads" : "content"
    };
    k = !!e.iC;
    g = this.kQa.PMb(e.$k, e.gk);
    f = this.j7a.fNb(h, e.Kt);
    c = this.R1c.LOc(e.aW);
    l = k ? this.c$.OMb(h, e.kn, f) : this.c$.sOc(h, e.kn, e.media, f);
    h = this.Q8a.iNb(h, e.il);
    m = h.find(function(C) {
        return k ? C.trackId === e.iC.eo : C.trackId === e.raa[0].eo;
    }) || h[0];
    n = this.c$.ydc(l) || l.find(function(C) {
        return k ? C.trackId === e.iC.ew : C.trackId === e.raa[0].ew;
    }) || l[0];
    q = this.j7a.m1c(n.sk) || f.find(function(C) {
        return k ? C.trackId === e.iC.Cz : C.trackId === e.raa[0].uUb;
    }) || n.sk[0];
    r = this.Q8a.zOc(e.il);
    u = e.de;
    v = e.Kb;
    w = e.Phc;
    x = e.iM;
    y = e.Is;
    A = e.kn.findIndex(function(C) {
        return C.ff == n.trackId;
    });
    z = e.il.findIndex(function(C) {
        return C.ff == m.trackId;
    });
    B = e.Kt.findIndex(function(C) {
        return C.ff == q.trackId;
    });
    return {
        JU: r,
        di: g,
        ul: l,
        Jz: h,
        sk: f,
        EJ: c,
        de: u,
        Kb: v,
        WWc: w,
        aT: x,
        Is: y,
        znc: A,
        Knc: z,
        Inc: B,
        saa: m,
        naa: n,
        paa: q
    };
}
    WBc(c, g, f) {
    var e, h, k, l, m, n;
    e = this;
    l = this.kQa.VBc(c.Aa.$k, c.Aa.gk, f.Aa.$k, f.Aa.gk);
    m = l.RWc;
    l = l.sHc;
    (0,
    p.bea)(c.Aa).$k = m;
    (0,
    p.bea)(c.Aa).gk = l;
    g.di = this.kQa.PMb(m, l);
    n = {
        correlationId: null !== (k = null === (h = f.Aa.FA) || undefined === h ? undefined : h.Sf) && undefined !== k ? k : "",
        ym: f.Aa.Ep ? "ads" : "content"
    };
    f = f.Aa;
    h = f.kn;
    k = f.il;
    f.Kt.forEach(function(q) {
        var r;
        if (q.De) {
            r = e.d4a(c.Aa.Kt, g.sk, q, function(u) {
                return e.j7a.fNb(n, [u])[0];
            });
            r && g.ul.forEach(function(u) {
                var v;
                u = u.sk;
                v = u.findIndex(function(w) {
                    return w.trackId === r.trackId;
                });
                -1 !== v && (u[v] = r);
            });
        }
    });
    h.forEach(function(q) {
        q.De && e.d4a(c.Aa.kn, g.ul, q, function(r) {
            return e.c$.OMb(n, [r], g.sk)[0];
        });
    });
    k.forEach(function(q) {
        q.De && e.d4a(c.Aa.il, g.Jz, q, function(r) {
            return e.Q8a.iNb(n, [r])[0];
        });
    });
    return {
        S: c,
        dd: g
    };
}
    NVc(c, g) {
    return this.c$.$sc(c, g);
}
    d4a(c, g, f, e) {
    var h, k, l, m;
    h = c.findIndex(function(n) {
        return n.ff === f.ff;
    });
    k = -1 !== h ? c[h] : undefined;
    l = g.findIndex(function(n) {
        return n.trackId === f.ff;
    });
    m = -1 !== l ? g[l] : undefined;
    if (k && !k.De && m && !m.De)
        return (e = e(f),
        c[h] = f,
        g[l] = e);
}
}
p = a(64274);
export const xgb = d;

// Detected exports: xgb
