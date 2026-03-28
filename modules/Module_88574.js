/**
 * Netflix Cadmium Playercore - Module 88574
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ilb, Li, Qn
 * Dependencies: 36129, 65473, 75864, 79048, 85001
 * Purpose: Buffer/Segment management, Logging, Error handling, Playback control
 */

// import dep_36129 from './Module_36129.js';
// import dep_65473 from './Module_65473.js';
// import dep_75864 from './Module_75864.js';
// import dep_79048 from './Module_79048.js';
// import dep_85001 from './Module_85001.js';

// Webpack module 88574
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
class d extends f.MP {
    constructor(h, k, l, m, n, q, r) {
    var u;
    u = f.MP.call(this, k, l, n, q, r) || this;
    u.Hl = h;
    u.va = m;
    u.ov = n;
    u.zAb = false;
    u.yTa = new Map();
    u.RMc = function() {
        u.bI().EOa(c.ja.iO, function(v) {
            u.Xb.qd(c.JX.Rga, {
                player: u.ov.bI()
            });
            u.rexport const Li = v.position.segmentId;
        });
    }
    ;
    u.DCc();
    q.addListener(c.cb.loaded, u.RMc);
    return u;
}
    erb(h) {
    var k, l, m, n, q, r, u, v, w, x, y;
    k = this;
    m = this.rb.Qn;
    n = this.ur.xy(h.R, "ident");
    q = this.ur.xy(h.R, "main");
    r = this.ur.xy(h.R, "credits");
    u = isFinite(h.Cj);
    v = isFinite(h.Nb) && h.R !== m.ba[m.Ef].J;
    w = {};
    x = new p.Cv(m).cf(q, Object.assign({
        J: h.R,
        Va: v && h.Nb || 0,
        eb: null !== (l = h.Cj) && undefined !== l ? l : Infinity
    }, u ? {
        next: (w[r] = {},
        w),
        Oc: r
    } : {}));
    v && (l = {},
    x.cf(n, {
        J: h.R,
        Va: 0,
        eb: h.Nb,
        next: (l[q] = {},
        l),
        Oc: q
    }));
    u && x.cf(r, {
        J: h.R,
        Va: h.Cj,
        eb: Infinity
    });
    if (!this.rb.hO(q)) {
        h = m.ba[this.ur.lCb(m)].J;
        y = this.ur.xy(h, e.V7.Eab);
        [this.ur.xy(h, e.V7.ZGa), y].filter(function(A) {
            return k.rb.hO(A);
        }).forEach(function(A) {
            var z, B, C;
            z = k.rb.Hu(A);
            B = A === y || k.Hl.gya;
            C = {};
            x.cf(A, Object.assign({}, z, {
                next: Object.assign({}, z.next, (C[q] = {},
                C))
            }, B ? {
                Oc: q
            } : {}));
        });
    }
    this.rexport const Qn = x.build();
    return this.DU(q);
}
    t1a() {}
    ZT(h) {
    this.bI().ZT(h);
}
    eXa(h, k, l) {
    k = undefined === k ? {} : k;
    this.va.debug("goToSegment " + h);
    return this.bI().xca(h, k, l);
}
    DU(h) {
    if (h === this.jWc)
        return null;
    this.jWc = h;
    return this.zAb ? this.Im.KS(this.rb.Hu(h).J).BSc : (this.zAb = true,
    f.MP.prototype.DU.call(this, h));
}
    QVb(h) {
    return h.errorCode && this.yTa.has(h.errorCode) ? this.yTa.get(h.errorCode)(h) : Promise.reject(Error("Error " + h.errorCode + " isn't recoverable"));
}
    DCc() {
    var h;
    h = this;
    this.yTa.set(g.ea.uib, function() {
        var k, l;
        return null !== (l = null === (k = f.MP.prototype.DU.call(h, h.rb.Li)) || undefined === k ? undefined : k.then(function() {
            var m, n;
            f.MP.prototype.eXa.call(h, h.rb.Li, null !== (n = null === (m = h.Im.KS(h.rb.ga.J)) || undefined === m ? undefined : m.Xa) && undefined !== n ? n : {});
        })) && undefined !== l ? l : Promise.reject(Error("Couldn't prepare segment for transition"));
    });
}
}
p = a(79048);
c = a(85001);
g = a(36129);
f = a(65473);
e = a(75864);
d.prototype.$E = function() {
    this.Ws() && this.bI().$E();
}
;
export const Ilb = d;

// Detected exports: Ilb, Li, Qn
