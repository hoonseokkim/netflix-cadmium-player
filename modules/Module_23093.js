/**
 * Netflix Cadmium Playercore - Module 23093
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: ekb
 */

// Webpack module 23093
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ekb = undefined;
t = (function() {
    function a() {
        this.aH = "NONE";
        this.vu = this.Yn = -1;
        this.Ky = this.Ku = false;
        this.q3 = 0;
    }
    Object.defineProperties(a.prototype, {
        tda: {
            get: function() {
                return 0 === this.q3;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        sXa: {
            get: function() {
                return -1 !== this.Yn;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        bBc: {
            get: function() {
                return -1 !== this.vu;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        Ho: {
            get: function() {
                return this.Ku && this.bBc && this.sXa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        ZFb: {
            get: function() {
                return "DECREASING" === this.aH;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        YDc: {
            get: function() {
                return "INCREASING" === this.aH;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        HEc: {
            get: function() {
                return "NONE" === this.aH;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        aua: {
            get: function() {
                return "DISABLED" === this.aH;
            },
            enumerable: false,
            configurable: true
        }
    });
    return a;
}
)();
export const ekb = t;

// Detected exports: ekb
