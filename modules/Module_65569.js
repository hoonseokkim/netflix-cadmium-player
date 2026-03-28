/**
 * Netflix Cadmium Playercore - Module 65569
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: klb
 */

// Webpack module 65569
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const klb = undefined;
t = (function() {
    function a() {
        this.sza = false;
    }
    Object.defineProperties(a.prototype, {
        AEc: {
            get: function() {
                return this.sza;
            },
            enumerable: false,
            configurable: true
        }
    });
    a.prototype.LZc = function() {
        var d;
        d = this;
        this.sza || (this.sza = true,
        setTimeout(function() {
            return d.HMc();
        }, 1));
    }
    ;
    a.prototype.HMc = function() {
        this.sza = false;
    }
    ;
    return a;
}
)();
export const klb = t;

// Detected exports: klb
