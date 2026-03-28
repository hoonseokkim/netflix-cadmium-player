/**
 * Netflix Cadmium Playercore - Module 96965
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Chb
 */

// Webpack module 96965
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Chb = undefined;
t = a(66164);  // import from Module_66164
d = a(65161);  // import from Module_65161
new t.platform.Console("ASEJS_NETWORK_CONFIDENCE","media|asejs");
a = (function() {
    function p(c, g) {
        this.config = c;
        this.Zwa = g;
        this.kq = this.zL = this.la = 0;
        this.reset();
    }
    Object.defineProperties(p.prototype, {
        duration: {
            get: function() {
                return this.zL + this.kq;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.reset = function() {
        this.confidence = d.OP.HAVE_NOTHING;
        this.la = 0;
        this.startTime = undefined;
        this.kq = this.zL = 0;
    }
    ;
    p.prototype.su = function() {
        var c;
        c = new p(this.config,this.Zwa);
        c.confidence = this.confidence;
        c.la = this.la;
        c.startTime = this.startTime;
        c.zL = this.zL;
        c.kq = this.kq;
        return c;
    }
    ;
    p.prototype.add = function(c, g, f) {
        undefined === this.startTime && (this.startTime = g);
        this.la += c;
        this.zL = Math.max(f - this.startTime, this.zL);
        this.confidence = Math.max(this.confidence, d.OP.bX);
        this.confidence < d.OP.aX && (this.duration > this.config.Xva || this.la > this.config.Wva) && (this.confidence = d.OP.aX);
        this.confidence < d.OP.s6 && (this.duration > this.config.yya || this.la > this.config.xya) && (this.confidence = d.OP.s6,
        this.Zwa());
    }
    ;
    p.prototype.get = function() {
        return this.confidence;
    }
    ;
    p.prototype.start = function() {}
    ;
    p.prototype.stop = function() {
        this.config.p_c && (this.kq += this.zL,
        this.zL = 0,
        this.startTime = undefined);
    }
    ;
    p.prototype.flush = function() {}
    ;
    return p;
}
)();
b.Chb =

// Detected exports: Chb
