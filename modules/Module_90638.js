/**
 * Netflix Cadmium Playercore - Module 90638
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 45578, 76122, 79809
 * Purpose: Logging, Configuration, Class definition
 */

// import dep_45578 from './Module_45578.js';
// import dep_76122 from './Module_76122.js';
// import dep_79809 from './Module_79809.js';

// Webpack module 90638
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k, l, m, n, q;
function d(r, u) {
    this.Tn = r;
    this.Mq = u;
}
class p {
    constructor(r) {
    this.ub = r;
    this.reset();
}
    reset() {
    this.rpb = undefined;
    this.po = [];
    this.kpb = this.lpb = false;
}
    update(r, u) {
    var v;
    this.po && (this.po = this.po.filter(this.HYc, this));
    if (false === this.lpb) {
        v = e(r.xc).slice(0, f.Owb);
        0 < v.length && (this.JT(v, g.YF.sq),
        this.lpb = true,
        this.po = this.cW(v.concat(this.po)));
    }
    false === this.kpb && (v = h(r.xc).slice(0, f.Owb),
    0 < v.length && (this.JT(v, g.YF.sq),
    this.kpb = true,
    this.po = this.cW(v.concat(this.po))));
    switch (u) {
    case g.SF.Rcb:
        u = this.DAc(r);
        break;
    case g.SF.Wkb:
        u = this.SAc(r);
        break;
    case g.SF.Ula:
        u = this.TAc(r);
        break;
    case g.SF.P7:
        u = this.NAc(r);
        break;
    default:
        u = this.zAc(r);
    }
    this.rpb = r;
    return u;
}
    DAc(r) {
    r = l(r.xc, f.WQb, f.Jub);
    this.JT(r, g.YF.sq);
    return this.po = this.cW(this.po.concat(r));
}
    SAc(r) {
    var u, v;
    this.ub.log("handleScrollHorizontal");
    u = r.xc;
    r = l(u, f.XQb, f.Lub);
    v = k(u, this.rpb.xc);
    u = u[v].list.slice(0, f.zVc);
    u.concat(r);
    this.JT(u, g.YF.bLa);
    return this.cW(u.concat(this.po));
}
    JT(r, u) {
    r.forEach(function(v) {
        if (undefined === v.qL || v.qL < u)
            v.qL = u;
        undefined === v.AO && (v.AO = c());
        undefined === v.zp && (v.zp = c());
    });
}
    TAc(r) {
    this.ub.log("handleSearch");
    r = m(r.xc, f.fWc);
    this.JT(r, g.YF.Xkb);
    this.po = r.concat(this.po);
    return this.po = this.cW(this.po);
}
    NAc(r) {
    var u, v, w, x, y;
    this.ub.log("handlePlayFocus: ", f.Kca);
    u = r.direction;
    v = r.xc;
    r = [];
    w = q(v);
    if (undefined !== w.Tn)
        switch ((r.push(w),
        u)) {
        case g.XC.xkb:
            for (u = 1; u < f.Kca; u++)
                r.push(new d(w.Tn,w.Mq + u));
            r.push(new d(w.Tn - 1,w.Mq));
            r.push(new d(w.Tn + 1,w.Mq));
            break;
        case g.XC.ifb:
            for (u = 1; u < f.Kca; u++)
                r.push(new d(w.Tn,w.Mq - u));
            r.push(new d(w.Tn - 1,w.Mq));
            r.push(new d(w.Tn + 1,w.Mq));
            break;
        case g.XC.Q6b:
            r.push(new d(w.Tn - 1,w.Mq));
            for (u = 1; u <= f.Kca / 2; u++)
                (r.push(new d(w.Tn,w.Mq + u)),
                r.push(new d(w.Tn,w.Mq - u)));
            break;
        case g.XC.c0b:
            for ((r.push(new d(w.Tn + 1,w.Mq)),
            u = 1); u <= f.Kca / 2; u++)
                (r.push(new d(w.Tn,w.Mq + u)),
                r.push(new d(w.Tn,w.Mq - u)));
        }
    x = [];
    r.forEach(function(A) {
        y = n(v, A.Tn, A.Mq);
        undefined !== y && x.push(y);
    });
    this.JT(x, g.YF.bLa);
    return this.cW(x.concat(this.po));
}
    zAc(r) {
    this.ub.log("ModelOne: handleDefaultCase");
    r = l(r.xc, f.XQb, f.Lub);
    this.JT(r, g.YF.bLa);
    return this.cW(r.concat(this.po));
}
    HYc(r) {
    return r.qL == g.YF.sq | r.qL == g.YF.Xkb & c() - r.AO < f.HBc;
}
    cW(r) {
    var u, v, w, x, y, A, z;
    u = [];
    v = {};
    x = 0;
    y = r.length;
    for (w = 0; w < y; w++) {
        A = r[w].J;
        z = r[w];
        false === (A in v) ? (u.push(z),
        v[A] = x,
        x++) : (A = u[v[A]],
        z.zp < A.zp && (A.zp = z.zp),
        z.qL > A.qL && (A.qL = z.qL),
        z.AO > A.AO && (A.AO = z.AO));
    }
    return u;
}
}
c = a(79809);
g = a(45578);
b = a(76122);
f = a(94030).config;
e = b.Vvc;
h = b.uvc;
k = b.soc;
l = b.HLc;
m = b.GLc;
n = b.FLc;
q = b.iAb;
p.prototype.constructor = p;
t.exports = p;

