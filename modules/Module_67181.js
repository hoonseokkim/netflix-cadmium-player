/**
 * Netflix Cadmium Playercore - Module 67181
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 67181
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

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
                return true;
            },
            enumerable: false,
            configurable: true
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
            N = null === (h = null === (e = L.$d(p.l.V)) || undefined === e ? undefined : e.El) || undefined === h ? undefined : h.Hb;
            e = null === (l = null === (k = L.$d(p.l.U)) || undefined === k ? undefined : k.El) || undefined === l ? undefined : l.Hb;
            k = null === (n = null === (m = L.$d(p.l.Ea)) || undefined === m ? undefined : m.El) || undefined === n ? undefined : n.Hb;
            m = null === (r = null === (q = O.cg) || undefined === q ? undefined : q.ut) || undefined === r ? undefined : r.PM;
            q = null === (w = null === (v = null === (u = K.cx.get(p.l.V)) || undefined === u ? undefined : u.d0(c.OW)) || undefined === v ? undefined : v.kca()) || undefined === w ? undefined : w.md;
            u = null === (A = null === (y = null === (x = K.cx.get(p.l.U)) || undefined === x ? undefined : x.d0(c.OW)) || undefined === y ? undefined : y.kca()) || undefined === A ? undefined : A.md;
            x = null === (C = null === (B = null === (z = K.cx.get(p.l.Ea)) || undefined === z ? undefined : z.d0(c.OW)) || undefined === B ? undefined : B.kca()) || undefined === C ? undefined : C.md;
            return {
                kUb: N,
                F_c: N ? null === (D = null === I || undefined === I ? undefined : I.dI(N)) || undefined === D ? undefined : D.name : undefined,
                uOb: q,
                OQc: q ? null === (E = null === I || undefined === I ? undefined : I.dI(q)) || undefined === E ? undefined : E.name : undefined,
                oUb: e,
                I_c: e ? null === (G = null === I || undefined === I ? undefined : I.dI(e)) || undefined === G ? undefined : G.name : undefined,
                wOb: u,
                RQc: u ? null === (F = null === I || undefined === I ? undefined : I.dI(u)) || undefined === F ? undefined : F.name : undefined,
                nUb: k,
                H_c: k ? null === (H = null === I || undefined === I ? undefined : I.dI(k)) || undefined === H ? undefined : H.name : undefined,
                vOb: x,
                QQc: x ? null === (J = null === I || undefined === I ? undefined : I.dI(x)) || undefined === J ? undefined : J.name : undefined,
                lUb: m,
                G_c: m ? null === (M = null === I || undefined === I ? undefined : I.dI(m)) || undefined === M ? undefined : M.name : undefined
            };
        }
    }
    ;
    return f;
}
)();
export const Jab = t;

// Detected exports: Jab