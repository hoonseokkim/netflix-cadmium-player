/**
 * Netflix Cadmium Playercore - Module 54953
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Q9a
 */

// Webpack module 54953
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Q9a = undefined;
d = a(91176);  // import from Module_91176
p = a(52571);  // import from Module_52571
c = a(59034);  // import from Module_59034
t = (function() {
    function g(f, e) {
        var h;
        h = this;
        this.config = f;
        this.r8a = 0;
        this.bY = {};
        e.on("adEvent", function(k) {
            return h.T0a(k);
        });
    }
    Object.defineProperties(g.prototype, {
        fu: {
            get: function() {
                var f, e;
                f = this;
                e = {};
                Object.keys(this.bY).forEach(function(h) {
                    e[h] = f.bY[h].state;
                });
                return e;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Vza = function(f, e) {
        var h;
        h = this.bY[f];
        h || (h = new c.Anb(this.config),
        this.bY[f] = h);
        h.Vza(e);
    }
    ;
    g.prototype.reset = function() {
        this.r8a = 0;
    }
    ;
    g.prototype.T0a = function(f) {
        var e;
        e = this;
        "adComplete" === f.event && Object.keys(this.bY).some(function(h) {
            var k, l, m;
            h = null !== (k = (m = e.fu)[h]) && undefined !== k ? k : m[h] = [];
            (0,
            p.assert)(undefined !== f.Ub, "complete event should have an adBreakIndex");
            return null === (l = h[f.Ub].yb) || undefined === l ? undefined : l.some(function(n) {
                return n.id == f.S.R ? (n.ah = true,
                e.r8a++,
                true) : false;
            });
        });
    }
    ;
    g.prototype.OSa = function(f) {
        var e;
        e = this;
        Object.keys(this.bY).forEach(function(h) {
            e.fu[h].forEach(function(k) {
                k.yb.forEach(function(l) {
                    l.id == f && (l.yE = true);
                });
            });
        });
    }
    ;
    g.prototype.OUa = function(f, e) {
        return (f = this.fu[f]) && (0,
        d.kc)(f, function(h) {
            return new d.YX(h.Ga,h.Ga.add(h.Zk || d.I.ia)).OZ(e, "ms");
        });
    }
    ;
    g.prototype.Vuc = function(f, e) {
        return (f = this.fu[f]) && (0,
        d.kc)(f, function(h) {
            return h.kj === e;
        });
    }
    ;
    return g;
}
)();
b.Q9a =

// Detected exports: Q9a
