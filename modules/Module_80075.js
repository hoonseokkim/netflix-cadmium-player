/**
 * Netflix Cadmium Playercore - Module 80075
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: uEa
 * Dependencies: 10060, 22674, 22970, 23563, 24735, 63156, 69493, 77134, 87386, 92395
 * Purpose: DRM/License handling, Video handling, Logging, Configuration
 */

// import dep_10060 from './Module_10060.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_23563 from './Module_23563.js';
// import dep_24735 from './Module_24735.js';
// import dep_63156 from './Module_63156.js';
// import dep_69493 from './Module_69493.js';
// import dep_77134 from './Module_77134.js';
// import dep_87386 from './Module_87386.js';
// import dep_92395 from './Module_92395.js';

// Webpack module 80075
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
class d {
    constructor(n, q, r, u, v, w) {
    var x;
    x = this;
    this.IU = q;
    this.config = r;
    this.bqc = u;
    this.a2 = v;
    this.qr = w;
    this.W_c = function(y, A) {
        var z;
        x.qr.mark(m.Pa.lka, y.kt.Ia, "generate-challenge");
        z = false;
        A.CXc(function(B) {
            z || (z = true,
            x.qr.mark(m.Pa.kka, y.kt.Ia, "generate-challenge"));
            x.qxc(y, A, B).then(function(C) {
                A.Pqb(C);
            }).catch(function(C) {
                return A.Gac(C);
            });
        });
    }
    ;
    this.log = n.zb("DrmServices");
    this.config.sFb && this.vRa(v(), e.Tr.$r).then(function(y) {
        return y.close();
    });
}
    Huc(n, q) {
    return this.vRa(q, n.type, n.wB).then(function(r) {
        return r.Kuc(n.initData, n.Zta).then(function(u) {
            return [r, {
                KR: r.kE(),
                data: u.rL
            }];
        });
    });
}
    Vu(n, q) {
    var r;
    r = this;
    this.log.info("Requesting challenges", this.oCb(n, n.type));
    return this.vRa(q, n.type, n.wB).then(function(u) {
        r.uKb(n, u);
        return u.Luc(n.initData, n.Zta).then(function() {
            return u;
        });
    });
}
    uKb(n, q) {
    q.PXc(n.kt);
    this.W_c(n, q);
}
    oCb(n, q) {
    return {
        movieId: n.kt.R,
        videoTrackId: n.kt.eo,
        xid: n.kt.Ia,
        type: (0,
        e.QHb)(q)
    };
}
    qxc(n, q, r) {
    this.log.info("Sending license request", this.oCb(n, r.Ti));
    return this.IU.Vu({
        Ia: n.kt.Ia,
        de: n.kt.de,
        cyb: [n.kt.Is],
        rL: [{
            sessionId: q.zS() || "session",
            data: r.rL
        }],
        Ti: r.Ti,
        KR: q.kE(),
        Ltb: r.Ltb,
        Kp: n.kt.Kp,
        rf: n.kt.rf,
        J: n.kt.R,
        eo: n.kt.eo
    });
}
    vRa(n, q, r) {
    return this.bqc.create().then(function(u) {
        return u.createSession(n, q, r).then(function() {
            return u;
        });
    });
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(69493);
f = a(77134);
e = a(24735);
h = a(23563);
k = a(10060);
l = a(92395);
m = a(63156);
a = d;
export const uEa = a;
export const uEa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(g.Qbb)), t.__param(2, (0,
p.v)(h.SC)), t.__param(3, (0,
p.v)(k.xcb)), t.__param(4, (0,
p.v)(l.D7)), t.__param(5, (0,
p.v)(f.H7))], a);

// Detected exports: uEa
