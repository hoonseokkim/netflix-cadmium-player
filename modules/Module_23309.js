/**
 * Netflix Cadmium Playercore - Module 23309
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: A7, Nka, Pfb
 * Dependencies: 91176
 * Purpose: Buffer/Segment management, Configuration, Error handling, Enum definitions
 */

// import dep_91176 from './Module_91176.js';

// Webpack module 23309
// Parameters: t (module), b (exports), a (require)

var d, p;
export const Nka = d = a(91176);
export const A7 = 1E4;
t = (function() {
    class c {
    constructor(g) {
        this.Ch = [];
        this.P8 = 0;
        this.ya = g;
    }
    ES(g) {
        return (0,
        d.kc)(this.Ch, function(f) {
            return g >= f.Nb && g < f.Xg;
        });
    }
    zOa(g, f) {
        var h;
        for (var e = this.Ch; 0 < e.length && 300 <= g.M - e[0].M; )
            this.Oga();
        for (; 0 < e.length && 300 <= e[e.length - 1].M - g.M; )
            this.b5a();
        h = new p(g,f);
        g = e.length;
        if (0 === g || e[g - 1].M < h.M)
            this.c5a(h);
        else {
            g = (0,
            d.kc)(e, function(k) {
                return k.M >= h.M;
            });
            if ((null === g || undefined === g ? undefined : g.M) === h.M)
                return;
            this.d5a(e.indexOf(g), h);
        }
        h.endOfStream && (this.ya.trace("EOS segment added to segment manager"),
        this.g8b = h);
        this.P8 = e[e.length - 1].M;
    }
    ria(g) {
        var f;
        if ("undefined" === typeof g)
            this.ya.warn("Current segment is undefined.");
        else
            for ((this.vq = g,
            this.ya.trace(("Current segment id is ").concat(g.M))); (null === (f = this.Ch[0]) || undefined === f ? undefined : f.Xg) < g.Xg - b.A7; )
                this.Oga();
    }
    cWa() {
        if (this.Ov) {
            if (this.P8 !== this.Ov.M)
                return this.Ch[this.Ch.indexOf(this.Ov) + 1];
        } else
            return this.Ch[0];
    }
    KC(g) {
        this.Ov = this.fE(g);
    }
    fE(g) {
        var f;
        f = (0,
        d.kc)(this.Ch, function(e) {
            return e.M === g;
        });
        "undefined" === typeof f && this.ya.error("Segment with segmentId " + g + " is not in segmentArray");
        return f;
    }
    aca() {
        var g;
        return (null === (g = this.Ov) || undefined === g ? undefined : g.M) || -1;
    }
    l8a(g, f) {
        g = this.fE(g);
        "undefined" !== typeof g && (this.Ch[this.Ch.indexOf(g)].header = f);
    }
    qDb(g) {
        return this.fE(g);
    }
    yVa(g) {
        g = this.fE(g);
        return (null === g || undefined === g ? undefined : g.header) || ({});
    }
    Oga() {
        this.Ch.shift();
    }
    c5a(g) {
        this.Ch.push(g);
    }
    d5a(g, f) {
        this.Ch.splice(g, 0, f);
    }
    b5a() {
        this.Ch.pop();
    }
}
Object.defineProperty(c.prototype, "endOfStreamSegment", {
        get: function() {
            return this.g8b;
        },
        enumerable: false,
        configurable: true
    });
    return c;
}
)();
export const Pfb = t;
p = (function() {
    return function(c, g) {
        this.M = c.M;
        this.xml = c.xml;
        this.Nb = c.Nb;
        this.Xg = c.Xg;
        this.NS = g;
        this.size = c.size;
        this.iz = c.iz;
        this.endOfStream = c.endOfStream;
    }
    ;
}
)();
export const Nka = p;

// Detected exports: A7, Nka, Pfb
