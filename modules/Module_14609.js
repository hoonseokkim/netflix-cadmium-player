/**
 * Netflix Cadmium Playercore - Module 14609
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Vjb
 */

// Webpack module 14609
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Vjb = undefined;
d = a(22970);  // import from Module_22970
p = a(91967);  // import from Module_91967
t = (function() {
    function c(g) {
        this.Uc = g;
        d.__assign(d.__assign({}, g), {
            failed: true
        });
    }
    Object.defineProperties(c.prototype, {
        ic: {
            get: function() {
                return "PrefetchFailureReporter";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        um: {
            get: function() {
                return "prefetch";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        enabled: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.Ph = function(g) {
        if (g.Ui === p.Sc.Gm)
            return this.Uc;
    }
    ;
    return c;
}
)();
b.Vjb =

// Detected exports: Vjb
