/**
 * Netflix Cadmium Playercore - Module 73548
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: kDa
 */

// Webpack module 73548
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const kDa = undefined;
d = a(15913);  // import from Module_15913
t = (function() {
    function p(c) {
        this.daa = false;
        this.DD = [];
        this.config = c;
        this.Vpa = this.LRa();
    }
    Object.defineProperties(p.prototype, {
        sEb: {
            get: function() {
                return this.daa;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.drb = function(c) {
        this.Vpa.push(c, 1);
        this.daa = true;
    }
    ;
    p.prototype.zra = function() {
        var c, g;
        c = this;
        if (this.daa) {
            g = this.Vpa.kk(this.config.dF).map(function(f) {
                return c.config.P3 ? Math.round(f) : f;
            });
            this.DD.push(g);
            g = this.config.Q1;
            this.DD.length > g && (this.DD = this.DD.slice(-g));
        }
    }
    ;
    p.prototype.ETb = function() {
        this.Vpa = this.LRa();
        this.daa = false;
    }
    ;
    p.prototype.Wq = function() {
        return {
            DD: this.DD,
            p$: this.DD.length
        };
    }
    ;
    p.prototype.reset = function() {
        this.Vpa = this.LRa();
        this.daa = false;
        this.DD = [];
    }
    ;
    p.prototype.LRa = function() {
        return new d.TDigest(this.config.PD,this.config.R1);
    }
    ;
    return p;
}
)();
b.kDa =

// Detected exports: kDa
