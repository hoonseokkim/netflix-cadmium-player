/**
 * Netflix Cadmium Playercore - Module 23855
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: M9a
 * Dependencies: 13060, 14739, 22970, 35331, 40666, 48170, 52571, 61996, 90745, 91176
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_13060 from './Module_13060.js';
// import dep_14739 from './Module_14739.js';
// import dep_22970 from './Module_22970.js';
// import dep_35331 from './Module_35331.js';
// import dep_40666 from './Module_40666.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_61996 from './Module_61996.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 23855
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(48170);
f = a(35331);
e = a(61996);
h = a(52571);
t = a(14739);
k = a(40666);
l = a(13060);
a = (function(m) {
    class n extends m {
    constructor(q, r, u, v) {
        var w;
        w = m.call(this, q, r, u, "AdsPlaygraphHost") || this;
        w.Tv = v;
        w.CG = undefined;
        w.vIb = new c.Y7();
        w.Lna = new p.EventEmitter();
        v.Qna(function(x, y) {
            return w.Frc(x, y);
        });
        return w;
    }
    Frc(q, r) {
        var u, v, w, x, y, A, z;
        A = q.J;
        z = null === (v = null === (u = null === q || undefined === q ? undefined : q.Bm) || undefined === u ? undefined : u.Mf) || undefined === v ? undefined : v.jd;
        u = this.Dc.od.cc[z];
        u = null !== (y = null !== (x = null === (w = q.Bm) || undefined === w ? undefined : w.Ep) && undefined !== x ? x : null === u || undefined === u ? undefined : u.some(function(B) {
            return B.yb.some(function(C) {
                return C.id === A;
            });
        })) && undefined !== y ? y : false;
        q = d.__assign(d.__assign({}, q), {
            Bm: d.__assign(d.__assign({}, q.Bm), {
                Ep: u
            })
        });
        return r(q);
    }
    Gb() {
        var q;
        q = this;
        m.prototype.Gb.call(this);
        this.Wp.za.Xc(new f.N9a(this.Wp));
        this.CG = new l.J9a(this.ub,this.Eb,this.za,this.rd,this.Tv,this.Lna,function() {
            return !!q.QS;
        }
        );
        this.Wp.za.YWc(this.CG);
        this.Dc.cn.events.on("adBreakHydrated", function(r) {
            return q.BOb(r);
        });
        this.Dc.cn.events.on("adBreakHydrationFailed", function(r) {
            var u, v, w;
            (null === (u = r.jn) || undefined === u ? 0 : u.Ab) && (null === (w = null === (v = r.jn) || undefined === v ? undefined : v.wd) || undefined === w ? 0 : w.Uj) || q.dg({
                ej: r.error.message,
                t2a: r.error
            });
        });
        this.CG.od.events.on("adsUpdated", function() {
            g.u && q.ub.log("AdPlaygraphHost::adsUpdated");
            q.Ifa();
        });
        this.za.events.on("seeked", function() {
            q.QS && q.rd.sd.uu(k.ie.QBa, function() {
                q.QS = undefined;
            }, "clear in progress seek request");
        });
    }
    dC(q) {
        var r, u, v, w, x;
        r = m.prototype.dC.call(this, q);
        if (r) {
            (0,
            h.assert)(this.Dc, "missing manager");
            u = this.Dc.OI(q);
            q = this.Dc.od.OI(q, u, this.QS);
            u = q.L2a;
            v = q.zia;
            w = q.PA;
            x = q.pwa;
            (q.PY || u) && this.Ifa(x, v, w);
        }
        return r;
    }
    BOb(q) {
        q = q.jn;
        g.u && this.ub.log("AdPlaygraphHost::processAdBreakHydrationResponse");
        (0,
        h.assert)(this.Dc, "missing manager");
        (q = this.Dc.od.Twa(q, this.QS)) ? this.Ifa(q.pwa, q.zia, q.PA) : this.Ifa();
    }
    dg(q) {
        var r, u;
        r = false;
        u = false;
        q.J && !q.f7a && (r = this.Dc.Kna.kXa(q.J));
        r ? g.u && this.ub.log("AdPlaygraphHost::reportStreamingFailure streaming failure is recoverable") : u = this.Wp.za.dg(q);
        return u;
    }
    gO(q) {
        var r, u, v, w;
        r = this;
        g.u && this.ub.log("Top level seek streaming call to ", q);
        this.I5a(q);
        this.rd.sd.uu(k.ie.QBa, function() {
            r.QS = undefined;
        }, "clear in progress seek request");
        if (this.Dc.od.tEb(q)) {
            g.u && this.ub.trace(("ads::seekStreaming: ").concat(JSON.stringify(q)));
            u = this.Dc.od.G2(q);
            v = u.Fm;
            w = u.PA;
            if (u = u.pwa)
                (g.u && this.ub.trace("ads::seekStreaming: ads playgraph was updated"),
                this.Ifa(u, q));
            g.u && this.ub.trace(("ads::seekStreaming: forwarding seek to ").concat(JSON.stringify(v), ", ") + ("entryPoint: ").concat(JSON.stringify(w)));
            this.za.Hza(v, w);
        } else
            this.za.gO(q);
    }
    Ifa(q, r, u) {
        var v;
        v = this;
        this.vIb.ioa || this.vIb.fYb(function() {
            v.$fa(q, v.rd.Ib, r, u);
            v.Lna.emit("adPlaygraphUpdated", {
                type: "adPlaygraphUpdated"
            });
        });
    }
    KA(q) {
        return this.Dc.od.KA(q);
    }
    Tg(q) {
        m.prototype.Tg.call(this, q);
        this.QS = undefined;
    }
    I5a(q) {
        this.QS = q;
    }
}
d.Object.defineProperties(n.prototype, {
        rd: {
            get: function() {
                return this.Wp.rd;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        dn: {
            get: function() {
                if (this.Z !== this.za.Z)
                    return this.za.Z;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        Dc: {
            get: function() {
                return this.CG;
            },
            enumerable: false,
            configurable: true
        }
    });
    d.__decorate([(0,
    e.kb)({
        methodName: "ads::processViewableResponse"
    })], n.prototype, "dC", null);
    d.__decorate([(0,
    e.kb)({
        methodName: "ads::processAdBreakHydrationResponse"
    })], n.prototype, "BOb", null);
    d.__decorate([(0,
    e.kb)({
        methodName: "ads::reportStreamingFailure"
    })], n.prototype, "dg", null);
    d.__decorate([(0,
    e.kb)({
        methodName: "ads::seekStreaming"
    })], n.prototype, "gO", null);
    d.__decorate([(0,
    e.kb)({
        methodName: "ads::cancelStreaming"
    })], n.prototype, "Tg", null);
    return n;
}
)(t.ula);
export const M9a = a;

// Detected exports: M9a
