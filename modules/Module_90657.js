/**
 * Netflix Cadmium Playercore - Module 90657
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: uG
 * Dependencies: 4069, 22970
 * Purpose: Encryption/Decryption, Error handling, Class definition
 */

// import dep_4069 from './Module_4069.js';
// import dep_22970 from './Module_22970.js';

// Webpack module 90657
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
p = a(4069);
t = (function() {
    class c {
    constructor(g, f) {
        var e;
        this.cob = g;
        this.EVb = f;
        this.ph = {
            other: new p.jh(),
            all: new p.jh()
        };
        try {
            for (var h = d.__values(g), k = h.next(); !k.done; k = h.next())
                this.ph[k.value] = new p.jh();
        } catch (m) {
            var l;
            l = {
                error: m
            };
        } finally {
            try {
                k && !k.done && (e = h.return) && e.call(h);
            } finally {
                if (l)
                    throw l.error;
            }
        }
    }
    zec(g) {
        var f, e, l;
        g = (null === (e = this.EVb) || undefined === e ? undefined : e.call(this, g)) || g;
        try {
            for (var h = d.__values(this.cob), k = h.next(); !k.done; k = h.next()) {
                l = k.value;
                if (g < l)
                    return l;
            }
        } catch (n) {
            var m;
            m = {
                error: n
            };
        } finally {
            try {
                k && !k.done && (f = h.return) && f.call(h);
            } finally {
                if (m)
                    throw m.error;
            }
        }
        return "other";
    }
    push(g) {
        var f, e;
        e = null !== (f = this.zec(g)) && undefined !== f ? f : "other";
        this.ph[e].push(g);
        this.ph.all.push(g);
    }
    toJSON() {
        var g, f;
        g = this;
        f = {};
        Object.keys(this.ph).forEach(function(e) {
            var h;
            h = g.ph[e];
            h.count && (f[e] = h);
        });
        return f;
    }
}
c.Jn = function(g, f) {
        var e, h, m;
        if (g === f)
            return g;
        h = new c(g.cob,g.EVb);
        try {
            for (var k = d.__values(Object.keys(g.ph)), l = k.next(); !l.done; l = k.next()) {
                m = l.value;
                h.ph[m] = g.ph[m].Jn(f.ph[m]);
            }
        } catch (q) {
            var n;
            n = {
                error: q
            };
        } finally {
            try {
                l && !l.done && (e = k.return) && e.call(k);
            } finally {
                if (n)
                    throw n.error;
            }
        }
        return h;
    }
    ;
    return c;
}
)();
export const uG = t;

// Detected exports: uG
