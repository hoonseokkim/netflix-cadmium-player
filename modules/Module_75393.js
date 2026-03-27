/**
 * Netflix Cadmium Playercore - Module 75393
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 75393
// Parameters: t (module), b (exports), a (require)


var g, f, e, h, k, l, m, n, q;
function d(r, u) {
    var v, w;
    if (r.rd.Z.ba[u] && r.rd.Dc) {
        w = r.rd.Ib.$M(u);
        w && (w = r.rd.Ib.QI.Z.ba[w].J,
        (u = (0,
        m.WL)(u)) && (v = r.rd.Dc.od.QUa(w, u)));
    }
    return v;
}
function p(r, u, v, w) {
    var x;
    return u === k.jG.GR ? (u = f.I.ia,
    (null === w || void 0 === w ? void 0 : w.sld) === q.end && (u = f.I.Ca(null !== (x = v.rd.Z.ba[r].eb) && void 0 !== x ? x : 0),
    (0,
    e.assert)(0 < u.G, "EndTime must be non null")),
    v.yj.CH({
        offset: u,
        M: r
    }).M) : v.yj.JJ({
        offset: f.I.ia,
        M: r
    }).M;
}
function c(r, u, v) {
    return u === k.jG.IJ ? v.yj.JJ(r) : v.yj.CH(r);
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.gz = b.T3b = void 0;
g = a(22970);
f = a(91176);
e = a(52571);
t = a(42194);
h = a(50599);
k = a(49165);
l = a(6783);
m = a(14103);
n = a(57722);
a = (0,
h.ZQb)();
a = (0,
t.jtb)()({
    cJb: "combinedPlaygraph",
    dV: {
        ii: a()({
            map: c,
            mH: n.pEc
        }),
        Sd: a()({
            map: function(r, u, v, w) {
                var x, y;
                x = (null === w || void 0 === w ? 0 : w.vt) ? (0,
                n.wVa)(r, w.vt) : r.position;
                (null === w || void 0 === w ? 0 : w.ztb) && u === k.jG.IJ && (v.za.Z.ba[x.M] || (y = null));
                null !== y && (y = c(x, u, v));
                r = (0,
                n.KQa)(r, null === w || void 0 === w ? void 0 : w.vt);
                (null === w || void 0 === w ? 0 : w.vt) ? (0,
                n.tXc)(r, w.vt, y) : r.position = y;
                return r;
            },
            mH: function(r, u, v) {
                return (null === v || void 0 === v ? 0 : v.vt) ? (0,
                n.wVa)(r, v.vt) : (0,
                n.Sd)(r);
            }
        }),
        QF: a()({
            map: function(r, u, v, w) {
                var x;
                if (u === k.jG.GR)
                    return null !== (x = r.inner) && void 0 !== x ? x : r;
                u = (0,
                n.KQa)(r, null === w || void 0 === w ? void 0 : w.vt);
                null !== w && void 0 !== w && w.vt || (u.inner = r,
                "gctag" === ({
                    NODE_ENV: "production",
                    PLATFORM: "cadmium",
                    ASEBUILD: "release",
                    OBFUSCATE: "obfuscate",
                    BUILD_VERSION: "6.0055.939.911"
                }).U0b && (u.gctag = void 0));
                return u;
            },
            mH: function(r, u, v) {
                return (null === v || void 0 === v ? 0 : v.vt) ? "object" === typeof (0,
                n.wVa)(r, v.vt) : "object" === typeof r;
            }
        }),
        M: a()({
            map: p,
            mH: n.EEc
        }),
        Qga: a()({
            map: function(r, u, v, w) {
                var x, y;
                y = null !== (x = r.M) && void 0 !== x ? x : r.segmentId;
                u = p(y, u, v, w);
                return r.M ? g.__assign(g.__assign({}, r), {
                    M: u
                }) : g.__assign(g.__assign({}, r), {
                    segmentId: u
                });
            },
            mH: n.rBc
        }),
        U$: a()({
            map: function(r, u, v) {
                u === k.jG.GR ? (r = (0,
                l.Ds)(v.rd.Z, r.J, r.Ga, {
                    sRb: !0
                }),
                (0,
                e.assert)(void 0 !== r, "Graph position must exist in ux playgraph"),
                r = v.yj.CH(r),
                u = r.M,
                r = r.offset,
                u = v.za.Z.ba[u],
                v = u.J,
                u = u.Va,
                r = f.I.Ca(u).add(r)) : (r = (0,
                l.Ds)(v.za.Z, r.J, r.Ga, {
                    sRb: !0
                }),
                (0,
                e.assert)(void 0 !== r, "Graph position must exist in combined playgraph"),
                r = v.yj.JJ(r),
                u = r.M,
                r = r.offset,
                u = v.rd.Z.ba[u],
                v = u.J,
                u = u.Va,
                r = f.I.Ca(u).add(r));
                return {
                    Ga: r,
                    J: v
                };
            },
            mH: n.DDc
        }),
        HPa: a()({
            mH: n.tDc,
            map: function(r, u, v) {
                var w, x, y, A, z;
                w = v.za.Ib;
                x = v.rd.Ib;
                if (u === k.jG.GR) {
                    y = {
                        M: r.K.id,
                        offset: f.I.ia
                    };
                    A = v.yj.CH(y);
                    u = w.get(A.M);
                    (0,
                    e.assert)(u, "workingSegment on inner playgraph must exist");
                    x = x.get(y.M);
                    (0,
                    e.assert)(x, "equivalent workingSegment on outer playgraph must exist");
                    y = u.Ob;
                    v = r.Qd.add(u.nb.da(x.nb));
                    w = u.nb;
                    u = u.$b;
                    return {
                        Qd: v,
                        tU: r.bx.add(y),
                        bx: r.bx,
                        K: {
                            id: A.M,
                            nb: w,
                            $b: u
                        }
                    };
                }
                A = {
                    M: r.K.id,
                    offset: f.I.ia
                };
                y = v.yj.JJ(A);
                u = w.get(A.M);
                (0,
                e.assert)(u, "workingSegment on inner playgraph must exist");
                x = x.get(y.M);
                (0,
                e.assert)(x, "equivalent workingSegment on outer playgraph must exist");
                A = x.Ob;
                if (!A.isFinite()) {
                    z = v.yj.mxc(y);
                    (w = w.get(z)) && w.Ob.isFinite() && (A = v.yj.JJ({
                        M: z,
                        offset: w.Ob
                    }).offset);
                }
                y = r.bx.da(y.offset);
                z = y.add(A);
                v = r.Qd.add(x.nb.da(u.nb));
                w = x.nb;
                u = A.add(w);
                return {
                    Qd: v,
                    tU: z,
                    bx: y,
                    K: {
                        id: x.id,
                        nb: w,
                        $b: u
                    }
                };
            }
        }),
        Adc: a()({
            mH: function(r) {
                return "segmentPresenting" === r.type;
            },
            map: function(r, u, v) {
                var w, x;
                r = (0,
                n.KQa)(r);
                if ((u = r.metrics) && void 0 === u.adBreakLocationMs) {
                    w = d(v, u.destPosition.M);
                    void 0 !== w && (u.adBreakLocationMs = w.kj,
                    void 0 !== w.hb && (u.adBreakTriggerId = w.hb));
                    x = u.srcStartPosition;
                    x && v.za.Z.ba[x.M] && (w = d(v, x.M));
                    void 0 !== w && (u.srcadBreakLocationMs = w.kj,
                    void 0 !== w.hb && (u.srcadBreakTriggerId = w.hb));
                }
                return r;
            }
        })
    }
});
(function(r) {
    r[r.wcd = 0] = "beginning";
    r[r.end = 1] = "end";
}
)(q || (b.T3b = q = {}));
b.gz = a;


// Detected exports: gz, T3b