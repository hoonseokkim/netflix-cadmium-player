/**
 * Netflix Cadmium Playercore - Module 46759
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Gjb
 */

// Webpack module 46759
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Gjb = undefined;
d = a(22970);  // import from Module_22970
p = a(48170);  // import from Module_48170
c = a(69575);  // import from Module_69575
g = a(91967);  // import from Module_91967
f = a(5653);  // import from Module_05653
t = (function() {
    function e(h, k) {
        var l;
        l = this;
        this.G2a = h;
        this.ka = k;
        this.XNb = new c.jh();
        k.events.on("branchesReevaluated", function() {
            l.XNb.push(h.size);
        });
    }
    Object.defineProperties(e.prototype, {
        ic: {
            get: function() {
                return "playgraph-branch-audit";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        um: {
            get: function() {
                return "paudit";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        enabled: {
            get: function() {
                return p.u;
            },
            enumerable: false,
            configurable: true
        }
    });
    e.prototype.Ph = function(h) {
        var k;
        h = h.Ui;
        if (h === g.Sc.Mr || h === g.Sc.Wj) {
            k = {
                branchCountStats: this.XNb.toJSON(),
                decisions: this.ka.fi.toJSON(),
                player: this.ka.player.Hw ? this.ka.player.bb.map(function(l) {
                    return l.K.id;
                }) : []
            };
            this.G2a.forEach(function(l, m) {
                var n, q;
                q = (0,
                f.$Ua)(l);
                k[m] = d.__assign({
                    probabilities: l.xh.map(function(r) {
                        return {
                            duration: r.duration,
                            immediate: r.kM,
                            seamless: r.qf
                        };
                    }),
                    parent: null === (n = l.parent) || undefined === n ? undefined : n.K.id,
                    normalized: l.ag,
                    hasViewable: l.om,
                    headerRequested: l.om && l.L.FEb
                }, q);
            });
            return k;
        }
    }
    ;
    return e;
}
)();
b.Gjb =

// Detected exports: Gjb
