/**
 * Netflix Cadmium Playercore - Module 67181
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 67181
// Parameters: t (module), b (exports), a (require)


var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Jab = void 0;
d = a(91176);
p = a(65161);
c = a(89527);
g = a(91967);
t = (function() {
    function f(e, h, k) {
        this.ka = e;
        this.di = h;
        this.config = k;
        this.ic = "CdnReporter";
    }
    Object.defineProperties(f.prototype, {
        enabled: {
            get: function() {
                return !0;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    f.prototype.Ph = function(e) {
        var h, k, l;
        h = this;
        k = e.Ui;
        l = e.Xs;
        e = {};
        (l === g.Od.vw || l === g.Od.WS || l === g.Od.uI || l === g.Od.VI || l === g.Od.mv || l === g.Od.aq) && (l = this.Iba()) && (e.cdnidinfo = {
            audio: {
                streaming_cdn_id: l.kUb,
                streaming_cdn_name: l.F_c,
                presenting_cdn_id: l.uOb,
                presenting_cdn_name: l.OQc
            },
            video: {
                streaming_cdn_id: l.oUb,
                streaming_cdn_name: l.I_c,
                presenting_cdn_id: l.wOb,
                presenting_cdn_name: l.RQc
            },
            text: {
                streaming_cdn_id: l.nUb,
                streaming_cdn_name: l.H_c,
                presenting_cdn_id: l.vOb,
                presenting_cdn_name: l.QQc
            },
            mediaevents: {
                streaming_cdn_id: l.lUb,
                streaming_cdn_name: l.G_c
            }
        });
        this.config.xgc && k === g.Sc.Wj && (e.cdndldist = JSON.stringify((0,
        d.pcc)(Object.keys(this.di).map(function(m) {
            var n;
            n = h.di[m];
            return Object.keys(n).map(function(q) {
                var r;
                r = n[q];
                return {
                    cdnid: r.Gk,
                    pbcid: r.Sf,
                    dls: Object.keys(r.yo).map(function(u) {
                        var v, w;
                        u = r.yo[u];
                        w = u.mediaType === p.l.V ? "adlid" : "dlid";
                        return (v = {
                            tm: u.totalTime,
                            bitrate: u.bitrate
                        },
                        v[w] = u.ob,
                        v.vf = u.Wb,
                        v);
                    })
                };
            });
        }))));
        return e;
    }
    ;
    f.prototype.LUa = function() {
        var e;
        e = this.Iba();
        if (e)
            return {
                C$: {
                    audio: {
                        Bha: e.kUb,
                        pya: e.uOb
                    },
                    video: {
                        Bha: e.oUb,
                        pya: e.wOb
                    },
                    zJ: {
                        Bha: e.nUb,
                        pya: e.vOb
                    },
                    Lva: {
                        Bha: e.lUb
                    }
                }
            };
    }
    ;
    f.prototype.Iba = function() {
        var e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N;
        K = this.ka.player;
        if (K.Sd) {
            L = K.bC;
            O = L.L;
            I = O.gj;
            N = null === (h = null === (e = L.$d(p.l.V)) || void 0 === e ? void 0 : e.El) || void 0 === h ? void 0 : h.Hb;
            e = null === (l = null === (k = L.$d(p.l.U)) || void 0 === k ? void 0 : k.El) || void 0 === l ? void 0 : l.Hb;
            k = null === (n = null === (m = L.$d(p.l.Ea)) || void 0 === m ? void 0 : m.El) || void 0 === n ? void 0 : n.Hb;
            m = null === (r = null === (q = O.cg) || void 0 === q ? void 0 : q.ut) || void 0 === r ? void 0 : r.PM;
            q = null === (w = null === (v = null === (u = K.cx.get(p.l.V)) || void 0 === u ? void 0 : u.d0(c.OW)) || void 0 === v ? void 0 : v.kca()) || void 0 === w ? void 0 : w.md;
            u = null === (A = null === (y = null === (x = K.cx.get(p.l.U)) || void 0 === x ? void 0 : x.d0(c.OW)) || void 0 === y ? void 0 : y.kca()) || void 0 === A ? void 0 : A.md;
            x = null === (C = null === (B = null === (z = K.cx.get(p.l.Ea)) || void 0 === z ? void 0 : z.d0(c.OW)) || void 0 === B ? void 0 : B.kca()) || void 0 === C ? void 0 : C.md;
            return {
                kUb: N,
                F_c: N ? null === (D = null === I || void 0 === I ? void 0 : I.dI(N)) || void 0 === D ? void 0 : D.name : void 0,
                uOb: q,
                OQc: q ? null === (E = null === I || void 0 === I ? void 0 : I.dI(q)) || void 0 === E ? void 0 : E.name : void 0,
                oUb: e,
                I_c: e ? null === (G = null === I || void 0 === I ? void 0 : I.dI(e)) || void 0 === G ? void 0 : G.name : void 0,
                wOb: u,
                RQc: u ? null === (F = null === I || void 0 === I ? void 0 : I.dI(u)) || void 0 === F ? void 0 : F.name : void 0,
                nUb: k,
                H_c: k ? null === (H = null === I || void 0 === I ? void 0 : I.dI(k)) || void 0 === H ? void 0 : H.name : void 0,
                vOb: x,
                QQc: x ? null === (J = null === I || void 0 === I ? void 0 : I.dI(x)) || void 0 === J ? void 0 : J.name : void 0,
                lUb: m,
                G_c: m ? null === (M = null === I || void 0 === I ? void 0 : I.dI(m)) || void 0 === M ? void 0 : M.name : void 0
            };
        }
    }
    ;
    return f;
}
)();
b.Jab = t;


// Detected exports: Jab