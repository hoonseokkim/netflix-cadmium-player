/**
 * Netflix Cadmium Playercore - Module 24606
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: DKa, pP
 * Dependencies: 9842, 22970, 54366, 61996
 * Purpose: Encryption/Decryption, Logging, Configuration, Parsing/Serialization
 */

// import dep_9842 from './Module_9842.js';
// import dep_22970 from './Module_22970.js';
// import dep_54366 from './Module_54366.js';
// import dep_61996 from './Module_61996.js';

// Webpack module 24606
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e) {
    var h;
    h = e.indexOf("?");
    return -1 !== h ? e.slice(0, h) : e;
}

p = a(22970);
c = a(61996);
g = a(54366);
f = a(9842);
export const pP = {
    nl: "upstream",
    yv: "downstream",
    rja: "both"
};
t = (function() {
    class e {
    constructor(h) {
        this.pHb = {};
        this.mga = false;
        this.config = h;
        this.Q3c();
        h.console && (this.ve = new c.Tm({
            Ig: 10,
            Ej: this,
            source: "SideChannelCoordinator",
            console: h.console
        }));
    }
    Xc(h) {
        !this.mga && this.ve && (h.Xc(new g.ko(this.ve)),
        this.mga = true);
    }
    lwb(h) {
        var k, l, n, q;
        if (this.config.transport.uBa) {
            k = {};
            h = p.__assign(p.__assign({}, this.config.Ml), h);
            l = this.config.UWb || [];
            l = p.__spreadArray(p.__spreadArray([], p.__read(["sessionId", "dlreportEnabled", "nginxRateLimit", "responsePadding"] /* sessionId */), false), p.__read(l), false);
            for (var m in f.tP) {
                n = f.tP[m];
                if (n && n.direction !== f.fh.yv && -1 !== l.indexOf(n.name)) {
                    q = h[m];
                    undefined !== q && (q = n.encode ? n.encode(q) : q,
                    k[n.Zh] = q);
                }
            }
            return this.config.transport.uBa.encode(k);
        }
    }
    COb(h, k) {
        var l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H;
        undefined === k && (k = {});
        if (this.config.transport.LSa && (!k.XAa || this.DYc(k.mediaType || "default")) && (h = this.config.transport.LSa.decode(h))) {
            D = {};
            E = this.config.fpc || Object.keys(f.tP).map(function(J) {
                return f.tP[J].name;
            });
            for (G in f.tP) {
                F = f.tP[G];
                if (F && F.direction !== f.fh.nl && -1 !== E.indexOf(F.name)) {
                    H = h[F.Zh];
                    if (undefined !== H && (H = F.decode ? F.decode(H) : H,
                    !F.validate || F.validate(H)) && (F = F.Cd,
                    F !== f.Ag.b8))
                        switch (F) {
                        case f.Ag.cFa:
                            D.Na || (D.Na = {});
                            D.Na[G] = H;
                            break;
                        case f.Ag.Zr:
                            D.response || (D.response = {});
                            D.response[G] = H;
                            break;
                        case f.Ag.sK:
                            (D.title || (D.title = {}),
                            D.title[G] = H);
                        }
                }
            }
            k.mediaType && (this.pHb[k.mediaType] = Date.now());
            this.ve && this.ve.J9("processDownstreamMessage", {
                parsed: true,
                url: k.url ? d(k.url) : undefined,
                Sf: this.config.Sf,
                time: Date.now(),
                Bo: null === (l = D.Na) || undefined === l ? undefined : l.Bo,
                Ao: null === (m = D.Na) || undefined === m ? undefined : m.Ao,
                maxBitrate: null === (n = D.title) || undefined === n ? undefined : n.maxBitrate,
                Wf: null === (q = D.response) || undefined === q ? undefined : q.Wf,
                Yua: null === (u = null === (r = D.title) || undefined === r ? undefined : r.Yua) || undefined === u ? undefined : u.time,
                Xua: null === (w = null === (v = D.title) || undefined === v ? undefined : v.Xua) || undefined === w ? undefined : w.time,
                BU: null === (y = null === (x = D.title) || undefined === x ? undefined : x.BU) || undefined === y ? undefined : y.time,
                zU: null === (A = D.title) || undefined === A ? undefined : A.zU,
                wU: null === (B = null === (z = D.title) || undefined === z ? undefined : z.wU) || undefined === B ? undefined : B.time,
                vU: null === (C = D.title) || undefined === C ? undefined : C.vU
            });
            this.config.h1a && this.config.h1a(D, k);
        }
    }
    DYc(h) {
        var k;
        k = this.config.wnc || 0;
        if (0 === k)
            return true;
        h = this.pHb[h] || 0;
        return Date.now() - h >= k;
    }
    Q3c() {
        if ((this.config.direction === b.pP.nl || this.config.direction === b.pP.rja) && !this.config.transport.uBa)
            throw Error("Upstream transport required for upstream or both directions");
        if ((this.config.direction === b.pP.yv || this.config.direction === b.pP.rja) && !this.config.transport.LSa)
            throw Error("Downstream transport required for downstream or both directions");
    }
}
return e;
}
)();
export const DKa = t;

// Detected exports: DKa, pP
