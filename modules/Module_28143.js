/**
 * Netflix Cadmium Playercore - Module 28143
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: I9a
 * Dependencies: 48170, 52571, 66164, 67288, 69575, 71398, 90745
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_66164 from './Module_66164.js';
// import dep_67288 from './Module_67288.js';
// import dep_69575 from './Module_69575.js';
// import dep_71398 from './Module_71398.js';
// import dep_90745 from './Module_90745.js';

// Webpack module 28143
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(90745);
p = a(66164);
c = a(69575);
g = a(52571);
f = a(48170);
e = a(67288);
h = a(71398);
t = (function() {
    class k {
    constructor(l, m, n, q, r, u, v) {
        this.jg = l;
        this.sr = m;
        this.Wi = n;
        this.jE = q;
        this.za = r;
        this.sd = u;
        this.HJ = 0;
        this.events = new d.EventEmitter();
        this.console = (0,
        c.Nf)(p.platform, v, "IMPRESSION");
        m.events.addListener("adBreakPresenting", this.ILb.bind(this));
        m.events.addListener("adBreakComplete", this.Swa.bind(this));
        m.events.addListener("adBreakFallback", this.S0a.bind(this));
        m.events.addListener("adPresenting", this.U0a.bind(this));
        this.za.events.addListener("seeking", this.gxa.bind(this));
        this.za.events.addListener("cancelingStreaming", this.RLb.bind(this));
    }
    rtb() {
        var l, m;
        l = this.za.player.z1;
        if (!l && this.za.En && this.za.player.Sd) {
            m = this.za.player;
            l || (l = {
                No: m.Rd,
                position: m.Wg
            });
        }
        return l;
    }
    RLb() {
        var l;
        if (this.dj) {
            l = this.rtb();
            l && this.dj.KLb(l.position, l.No);
            this.dj = undefined;
        }
    }
    ILb(l) {
        var m, n, q, r, u, v;
        f.u && this.console.trace("onAdBreakPresenting:", l);
        n = "adBreakPresenting" === l.type || (0,
        e.kda)(l) ? l.presentingInfo.Sa.xf : l.Tqa;
        (0,
        g.assert)(n, "Ad break must be defined for ad break presenting");
        q = "adBreakPresenting" === l.type || (0,
        e.kda)(l) ? l.presentingInfo.position : l.position;
        this.dj && (this.dj.Swa(q),
        "dynamic" === this.dj.Sa.type && (f.u && this.console.warn("Unexpected back-to-back dynamic ad breaks"),
        this.HJ += this.dj.HJ,
        this.dj = undefined));
        r = this.sr.Wi.YWa(q);
        (0,
        g.assert)(r, "uxViewableId must be defined for ad break presenting");
        r = this.jg.get(r);
        (0,
        g.assert)(r, "uxViewable must be defined for ad break presenting");
        u = this.jE(r);
        v = "adBreakPresenting" === l.type ? null === (m = l.eventInfo) || undefined === m ? undefined : m.Sa : undefined;
        this.dj = new h.C9a(r,this.za,this.sd,this.events,n,v,this.Wi,u,this.console);
        this.dj.JLb(q, l.No);
    }
    Swa(l) {
        var m, n;
        n = (0,
        e.kda)(l) ? l.presentingInfo.Sa.xf : (0,
        e.aGb)(l) ? l.Tqa : null === (m = this.dj) || undefined === m ? undefined : m.Sa;
        f.u && this.console.trace(("adBreakComplete event, ").concat(this.dj ? "have" : "no", " impression logger, ") + (n ? ("ad break ").concat(n.Ub, " is ") + ("").concat(n.yb.length ? "not " : "", "empty, ") + ("has ").concat(n.ah ? "" : "not ", "played") : "no ad break"));
        if (((0,
        e.kda)(l) || (0,
        e.aGb)(l)) && 0 === n.yb.length)
            ((0,
            g.assert)(!this.dj, "Received ad break complete for empty ad break during ad break"),
            n.QXc(),
            this.ILb(l));
        else if (!this.dj)
            return;
        l = (0,
        e.kda)(l) ? l.presentingInfo.position : l.position;
        this.dj.Swa(l);
        this.HJ += this.dj.HJ;
        this.dj = undefined;
    }
    S0a(l) {
        var m;
        if (this.dj) {
            m = this.rtb();
            m ? this.dj.S0a(m.position, l.No) : f.u && this.console.warn("Recevied ad break fallback but unable to calculate lastPosition", l);
        }
    }
    U0a(l) {
        var m, n, q, r, u;
        (0,
        g.assert)(this.dj, "Expect to be in ad break when ad presenting is received");
        (0,
        g.assert)(this.dj.Sa.Ub === (null === (m = l.presentingInfo) || undefined === m ? undefined : m.Sa.xf.Ub), "Expect to be in correct ad break when ad presenting is received");
        m = l.presentingInfo.position;
        q = this.za.q0(m.M)[0];
        r = l.No;
        u = r.da(m.offset);
        this.dj.U0a(null === (n = l.presentingInfo.XK) || undefined === n ? undefined : n.vc, null === q || undefined === q ? undefined : q.L, m, r, u);
    }
    gxa(l) {
        !l.duplicate && this.dj && "embedded" === this.dj.Sa.type && this.RLb();
    }
    Tq() {
        var l;
        return {
            "break": null === (l = this.dj) || undefined === l ? undefined : l.Tq(),
            errors: this.HJ
        };
    }
}
Object.defineProperties(k.prototype, {
        Rca: {
            get: function() {
                return !!this.dj;
            },
            enumerable: false,
            configurable: true
        }
    });
    return k;
}
)();
export const I9a = t;

// Detected exports: I9a
