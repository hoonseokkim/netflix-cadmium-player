/**
 * Netflix Cadmium Playercore - Module 97115
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: A7, Hhb, Nka
 * Dependencies: 91176
 * Purpose: Buffer/Segment management, Error handling
 */

// import dep_91176 from './Module_91176.js';

// Webpack module 97115
// Parameters: t (module), b (exports), a (require)

var d;
export const Nka = d = a(91176);
export const A7 = 1E4;
t = (function() {
    class p {
    constructor(c) {
        this.Ch = [];
        this.P8 = 0;
        this.ya = c;
    }
    ES(c) {
        var g;
        g = (0,
        d.kc)(this.Ch, function(f) {
            return c >= f.Nb && c < f.Xg;
        });
        "undefined" === typeof g && this.ya.warn("Get Segment at pts " + c + " is undefined");
        return g;
    }
    zOa(c) {
        var f;
        for (var g = this.Ch; 0 < g.length && 300 <= c.M - g[0].M; )
            this.Oga();
        for (; 0 < g.length && 300 <= g[g.length - 1].M - c.M; )
            this.b5a();
        f = g.length;
        if (0 === f || g[f - 1].M < c.M)
            this.c5a(c);
        else {
            f = (0,
            d.kc)(g, function(e) {
                return e.M >= c.M;
            });
            if ((null === f || undefined === f ? undefined : f.M) === c.M)
                return;
            this.d5a(g.indexOf(f), c);
        }
        this.P8 = g[g.length - 1].M;
    }
    ria(c) {
        var g;
        if ("undefined" === typeof c)
            this.ya.warn("Current segment is undefined.");
        else
            for ((this.vq = c,
            this.ya.trace(("Current segment id is ").concat(c.M))); (null === (g = this.Ch[0]) || undefined === g ? undefined : g.Xg) < c.Xg - b.A7; )
                this.Oga();
    }
    cWa() {
        if (this.Ov) {
            if (this.P8 !== this.Ov.M)
                return this.Ch[this.Ch.indexOf(this.Ov) + 1];
        } else
            return this.Ch[0];
    }
    KC(c) {
        this.Ov = this.fE(c);
    }
    fE(c) {
        var g;
        g = (0,
        d.kc)(this.Ch, function(f) {
            return f.M === c;
        });
        "undefined" === typeof g && this.ya.error("Segment with segmentId " + c + " is not in segmentArray");
        return g;
    }
    aca() {
        var c;
        return (null === (c = this.Ov) || undefined === c ? undefined : c.M) || -1;
    }
    l8a(c, g) {
        c = this.fE(c);
        "undefined" !== typeof c && (this.Ch[this.Ch.indexOf(c)].header = g);
    }
    yVa(c) {
        c = this.fE(c);
        return (null === c || undefined === c ? undefined : c.header) || ({});
    }
    Oga() {
        this.Ch.shift();
    }
    c5a(c) {
        this.Ch.push(c);
    }
    d5a(c, g) {
        this.Ch.splice(c, 0, g);
    }
    b5a() {
        this.Ch.pop();
    }
}
return p;
}
)();
export const Hhb = t;
export const Nka = (function() {
    return function(p, c) {
        this.M = p.M;
        this.xml = p.xml;
        this.Nb = p.Nb;
        this.Xg = p.Xg;
        this.NS = c;
        this.iz = p.iz;
    }
    ;
}
)();

// Detected exports: A7, Hhb, Nka
