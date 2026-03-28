/**
 * Netflix Cadmium Playercore - Module 51290
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: vmb
 */

// Webpack module 51290
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const vmb = undefined;
d = a(91176);  // import from Module_91176
p = a(63616);  // import from Module_63616
t = (function() {
    function c() {
        this.type = p.mK.THROUGHPUT_COEFFICIENT_OF_VARIATION;
        this.stop = this.start = this.aL = d.eh;
        this.getState = d.oN;
        this.Jg = d.nN;
        this.flush = d.eh;
        this.lva = this.Gf = this.count = 0;
    }
    c.prototype.YK = function(g, f, e) {
        0 >= g || e <= f || (g = 8 * g / (e - f),
        this.count++,
        f = g - this.Gf,
        this.Gf += f / this.count,
        this.lva += f * (g - this.Gf));
    }
    ;
    c.prototype.Wq = function() {
        return 2 > this.count || 0 === this.Gf ? {
            Nwb: 0,
            Me: this.count
        } : {
            Nwb: Math.sqrt(Math.max(0, this.lva / this.count)) / this.Gf,
            Me: this.count
        };
    }
    ;
    c.prototype.reset = function() {
        this.lva = this.Gf = this.count = 0;
    }
    ;
    return c;
}
)();
b.vmb =

// Detected exports: vmb
