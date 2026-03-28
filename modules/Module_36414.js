/**
 * Netflix Cadmium Playercore - Module 36414
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Gab
 */

// Webpack module 36414
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Gab = undefined;
d = a(35779);  // import from Module_35779
p = a(48170);  // import from Module_48170
c = a(91967);  // import from Module_91967
t = (function() {
    function g(f, e) {
        this.zZc = f;
        this.Ej = e;
    }
    Object.defineProperties(g.prototype, {
        um: {
            get: function() {
                return ("cache-").concat(this.zZc);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        ic: {
            get: function() {
                return this.um;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        enabled: {
            get: function() {
                return p.u;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Ph = function(f) {
        var e, h, k;
        e = f.Ui;
        f = f.Xs;
        if (e === c.Sc.Gm || e === c.Sc.Mr || e === c.Sc.Wj || undefined === e && undefined === f) {
            h = (0,
            d.xBb)(this.Ej);
            e = Object.keys(h).filter(function(l) {
                return h[l].isEnabled;
            });
            if (e.length) {
                k = {};
                e.forEach(function(l) {
                    k[l] = {
                        hit: h[l].oZ,
                        idx: h[l].Zoa
                    };
                });
                return {
                    Icd: k
                };
            }
        }
    }
    ;
    return g;
}
)();
b.Gab =

// Detected exports: Gab
