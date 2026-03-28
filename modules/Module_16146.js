/**
 * Netflix Cadmium Playercore - Module 16146
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: G7
 */

// Webpack module 16146
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const G7 = undefined;
d = a(65161);  // import from Module_65161
t = (function() {
    function p() {
        this[d.l.V] = 0;
        this[d.l.U] = 0;
        this[d.l.Ea] = 0;
        this[d.l.yk] = 0;
    }
    Object.defineProperties(p.prototype, {
        total: {
            get: function() {
                return this[d.l.V] + this[d.l.U] + this[d.l.Ea];
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.add = function(c) {
        this[d.l.V] += Math.max(c[d.l.V] || 0, 0);
        this[d.l.U] += Math.max(c[d.l.U] || 0, 0);
        this[d.l.Ea] += Math.max(c[d.l.Ea] || 0, 0);
    }
    ;
    p.prototype.AOa = function(c, g) {
        this[c] += Math.max(g || 0, 0);
    }
    ;
    return p;
}
)();
export const G7 = t;
d.l.V;
d.l.U;
d.l.Ea;
d.l.

// Detected exports: G7
