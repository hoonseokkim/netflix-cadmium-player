/**
 * Netflix Cadmium Playercore - Module 11862
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: p8
 */

// Webpack module 11862
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const p8 = undefined;
t = (function() {
    function a(d) {
        this.sA = d;
    }
    Object.defineProperties(a.prototype, {
        d1: {
            get: function() {
                return this.L8b;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        result: {
            get: function() {
                return this.sA;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        iVc: {
            get: function() {
                var d;
                d = this;
                return this.sA.then(function() {
                    return d;
                });
            },
            enumerable: false,
            configurable: true
        }
    });
    a.prototype.cancel = function() {
        this.L8b = true;
    }
    ;
    a.prototype.ZE = function(d, p) {
        var c;
        c = this;
        this.result.then(function(g) {
            c.d1 ? p && p(g) : d(g);
        });
        return this;
    }
    ;
    return a;
}
)();
export const p8 = t;

// Detected exports: p8
