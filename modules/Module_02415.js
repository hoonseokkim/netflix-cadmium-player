/**
 * Netflix Cadmium Playercore - Module 2415
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: bJa
 * Dependencies: 22970, 52571, 65161, 99548
 * Purpose: Buffer/Segment management, Logging, Configuration, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_52571 from './Module_52571.js';
// import dep_65161 from './Module_65161.js';
// import dep_99548 from './Module_99548.js';

// Webpack module 2415
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(65161);
c = a(52571);
g = a(99548);
t = (function() {
    class f {
    constructor(e) {
        var h, k, l, m, n, q, r;
        h = e.console;
        k = e.config;
        l = e.L;
        m = e.oe;
        n = e.K;
        q = e.qa;
        r = e.wa;
        e = e.splice;
        this.qM = this.EZ = false;
        this.console = h;
        this.config = k;
        this.oe = m;
        this.L = l;
        this.K = n;
        this.qa = q;
        this.wa = r;
        this.splice = e;
        this.console.trace("PipelineNormalizer ctor:", this.oe.map(function(u) {
            return u.mediaType;
        }));
    }
    normalize() {
        var e, h;
        if (this.EZ)
            throw Error("Cannot call normalize() after cleanup");
        if (this.qM)
            throw Error("Cannot call init() / normalize() twice");
        this.qM = true;
        (0,
        c.assert)(this.Fbc());
        e = this.E0a();
        h = false;
        this.K && !this.K.kz && (h = this.F0a());
        this.Ue();
        return {
            Bqa: e,
            ER: h
        };
    }
    VN(e, h) {
        (0,
        c.assert)(this.qM, "expected to be called init() before renormalize");
        this.K = e;
        this.wa = h;
        e = (0,
        g.eQb)(this.config, this.oe, this.wa);
        this.F0a();
        return e;
    }
    Ue() {
        this.EZ || (this.EZ = true);
    }
    Fbc() {
        return this.oe.every(function(e) {
            return e.track.vh;
        });
    }
    E0a() {
        var e, h, k, l, m, n, q, r, u, v, w, x;
        e = this.oe.get(p.l.V);
        h = this.oe.get(p.l.U);
        k = this.oe.get(p.l.Ea);
        l = d.__read(h ? this.D0a(h, this.qa, this.wa, this.splice) : [false], 3);
        m = l[0];
        n = l[1];
        l = l[2];
        q = d.__read(e ? this.D0a(e, m && undefined !== (null === n || undefined === n ? undefined : n.qa) ? n.qa : this.qa, undefined !== (null === l || undefined === l ? undefined : l.wa) ? l.wa : this.wa, this.splice) : [false], 3);
        r = q[0];
        u = q[1];
        q = q[2];
        v = d.__read(k ? this.D0a(k, this.qa, this.wa, this.splice) : [false], 3);
        w = v[0];
        x = v[1];
        v = v[2];
        r && (null === e || undefined === e ? undefined : e.Wca(u, q));
        m && (null === h || undefined === h ? undefined : h.Wca(n, l));
        w && (null === k || undefined === k ? undefined : k.Wca(x, v));
        return m || undefined === this.oe.get(p.l.U) && r;
    }
    D0a(e, h, k, l) {
        var m, n;
        n = null === (m = e.ma.parent) || undefined === m ? undefined : m.$d(e.mediaType);
        h = e.Kc || e.track.Bw(this.config, h, null === n || undefined === n ? undefined : n.Lc, l);
        k = e.Lc || e.track.RL(this.config, k, e.Xn);
        return [!e.ag(), h, k];
    }
    F0a() {
        (0,
        c.assert)(this.K, "missing segment");
        return this.Rxb(this.K.nb);
    }
    Rxb(e) {
        var h;
        (0,
        c.assert)(this.K, "missing segment");
        h = this.oe.wr;
        if (undefined === (0,
        g.YKc)(this.config, h, e) || undefined === h.wa)
            return false;
        e = this.config.Bia && "lazy" === this.K.fe ? (0,
        g.oIc)(this.console, this.K, this.oe) : [];
        this.K.CSb(e);
        return true;
    }
}
return f;
}
)();
export const bJa = t;

// Detected exports: bJa
