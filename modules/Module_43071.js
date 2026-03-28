/**
 * Netflix Cadmium Playercore - Module 43071
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: hbb, jbb
 */

// Webpack module 43071
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const hbb = b.jbb = undefined;
d = a(63576);  // import from Module_63576
p = a(47233);  // import from Module_47233
c = a(76753);  // import from Module_76753
export const jbb = 625E3;
t = (function() {
    function g(f, e) {
        this.console = f;
        this.config = e;
    }
    g.prototype.aQa = function(f) {
        var e, h, k, l, m, n;
        e = this;
        h = this.config.hqa;
        k = this.config.Sid || this.config.gqa;
        l = 0 < f.cXa.hI && Infinity !== f.cXa.hI;
        m = l ? k * b.jbb / 1E3 : this.config.AT || Infinity;
        n = l ? Math.floor(f.cXa.hI / m) : h;
        return {
            Up: f.R4c.sort(function(q, r) {
                return q.priority - r.priority;
            }).slice(0, h).map(function(q, r) {
                var u;
                u = q.key.config;
                return {
                    IGb: {
                        hI: r > n - 1 ? 0 : m
                    },
                    Nd: q,
                    fya: 1,
                    Hl: u,
                    fUb: {
                        audio: [(0,
                        d.Z$)(u), new p.UKa(), new c.SFa()],
                        video: [(0,
                        d.$$)(e.console, u), new p.UKa(), new c.SFa()]
                    }
                };
            })
        };
    }
    ;
    return g;
}
)();
b.hbb =

// Detected exports: hbb, jbb
