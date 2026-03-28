/**
 * Netflix Cadmium Playercore - Module 71409
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Wab
 * Dependencies: 15913, 22970, 66164
 * Purpose: Configuration, Error handling
 */

// import dep_15913 from './Module_15913.js';
// import dep_22970 from './Module_22970.js';
// import dep_66164 from './Module_66164.js';

// Webpack module 71409
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
t = a(66164);
p = a(15913);
new t.platform.Console("ASEJS_TDIGEST_FILTER","media|asejs");
a = (function() {
    class c {
    constructor(g) {
        this.config = g;
        this.PD = g.c;
        this.I_a = g.Qid;
        this.Tda = g.Tda;
        this.Eca = g.Eca;
        this.Kta = g.Kta;
        this.CYc = g.Jdd;
        this.fB = g.fB;
        this.kJb = g.kJb;
        this.reset();
    }
    reset() {
        this.Nl = new p.TDigest(this.PD,this.I_a);
        this.time = null;
    }
    add(g, f, e) {
        var h, k, l, q;
        e = Math.max(e - f, 1);
        g = 8 * g / e;
        if (this.CYc) {
            null === this.time && (this.time = f);
            k = Math.pow(2, (f - this.time) / this.fB);
            l = e * k;
            if (k >= this.kJb) {
                l = new p.TDigest(this.PD,this.I_a);
                try {
                    for (var m = d.__values(this.Nl.Ij()), n = m.next(); !n.done; n = m.next()) {
                        q = n.value;
                        l.push(q.Gf, q.n / k);
                    }
                } catch (u) {
                    var r;
                    r = {
                        error: u
                    };
                } finally {
                    try {
                        n && !n.done && (h = m.return) && h.call(m);
                    } finally {
                        if (r)
                            throw r.error;
                    }
                }
                this.Nl = l;
                l = e;
                this.time = f;
            }
            this.Nl.push(g, l);
        } else
            this.Nl.push(g, e);
    }
    get() {
        var g;
        g = this.Nl.kk([this.Tda, this.Eca, this.Kta]);
        return {
            low: g[0] || 0,
            high: g[1] || 0,
            initial: g[2] || 0
        };
    }
    su() {
        var g, f, e, l;
        f = new c(this.config);
        e = new p.TDigest(this.PD,this.I_a);
        try {
            for (var h = d.__values(this.Nl.Ij()), k = h.next(); !k.done; k = h.next()) {
                l = k.value;
                e.push(l.Gf, l.n);
            }
        } catch (n) {
            var m;
            m = {
                error: n
            };
        } finally {
            try {
                k && !k.done && (g = h.return) && g.call(h);
            } finally {
                if (m)
                    throw m.error;
            }
        }
        f.Nl = e;
        return f;
    }
    flush() {}
    start() {}
    stop() {}
}
return c;
}
)();
export const Wab = a;

// Detected exports: Wab
