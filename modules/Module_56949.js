/**
 * Netflix Cadmium Playercore - Module 56949
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Elb, L5b
 * Dependencies: 22970, 65161
 * Purpose: Buffer/Segment management, Logging, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_65161 from './Module_65161.js';

// Webpack module 56949
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(65161);
c = (function() {
    class g {
    constructor(f, e, h, k, l, m, n) {
        this.pd = f;
        this.console = m;
        this.IPb = n;
        this.kw = 0;
        this.v5 = [];
        this.wva = h;
        this.uva = k;
        this.EJb = Math.max(1, Math.floor(e / l));
    }
    N2c(f) {
        var e;
        e = this.pd;
        this.kw = f;
        f >= this.uva && (this.console.log(("Marking relay node ").concat(this.IPb, " as failed (consecutive missed) - ") + ("consecutive missed: ").concat(f, "/").concat(this.uva)),
        this.pd = true);
        return !e && this.pd;
    }
    ibc(f) {
        var e;
        e = this.pd;
        for (this.v5.push(f); this.v5.length > this.EJb; )
            this.v5.shift();
        f = this.v5.reduce(function(h, k) {
            return h + k;
        }, 0);
        f >= this.wva && (this.console.log(("Marking relay node ").concat(this.IPb, " as failed (window errors) - ") + ("total window errors: ").concat(f, "/").concat(this.wva, ", ") + ("windows tracked: ").concat(this.v5.length, "/").concat(this.EJb)),
        this.pd = true);
        return !e && this.pd;
    }
    Uzc() {
        return this.v5.reduce(function(f, e) {
            return f + e;
        }, 0);
    }
    RUc() {
        this.kw = 0;
    }
    uWa(f) {
        var e, h, m, n;
        h = null;
        f = this.DTc[f];
        try {
            for (var k = d.__values(f), l = k.next(); !l.done; l = k.next()) {
                m = l.value;
                n = this.Rya.get(m);
                if (undefined === n || !n.pd) {
                    h = m;
                    break;
                }
            }
        } catch (r) {
            var q;
            q = {
                error: r
            };
        } finally {
            try {
                l && !l.done && (e = k.return) && e.call(k);
            } finally {
                if (q)
                    throw q.error;
            }
        }
        return h;
    }
    dWa(f) {
        var e;
        e = this.Rya.get(f);
        e || (e = new c(false,this.Esc,this.wva,this.uva,this.BBc,this.console,f),
        this.Rya.set(f, e));
        return e;
    }
    cUc(f, e, h) {
        var k, l;
        k = this.dWa(f);
        l = k.N2c(h);
        this.console.trace("reportConsecutiveMissedSegments: ", f, e, h, "failed:", k.pd);
        return l;
    }
    iQb(f, e, h) {
        var k, l;
        k = this.dWa(f);
        l = k.ibc(h);
        this.console.trace("reportMissedSegmentsInWindow: ", f, e, h, "totalWindowErrors:", k.Uzc(), "failed:", k.pd);
        return l;
    }
    fUc(f, e) {
        var h;
        h = this.dWa(f);
        h.pd = true;
        this.console.log("reportJoinFailure: ", f, e, h, this.uWa(p.l.U));
    }
    kUc(f, e) {
        this.console.trace("reportSegmentReceived: ", f, e);
        (f = this.Rya.get(f)) && f.RUc();
    }
}
return g;
}
)();
export const L5b = c;
t = (function() {
    function g(f, e, h) {
        this.console = f;
        this.DTc = e;
        this.Rya = new Map();
        this.Esc = Number(h.Wpc);
        this.wva = Number(h.Ypc);
        this.uva = Number(h.Xpc);
        this.BBc = Number(h.ryb);
    }
    return g;
}
)();
export const Elb = t;

// Detected exports: Elb, L5b
