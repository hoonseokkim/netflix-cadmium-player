/**
 * Netflix Cadmium Playercore - Module 19484
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: xGa
 * Dependencies: 2248, 4203, 22674, 22970, 32573, 47737, 49745, 50323, 54973, 56039, 82100, 87386, 92395
 * Purpose: DRM/License handling, Network/HTTP, Manifest handling, Video handling
 */

// import dep_2248 from './Module_2248.js';
// import dep_4203 from './Module_4203.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_32573 from './Module_32573.js';
// import dep_47737 from './Module_47737.js';
// import dep_49745 from './Module_49745.js';
// import dep_50323 from './Module_50323.js';
// import dep_54973 from './Module_54973.js';
// import dep_56039 from './Module_56039.js';
// import dep_82100 from './Module_82100.js';
// import dep_87386 from './Module_87386.js';
// import dep_92395 from './Module_92395.js';

// Webpack module 19484
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n, q, r;
class d {
    constructor(u, v, w, x, y, A) {
    this.Gic = v;
    this.Pd = w;
    this.hpc = x;
    this.a2 = y;
    this.Kh = A;
    this.log = u.zb("VideoPreparer");
}
    fetch(u, v) {
    var w;
    w = this;
    this.log.trace("Fetching LDL", (0,
    l.jFa)(u));
    this.R = u.R;
    this.yg = v;
    return v.Gba(u.R, "ldl").then(function(x) {
        return x.Tza;
    }).catch(function() {
        w.log.trace("Requesting a new license", (0,
        l.jFa)(u));
        return w.Kh.Hba(u.R).then(function(x) {
            var y, A, z, B, C, D, E;
            w.Aa = x.Aa;
            if (v.fEb(u.R))
                return v.Gba(u.R, "ldl").then(function(G) {
                    return G.Tza;
                });
            y = w.yg.yYc(u.R, w.Aa);
            if (y)
                throw {
                    status: y
                };
            A = w.Aa.il[0];
            y = A.uya;
            z = A.dyb;
            A = A.streams[0].Es;
            B = (0,
            n.XFb)(A);
            C = (y ? y : [z]).map(function(G) {
                return w.Pd.decode(G.bytes);
            });
            D = (0,
            r.Yba)(w.Gic(), true, u.h1);
            E = w.hpc().then(function(G) {
                var F, H, J;
                J = {
                    type: D,
                    initData: C,
                    Zta: B,
                    wB: (0,
                    q.JVa)(w.Aa.il[0].streams),
                    kt: {
                        R: u.R,
                        Ia: v.NRa(u.R),
                        de: w.Aa.de,
                        Is: w.Aa.Is,
                        Kp: x.Kp,
                        rf: w.Aa.rf,
                        eo: null !== (H = null === (F = w.Aa.iC) || undefined === F ? undefined : F.eo) && undefined !== H ? H : w.Aa.il[0].ff
                    }
                };
                return G.Vu(J, w.a2());
            }).catch(function(G) {
                w.handleError("Unable to prepare an EME session.", G);
                throw G;
            });
            w.yg.dXc(u.R, {
                Tza: E,
                QZa: {
                    source: "videopreparer",
                    type: D
                }
            }, function() {
                if (!w.yg.R8a(u.R))
                    try {
                        E.then(function(G) {
                            return G.close();
                        }).catch(function(G) {
                            w.handleError("Unable to cleanup LDL session, Unable to get the session.", G);
                        });
                    } catch (G) {
                        w.handleError("Unable to cleanup LDL session, unexpected exception.", G);
                    }
            });
            return E;
        }).catch(function(x) {
            w.log.warn("Manifest not available for ldl request", x);
            if (undefined !== x.status)
                throw x;
            throw {
                status: k.Yr.fd
            };
        });
    });
}
    handleError(u, v) {
    this.log.warn(u + " LDL is now invalid.", v);
    this.yg.Fhc(this.R);
    this.yg.zub(this.R);
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(4203);
f = a(2248);
e = a(47737);
h = a(92395);
k = a(32573);
l = a(50323);
m = a(49745);
n = a(82100);
q = a(56039);
r = a(54973);
a = d;
export const xGa = a;
export const xGa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(g.Pc)), t.__param(2, (0,
p.v)(f.Km)), t.__param(3, (0,
p.v)(e.aka)), t.__param(4, (0,
p.v)(h.D7)), t.__param(5, (0,
p.v)(m.tX))], a);

// Detected exports: xGa
