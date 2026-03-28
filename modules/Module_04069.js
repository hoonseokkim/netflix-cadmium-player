/**
 * Netflix Cadmium Playercore - Module 4069
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: jh
 */

// Webpack module 4069
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const jh = undefined;
t = (function() {
    function a(d) {
        undefined === d && (d = false);
        this.vvb = d;
        this.count = 0;
        this.Fa = NaN;
        this.Jt = 0;
        this.max = this.min = NaN;
    }
    Object.defineProperties(a.prototype, {
        nF: {
            get: function() {
                return this.max - this.min;
            },
            enumerable: false,
            configurable: true
        }
    });
    a.prototype.push = function(d) {
        this.count++;
        this.Jt += d;
        1 === this.count ? this.Fa = this.min = this.max = d : (this.min = Math.min(d, this.min),
        this.max = Math.max(d, this.max),
        this.Fa += (d - this.Fa) / this.count);
    }
    ;
    a.prototype.toJSON = function() {
        return this.vvb || 0 === this.count ? {
            count: this.count
        } : {
            min: this.min,
            max: this.max,
            average: this.Fa,
            count: this.count,
            sum: this.Jt
        };
    }
    ;
    a.prototype.Jn = function(d) {
        var p;
        if (0 === this.count)
            return d;
        if (0 === d.count)
            return this;
        p = new a(this.vvb);
        p.count = this.count;
        p.Fa = this.Fa;
        p.Jt = this.Jt;
        p.min = Math.min(this.min, d.min);
        p.max = Math.max(this.max, d.max);
        for (var c = 0; c < d.count; c++)
            p.push(d.Fa);
        return p;
    }
    ;
    return a;
}
)();
export const jh = t;

// Detected exports: jh
