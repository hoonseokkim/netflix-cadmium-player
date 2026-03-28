/**
 * Netflix Cadmium Playercore - Module 23267
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: rK
 */

// Webpack module 23267
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const rK = undefined;
d = a(66164);  // import from Module_66164
t = (function() {
    function p() {}
    Object.defineProperties(p.prototype, {
        duration: {
            get: function() {
                return undefined !== this.endTime ? this.endTime - this.startTime : 0;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.start = function() {
        this.reset();
    }
    ;
    p.prototype.reset = function() {
        this.startTime = d.platform.time.fa();
        this.endTime = undefined;
    }
    ;
    p.prototype.stop = function() {
        this.endTime = d.platform.time.fa();
    }
    ;
    return p;
}
)();
b.rK =

// Detected exports: rK
