/**
 * Netflix Cadmium Playercore - Module 39795
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Odb
 * Dependencies: 8171, 22970, 35018, 42431, 52571, 65161, 66164, 81392
 * Purpose: Logging, Configuration, Error handling, Playback control
 */

// import dep_8171 from './Module_8171.js';
// import dep_22970 from './Module_22970.js';
// import dep_35018 from './Module_35018.js';
// import dep_42431 from './Module_42431.js';
// import dep_52571 from './Module_52571.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_81392 from './Module_81392.js';

// Webpack module 39795
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(22970);
p = a(66164);
c = a(8171);
g = a(35018);
f = a(65161);
t = a(81392);
e = a(52571);
h = a(42431);
a = (function(k) {
    class l extends k {
    constructor(m, n, q, r, u) {
        var v;
        v = k.call(this, m) || this;
        v.L = m;
        v.console = n;
        v.config = q;
        v.K0a = r;
        v.wUa = u;
        v.headers = [Object.create(null), Object.create(null)];
        v.uHb = [undefined, undefined];
        v.Sv = undefined;
        return v;
    }
    Ue() {
        var m;
        m = this;
        this.headers.forEach(function(n, q) {
            for (var r in n)
                (n[r].Ue(),
                m.qSa(q, r));
        });
        this.Sv && h.WJ.instance.yaa(this.Sv);
        this.Sv = undefined;
    }
    Os(m, n) {
        return this.headers[m][n];
    }
    IC(m, n, q) {
        var r, u, v, w;
        r = this.config;
        if (this.Os(m.mediaType, m.Oa))
            return false;
        u = this.CFc;
        v = this.DFc;
        if (undefined !== r.d0a && undefined !== u && undefined !== v) {
            w = p.platform.time.fa();
            if (w - u < r.d0a || w - v < r.d0a)
                return false;
        }
        m = this.X1c(m, n, q);
        this.DFc = p.platform.time.fa();
        return m;
    }
    X1c(m, n, q) {
        var r;
        r = m.mediaType;
        c.Gx.pE(r);
        if (this.Os(r, m.Oa))
            m = false;
        else {
            n = {
                K: n,
                offset: 0,
                la: this.S_(m)
            };
            q || (q = this.Jd);
            (0,
            e.assert)(q);
            m.Da && q.track.GUb && (n.offset = 0,
            n.la = 0);
            m.url && (this.L.FCb(r).HHb = m.L0(true));
            if (!this.slc(m, q, n).open())
                return (this.L.dg({
                    ej: "MediaRequest open failed (2)",
                    cE: "NFErr_MC_StreamingFailure"
                }),
                false);
            m = true;
        }
        return m;
    }
    Ot() {
        var m, n;
        m = this;
        n = [];
        this.headers.forEach(function(q, r) {
            var v;
            c.Gx.pE(r);
            for (var u in q) {
                r = q[u];
                v = r.o8a();
                1 === v ? n.push(r) : 2 === v && m.L.dg({
                    ej: "swapUrl failure"
                });
            }
        });
        return n;
    }
    Ko(m, n) {
        var q, r;
        if (m instanceof g.JCa) {
            q = m.mediaType;
            r = c.Gx.pE(q);
            this.L.Dl ? r.warn("header onrequestcomplete ignored, session shutdown:", m.toString()) : (this.K0a({
                type: "logdata",
                target: "startplay",
                Uc: {
                    usedNativeDataView: m.I3c
                }
            }),
            m.Gxa > m.G1a && (this.uHb[q] = m.Gxa),
            this.LAc(m),
            this.CFc = p.platform.time.fa());
            this.kS(m, n);
        }
    }
    BY(m, n) {
        var q, r, u;
        q = this.headers[m];
        for (r in q) {
            u = q[r];
            u && !u.stream.vh && u.rg === n && (this.qSa(m, r),
            u.Ue());
        }
    }
    TD() {
        var m, n, q, r;
        m = this;
        n = this.L.R;
        q = "headers";
        this.config.RQb && this.L.tB && this.L.jk && (n = this.L.jk.R,
        this.config.bHc && this.L.Btb([f.l.U, f.l.V]) && (q = f.l.U));
        r = h.WJ.instance.TD(q, n, true, false, {}, this.config);
        r.on("error", function() {
            m.console.error("headerManager.createRequestQueue: error on request queue", r.Zg, r.dh);
        });
        r.on("transportreport", function(u) {
            u.cra = m.L.fr.NL;
            u.S = m.L.S;
            m.wUa(u);
        });
        r.Gb();
        return r;
    }
    Bac(m) {
        this.headers[m.mediaType][m.Oa] = m;
    }
    LAc(m) {
        var n, q, r, v;
        n = this.config;
        q = c.Gx.pE(m.mediaType);
        r = m.stream.Ta;
        if (n.Ypa) {
            n = r.length;
            q.trace("fragment count:", n);
            for (var u = 0; u < n; ++u) {
                v = r.get(u);
                q.trace("fragment: " + u + ", startPts: " + v.qa.G + ", duration: " + v.Ob.G + ", offset: " + v.offset);
            }
        }
        this.zac(m);
    }
    zac(m) {
        var n, q;
        n = m.mediaType;
        q = m.Oa;
        c.Gx.pE(n);
        m.uMb && (m.uMb.forEach(function(r) {
            (r = r.fj(n, q)) && r !== m.stream && !r.vh && r.svb(m.stream);
        }),
        m.uMb = undefined);
        this.L.EAc(m);
    }
    slc(m, n, q) {
        var r, u;
        r = this;
        u = c.Gx.pE(m.mediaType);
        m = new g.JCa(m,this.config,n,q,this,q.K,false,u);
        this.config.Obc && (n = this.L.j4) && q.rC && (q.rC = n.tu({}));
        m.addListener("headerRequestCancelled", function(v) {
            r.FAc(v.request);
        });
        this.Bac(m);
        return m;
    }
    S_(m) {
        var n, q, r, u;
        n = m.Po;
        q = m.L;
        r = q.duration;
        u = this.config;
        return m.Da ? 512 : q.Aw ? u.Izb ? u.Izb : u.Cca : u.G3c && n ? n.offset + n.size : (m = this.uHb[m.mediaType]) ? m + 128 : u.S_ ? 2292 + 12 * Math.ceil(r / 2E3) : u.Cca;
    }
    FAc(m) {
        this.qSa(m.mediaType, m.Oa);
    }
    qSa(m, n) {
        delete this.headers[m][n];
    }
}
d.Object.defineProperties(l.prototype, {
        Jd: {
            get: function() {
                return this.Sv || (this.Sv = this.TD());
            },
            enumerable: false,
            configurable: true
        }
    });
    return l;
}
)(t.bP);
export const Odb = a;

// Detected exports: Odb
