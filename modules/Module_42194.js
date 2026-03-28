/**
 * Netflix Cadmium Playercore - Module 42194
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: jtb
 */

// Webpack module 42194
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const jtb = undefined;
d = a(50599);  // import from Module_50599
p = a(65044);  // import from Module_65044
export function jtb() {
    return function(c) {
        var e, h, k, l;
        function g(m) {
            l[m] = function(n) {
                return h({
                    rules: [{
                        nk: m,
                        config: n
                    }]
                }, true);
            }
            ;
        }
        function f(m) {
            e[m] = function(n) {
                return h({
                    rules: [{
                        nk: m,
                        config: n
                    }]
                });
            }
            ;
        }
        e = {};
        h = (0,
        d.map)(c.cJb);
        for (k in c.dV)
            f(k);
        e.WE = h({
            rules: [],
            SOa: true
        });
        e.Fr = h({
            rules: [],
            Fr: true
        });
        l = {};
        for (k in c.dV)
            g(k);
        l.WE = h({
            rules: [],
            SOa: true
        }, true);
        l.Fr = h({
            rules: [],
            Fr: true
        }, true);
        e.return = l;
        return {
            eSa: e,
            qza: c,
            Cya: function(m, n, q, r) {
                return (0,
                p.dwb)(m, n, q, c.dV, c.cJb, r);
            }
        };
    }
    ;
}

// Detected exports: jtb
