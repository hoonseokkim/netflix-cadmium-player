/**
 * Netflix Cadmium Playercore - Module 71398
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: C9a
 * Dependencies: 22970, 31413, 66164, 91176
 * Purpose: Network/HTTP, Logging, Event handling, Configuration
 */

// import dep_22970 from './Module_22970.js';
// import dep_31413 from './Module_31413.js';
// import dep_66164 from './Module_66164.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 71398
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(91176);
c = a(66164);
g = a(31413);
t = (function() {
    class f {
    constructor(e, h, k, l, m, n, q, r, u) {
        this.L = e;
        this.ka = h;
        this.sd = k;
        this.events = l;
        this.Sa = m;
        this.pKc = n;
        this.Wi = q;
        this.Qwb = r;
        this.console = u;
        this.uD = 0;
        m.eZ && c.platform.ping && c.platform.ping(m.eZ);
        false;
    }
    U0a(e, h, k, l, m) {
        this.Xv && (this.Xv.La(),
        this.Xv = undefined);
        this.Xv = new g.Hlb(this.ka,this.sd,this.events,this.Sa,e,h,k,l,m,this.vn,this.v$.bind(this),this.console);
    }
    Xuc() {
        var e;
        e = this.L;
        (0,
        p.assert)(e.Ic, "livePositionService must be defined");
        return e.Ic.Jpa(this.Sa.Ga).G;
    }
    eVa(e) {
        var h, k;
        k = this.Xuc();
        return {
            ii: e,
            Wv: null !== (h = this.tra) && undefined !== h ? h : this.Sa.kj,
            Ub: this.Sa.Ub,
            hb: this.Sa.Cu(),
            gOa: k,
            fOa: this.zFc,
            pXb: this.L.J
        };
    }
    Swa(e) {
        var h, k, l, m;
        this.Xv && (this.Xv.La(),
        this.Xv = undefined);
        false;
        try {
            h = this.v$(e);
            k = {
                ii: e,
                Wv: this.Sa.kj,
                Ub: this.Sa.Ub,
                eu: this.eu,
                LH: h
            };
            if (this.L.Ab || "embedded" === this.eu) {
                if (this.ka.config.QR) {
                    l = this.eVa(e);
                    m = d.__assign(d.__assign(d.__assign(d.__assign({
                        type: "adBreakEvent"
                    }, this.Sa.VK.complete || ({
                        event: "adBreakComplete"
                    })), k), l), {
                        vfa: this.Sa.duration.G,
                        vn: this.vn
                    });
                    false;
                    this.events.emit(m.type, m);
                }
            } else
                (m = d.__assign(d.__assign(d.__assign({
                    type: "adBreakEvent"
                }, this.Sa.VK.complete || ({
                    event: "adBreakComplete"
                })), k), {
                    pXb: this.L.J
                }),
                false,
                this.events.emit(m.type, m));
            this.Sa.S0 = true;
        } catch (n) {
            this.console.error("Impression error event", n);
            this.uD++;
        }
    }
    JLb(e, h) {
        var k, l, m;
        false;
        this.zFc = e.offset.G;
        this.jHb = h;
        if ((this.L.Ab || "embedded" === this.eu) && this.ka.config.QR)
            try {
                k = this.Sa.VK.start || ({
                    event: "adBreakStart"
                });
                l = this.eVa(e);
                this.vn = this.toc();
                m = d.__assign(d.__assign(d.__assign({
                    type: "adBreakEvent"
                }, k), l), {
                    vfa: e.offset.G,
                    eu: this.eu,
                    LH: l.Wv,
                    vn: this.vn
                });
                false;
                this.events.emit(m.type, m);
                this.v1 = l.Wv;
            } catch (n) {
                this.console.error("Impression error event", n);
                this.uD++;
            }
    }
    KLb(e, h) {
        var k, l, m, n, q, r;
        false;
        if ((this.L.Ab || "embedded" === this.eu) && this.ka.config.QR)
            try {
                l = h || this.ka.player.Rd;
                m = this.jHb ? l.da(this.jHb).G : 0;
                n = this.Sa.VK.stop || ({
                    event: "adBreakStop"
                });
                q = this.v1 ? this.v1 + m : this.v$(e);
                r = d.__assign(d.__assign(d.__assign({
                    type: "adBreakEvent"
                }, n), this.eVa(e)), {
                    vfa: m,
                    eu: this.eu,
                    LH: q,
                    vn: this.vn
                });
                null === (k = this.Xv) || undefined === k ? undefined : k.La();
                false;
                this.events.emit(r.type, r);
            } catch (u) {
                this.console.error("Impression error event", u);
                this.uD++;
            }
        return q;
    }
    S0a(e, h) {
        var k;
        false;
        undefined !== this.tra ? false : (this.v1 = this.tra = null !== (k = this.KLb(e)) && undefined !== k ? k : 0,
        this.JLb(e, h));
    }
    La() {
        var e;
        null === (e = this.Xv) || undefined === e ? undefined : e.La();
    }
    Tq() {
        var e;
        return {
            ad: null === (e = this.Xv) || undefined === e ? undefined : e.Tq(),
            errors: this.uD
        };
    }
    toc() {
        var e, h;
        if ("embedded" === this.eu)
            return null !== (h = null === (e = this.L.S) || undefined === e ? undefined : e.wd) && undefined !== h && h.Uj ? this.Qwb && this.Qwb.Ygc(this.Sa.Ub) ? "Failed" : this.Sa.MB ? "MissedOpportunity" : "daiPrefetch" === this.Sa.source || "hydration" === this.Sa.source ? "ServerRespondedWithEmbedded" : "Failed" : "DAINotSupported";
    }
}
Object.defineProperties(f.prototype, {
        HJ: {
            get: function() {
                return this.uD;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        eu: {
            get: function() {
                return undefined !== this.tra ? "embedded" : this.Sa.type;
            },
            enumerable: false,
            configurable: true
        }
    });
    f.prototype.v$ = function(e) {
        var h, k, l, q;
        k = this.Wi.aB(e);
        if (!k) {
            false;
            if (this.v1) {
                e = this.pKc || this.Sa;
                if (undefined !== this.tra) {
                    l = e.yb[e.yb.length - 1];
                    return this.v1 + ((null === l || undefined === l ? undefined : l.duration) || p.I.ia).G;
                }
                k = e.duration;
                try {
                    for (var m = d.__values(e.yb.reverse()), n = m.next(); !n.done; n = m.next()) {
                        q = n.value;
                        if (q.ah)
                            break;
                        else
                            k = k.da(q.duration);
                    }
                } catch (r) {
                    l = {
                        error: r
                    };
                } finally {
                    try {
                        n && !n.done && (h = m.return) && h.call(m);
                    } finally {
                        if (l)
                            throw l.error;
                    }
                }
                false;
                return this.v1 + k.G;
            }
            l = this.ka.Rs(e).Ga.da(this.Sa.Ga);
            l = this.Sa.location.add(l);
            false;
            return l.G;
        }
        return this.Sa.location.add(k.progress.vqb).G;
    }
    ;
    return f;
}
)();
export const C9a = t;

// Detected exports: C9a
