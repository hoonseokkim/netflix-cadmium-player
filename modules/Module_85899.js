/**
 * Netflix Cadmium Playercore - Module 85899
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: Amb
 */

// Webpack module 85899
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Amb = undefined;
d = a(91176);  // import from Module_91176
p = a(63616);  // import from Module_63616
c = a(16899);  // import from Module_16899
t = (function() {
    function g() {
        this.type = p.mK.THROUGHPUT_TREND;
        this.flush = this.stop = this.start = this.aL = d.eh;
        this.getState = d.oN;
        this.Jg = d.nN;
        this.Uua = new c.rfb();
    }
    g.prototype.YK = function(f, e, h) {
        0 >= f || h <= e || this.Uua.$G((e + h) / 2, 8 * f / (h - e));
    }
    ;
    g.prototype.Wq = function() {
        var f;
        f = this.Uua.szc();
        return {
            m4: undefined !== f ? Math.round(f) : undefined,
            Me: this.Uua.Me
        };
    }
    ;
    g.prototype.reset = function() {
        this.Uua.reset();
    }
    ;
    return g;
}
)();
b.Amb =

// Detected exports: Amb
