/**
 * Netflix Cadmium Playercore - Module 82071
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: cgb
 */

// Webpack module 82071
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const cgb = undefined;
d = a(91176);  // import from Module_91176
p = a(63616);  // import from Module_63616
t = (function() {
    function c(g) {
        this.type = p.mK.LOW_THROUGHPUT;
        this.stop = this.start = this.aL = d.eh;
        this.getState = d.oN;
        this.Jg = d.nN;
        this.flush = d.eh;
        this.Me = this.zT = this.d_ = 0;
        this.config = g;
    }
    c.prototype.YK = function(g, f, e) {
        0 >= g || e <= f || (this.Me++,
        f = e - f,
        8 * g / f < this.config.LV ? (this.d_ += f,
        this.d_ > this.zT && (this.zT = this.d_)) : this.d_ = 0);
    }
    ;
    c.prototype.Wq = function() {
        return {
            zT: this.zT,
            LV: this.config.LV,
            Me: this.Me
        };
    }
    ;
    c.prototype.reset = function() {
        this.Me = this.zT = this.d_ = 0;
    }
    ;
    return c;
}
)();
b.cgb =

// Detected exports: cgb
