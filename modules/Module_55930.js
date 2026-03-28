/**
 * Netflix Cadmium Playercore - Module 55930
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: Mkb
 */

// Webpack module 55930
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Mkb = undefined;
d = a(91176);  // import from Module_91176
p = a(63616);  // import from Module_63616
t = (function() {
    function c() {
        this.type = p.mK.RESPONSE_TIME_AVERAGE;
        this.stop = this.start = this.YK = d.eh;
        this.getState = d.oN;
        this.Jg = d.nN;
        this.flush = d.eh;
        this.count = this.Jt = 0;
    }
    c.prototype.aL = function(g) {
        !isFinite(g) || 0 > g || (this.count++,
        this.Jt += g);
    }
    ;
    c.prototype.Wq = function() {
        return {
            Idc: 0 < this.count ? Math.round(this.Jt / this.count) : undefined,
            Me: this.count
        };
    }
    ;
    c.prototype.reset = function() {
        this.count = this.Jt = 0;
    }
    ;
    return c;
}
)();
b.Mkb =

// Detected exports: Mkb
