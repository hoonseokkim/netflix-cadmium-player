/**
 * Netflix Cadmium Playercore - Module 16899
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: rfb
 */

// Webpack module 16899
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const rfb = undefined;
t = (function() {
    function a() {
        this.NAa = this.OAa = this.PAa = this.E4 = this.Me = 0;
        this.Era = null;
    }
    a.prototype.$G = function(d, p) {
        d /= 1E3;
        null === this.Era && (this.Era = d);
        d -= this.Era;
        this.Me++;
        this.E4 += d;
        this.PAa += p;
        this.OAa += d * p;
        this.NAa += d * d;
    }
    ;
    a.prototype.szc = function() {
        var d;
        if (!(2 > this.Me)) {
            d = this.Me * this.NAa - this.E4 * this.E4;
            return 0 === d ? 0 : (this.Me * this.OAa - this.E4 * this.PAa) / d;
        }
    }
    ;
    a.prototype.reset = function() {
        this.NAa = this.OAa = this.PAa = this.E4 = this.Me = 0;
        this.Era = null;
    }
    ;
    return a;
}
)();
export const rfb = t;

// Detected exports: rfb
