/**
 * Netflix Cadmium Playercore - Module 97936
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Timing / scheduling
 * Exports: xG
 */

// Webpack module 97936
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const xG = undefined;
t = (function() {
    function a(d, p) {
        var c;
        c = this;
        this.timeout = setTimeout(function() {
            c.timeout = undefined;
            d();
        }, p);
    }
    Object.defineProperties(a.prototype, {
        yr: {
            get: function() {
                if (this.timeout)
                    return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    a.prototype.clear = function() {
        if (this.timeout)
            return (clearTimeout(this.timeout),
            this.timeout = undefined,
            true);
    }
    ;
    return a;
}
)();
export const xG = t;

// Detected exports: xG
