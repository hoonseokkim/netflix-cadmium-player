/**
 * Netflix Cadmium Playercore - Module 59839
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Mjb
 */

// Webpack module 59839
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Mjb = undefined;
d = a(16146);  // import from Module_16146
t = (function() {
    function p() {
        this.lw = new d.G7();
        this.Caa = new d.G7();
    }
    Object.defineProperties(p.prototype, {
        total: {
            get: function() {
                var c;
                c = new d.G7();
                c.add(this.lw);
                c.add(this.Caa);
                return c;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.add = function(c) {
        this.lw.add(c.lw);
        this.Caa.add(c.Caa);
    }
    ;
    p.prototype.AOa = function(c, g, f) {
        (f ? this.Caa : this.lw).AOa(c, g);
    }
    ;
    return p;
}
)();
b.Mjb =

// Detected exports: Mjb
