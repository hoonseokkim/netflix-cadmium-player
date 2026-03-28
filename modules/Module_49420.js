/**
 * Netflix Cadmium Playercore - Module 49420
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: I
 * Purpose: Configuration, Class definition, Enum definitions
 */

// Webpack module 49420
// Parameters: t (module), b (exports)

function a(p, c) {
    return "number" !== typeof p || "number" !== typeof c ? false : p && c ? Math.abs(p * c / d(p, c)) : 0;
}
function d(p, c) {
    var g;
    p = Math.abs(p);
    for (c = Math.abs(c); c; ) {
        g = c;
        c = p % c;
        p = g;
    }
    return p;
}

t = (function() {
    class p {
    constructor(c, g) {
        "object" === typeof c ? (this.Wc = c.$,
        this.Jb = c.O) : (this.Wc = c,
        this.Jb = g);
    }
    Rc(c) {
        c /= this.O;
        return new p(Math.floor(this.$ * c),Math.floor(this.O * c));
    }
    add(c) {
        var g;
        if (this.O === c.O)
            return new p(this.$ + c.$,this.O);
        g = a(this.O, c.O);
        return this.Rc(g).add(c.Rc(g));
    }
    da(c) {
        return this.add(new p(-c.$,c.O));
    }
    wh(c) {
        return new p(this.$ * c,this.O);
    }
    Af(c) {
        var g;
        if (this.O === c.O)
            return this.$ / c.$;
        g = a(this.O, c.O);
        return this.Rc(g).Af(c.Rc(g));
    }
    IDb(c) {
        return a(this.O, c);
    }
    K3a() {
        return new p(this.O,this.$);
    }
    compare(c, g) {
        var f;
        if (this.O === g.O)
            return c(this.$, g.$);
        f = a(this.O, g.O);
        return c(this.Rc(f).$, g.Rc(f).$);
    }
    equal(c) {
        return this.compare(function(g, f) {
            return g === f;
        }, c);
    }
    TT(c) {
        return this.compare(function(g, f) {
            return g !== f;
        }, c);
    }
    lessThan(c) {
        return this.compare(function(g, f) {
            return g < f;
        }, c);
    }
    greaterThan(c) {
        return this.compare(function(g, f) {
            return g > f;
        }, c);
    }
    Hn(c) {
        return this.compare(function(g, f) {
            return g <= f;
        }, c);
    }
    toJSON() {
        return {
            ticks: this.$,
            timescale: this.O
        };
    }
    toString() {
        return ("").concat(this.$, "/").concat(this.O);
    }
}
p.Ca = function(c) {
        return new p(c,1E3);
    }
    ;
    p.z7a = function(c, g) {
        return Math.floor(1E3 * c / g);
    }
    ;
    p.BKb = function(c, g) {
        return Math.floor(c * g / 1E3);
    }
    ;
    p.max = function() {
        for (var c = [], g = 0; g < arguments.length; g++)
            c[g] = arguments[g];
        return c.reduce(function(f, e) {
            return f.greaterThan(e) ? f : e;
        });
    }
    ;
    p.min = function() {
        for (var c = [], g = 0; g < arguments.length; g++)
            c[g] = arguments[g];
        return c.reduce(function(f, e) {
            return f.lessThan(e) ? f : e;
        });
    }
    ;
    p.VL = function(c, g) {
        var f;
        if (c.O === g.O)
            return new p(d(c.$, g.$),c.O);
        f = a(c.O, g.O);
        return p.VL(c.Rc(f), g.Rc(f));
    }
    ;
    Object.defineProperties(p.prototype, {
        $: {
            get: function() {
                return this.Wc;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        O: {
            get: function() {
                return this.Jb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        G: {
            get: function() {
                return 1E3 * this.Wc / this.Jb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        ri: {
            get: function() {
                return this.Wc / this.Jb;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.$f = function(c) {
        return this.compare(function(g, f) {
            return g >= f;
        }, c);
    }
    ;
    p.ia = new p(0,1);
    p.bz = new p(1,1E3);
    return p;
}
)();
export const I = t;

// Detected exports: I
