/**
 * Netflix Cadmium Playercore - Module 13889
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: qlb
 * Dependencies: 5021, 8825, 32687, 85001
 * Purpose: Logging, Configuration, Enum definitions
 */

// import dep_5021 from './Module_5021.js';
// import dep_8825 from './Module_8825.js';
// import dep_32687 from './Module_32687.js';
// import dep_85001 from './Module_85001.js';

// Webpack module 13889
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e, h, k) {
    this.config = e;
    this.j = h;
    this.Jh = k;
    this.Y2 = this.jU = undefined;
    this.nfa = false;
    this.log = this.Jh.zb();
}
    Txc(e, h, k, l, m) {
    var n, q, r, u, v;
    k = undefined === k ? this.j.M : k;
    n = h === p.Tc.PX || h === p.Tc.Ska;
    l = (undefined === l ? false : l) || this.qEc();
    q = this.Rfc(n ? e : this.Bhc(e, k), h, l, k);
    r = this.j.fb;
    n ? (e = q,
    q = r.kRa(q)) : e = r.mRa(k, q);
    h === p.Tc.cp && (this.j.Ysb = q);
    m = this.vl(e, h, m);
    u = (n = n || m) ? e : q;
    if (this.j.mt) {
        v = this.j.qb.bh ? this.config().F1a : this.config().wN;
        this.j.iEb(u, v) || h !== p.Tc.Dv && h !== p.Tc.lX || (u = this.j.mt.na(c.Ba) - v - 1E3,
        n ? (e = u,
        q = r.kRa(u)) : (e = r.mRa(k, u),
        q = u));
    }
    return {
        OT: u,
        em: q,
        EPc: e,
        vl: m,
        eF: l
    };
}
    Rfc(e, h, k, l) {
    k ? e = Math.round(e) : (k = this.j.fb.Atc(e, l),
    e = (0,
    f.wc)(k) ? k : Math.round(e));
    this.j.qb.bh && (e = this.euc(e));
    this.config().vRb && 0 !== e && h !== p.Tc.cp && (e += this.config().vRb);
    return e;
}
    vl(e, h, k) {
    if (this.config().Foc || h === p.Tc.cp || h === p.Tc.m8 || h === p.Tc.jka || !k || e < k.start.na(c.Ba) || e >= k.end.na(c.Ba))
        return false;
    h = this.j.fb;
    return (null === h || undefined === h ? undefined : h.Ck) && h.vl(e) || false;
}
    qEc() {
    return this.j.qb.bh || this.j.Hc.Da ? (false,
    true) : "boolean" === typeof this.j.qb.eF ? this.j.qb.eF : navigator.hardwareConcurrency && 2 >= navigator.hardwareConcurrency ? this.config().eF && this.config().fQc : this.config().eF;
}
    Bhc(e, h) {
    var k;
    k = this.j.mm(h);
    h = k.vH;
    k = k.AJb;
    false;
    h = k || h;
    k = this.j.Hc.Da && !this.j.Hc.ZS() ? 0 : this.config().X4c;
    h = Math.max(0, h.na(c.Ba) - k);
    return (0,
    g.oG)(e, 0, h);
}
    euc(e) {
    var h, k, l;
    h = this.j.Jba();
    if (Object.values(h).find(function(m) {
        var n;
        n = m.eb;
        n = e < (null !== n && undefined !== n ? n : Infinity);
        return m.Va <= e && n;
    }))
        return (false,
        e);
    l = e;
    Object.entries(h).forEach(function(m) {
        var n;
        m = Fa(m);
        m.next();
        m = m.next().value.Va;
        n = m - e;
        0 < n && (undefined === k || n < k) && (k = n,
        l = m);
    });
    false;
    return l;
}
}
p = a(85001);
c = a(5021);
g = a(8825);
f = a(32687);
Ha.Object.defineProperties(d.prototype, {
    sda: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.nfa || !!this.Y2 || !!this.jU;
        }
    }
});
export const qlb = d;

// Detected exports: qlb
