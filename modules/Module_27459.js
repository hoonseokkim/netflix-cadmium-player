/**
 * Netflix Cadmium Playercore - Module 27459
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Ojb
 */

// Webpack module 27459
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ojb = undefined;
t = (function() {
    function a(d) {
        this.wl = d.wl;
        this.sE = this.ECc();
    }
    a.prototype.G9 = function(d) {
        d.events.on("requestsPruned", this.sE);
    }
    ;
    a.prototype.tF = function(d) {
        d.events.removeListener("requestsPruned", this.sE);
    }
    ;
    a.prototype.ECc = function() {
        var d;
        d = this;
        return function() {
            return d.wl();
        }
        ;
    }
    ;
    return a;
}
)();
export const Ojb = t;

// Detected exports: Ojb
