/**
 * Netflix Cadmium Playercore - Module 59034
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Anb
 */

// Webpack module 59034
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Anb = undefined;
d = a(81749);  // import from Module_81749
t = (function() {
    function p(c) {
        this.config = c;
        this.jOa = [];
    }
    Object.defineProperties(p.prototype, {
        state: {
            get: function() {
                return this.jOa;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.Vza = function(c) {
        var g, f;
        g = this;
        f = [];
        c.forEach(function(e, h) {
            var k;
            k = g.jOa[h];
            k ? (f.push(k),
            k.oWb(e, h)) : (e = g.Zlc(e, h),
            f.push(e));
        });
        this.jOa = f;
    }
    ;
    p.prototype.Zlc = function(c, g) {
        return new d.i$a(this.config,c,g,c.state.Pu);
    }
    ;
    return p;
}
)();
b.Anb =

// Detected exports: Anb
