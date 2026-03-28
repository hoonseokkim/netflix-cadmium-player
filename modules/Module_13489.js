/**
 * Netflix Cadmium Playercore - Module 13489
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: o_b
 */

// Webpack module 13489
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const o_b = undefined;
d = a(73550);  // import from Module_73550
p = (function() {
    function c(g, f, e) {
        this.M7b = g;
        this.Z7b = f;
        this.Bk = e;
        this.dna = false;
    }
    c.prototype.op = function() {
        this.dna || (this.eMa = this.M7b(this.Bk),
        this.KK = this.eMa.length,
        this.Bk = undefined,
        this.dna = true);
    }
    ;
    c.prototype.laa = function() {
        this.dna && (this.Bk = this.Z7b(this.eMa),
        this.eMa = undefined,
        this.dna = false);
    }
    ;
    Object.defineProperties(c.prototype, {
        data: {
            get: function() {
                this.laa();
                return this.Bk;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        size: {
            get: function() {
                return this.KK;
            },
            enumerable: false,
            configurable: true
        }
    });
    return c;
}
)();
t = (function() {
    function c() {
        this.flush();
    }
    c.prototype.set = function(g, f, e) {
        undefined === e && (e = true);
        g = this.JNa(g, f).ltb;
        e && g.op();
    }
    ;
    c.prototype.JNa = function(g, f) {
        var e, h;
        e = this;
        h = new p(undefined,undefined,f);
        f = new d.mX({
            name: "compression",
            cfa: function(k) {
                var l;
                k() && (null === (l = e.Bpa.get(g)) || undefined === l ? undefined : l.data) === h && h.op();
            }
        });
        this.Bpa.set(g, {
            data: h,
            BB: f
        });
        return {
            ltb: h,
            BB: f
        };
    }
    ;
    c.prototype.get = function(g) {
        if (g = this.Bpa.get(g))
            return {
                value: g.data,
                Qk: g.BB.wA()
            };
    }
    ;
    c.prototype.delete = function(g) {
        this.Bpa.delete(g);
    }
    ;
    c.prototype.flush = function() {
        this.Bpa = new Map();
    }
    ;
    return c;
}
)();
b.o_b =

// Detected exports: o_b
