/**
 * Netflix Cadmium Playercore - Module 71913
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: vja
 */

// Webpack module 71913
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const vja = undefined;
t = (function() {
    function a(d, p) {
        this.nw = undefined;
        this.ro = d;
        this.HD = p;
    }
    a.prototype.$G = function(d, p, c) {
        var g, f, e;
        if (!(0 >= d || c <= p)) {
            g = c - p;
            undefined === this.nw && (this.nw = p - p % this.ro);
            if (!(c <= this.nw)) {
                f = p;
                p = this.nw;
                for (f < p && (f = p); f < c; )
                    if ((p = this.nw + this.ro,
                    f >= p))
                        (this.HD.A2(),
                        this.nw = f - f % this.ro,
                        this.HD.D2());
                    else if (c <= p) {
                        f = c - f;
                        e = f / g * d;
                        this.HD.fxa(e, f);
                        break;
                    } else
                        (f = p - f,
                        e = f / g * d,
                        this.HD.fxa(e, f),
                        this.HD.A2(),
                        this.nw = p,
                        this.HD.D2(),
                        f = p);
            }
        }
    }
    ;
    a.prototype.Mgc = function(d) {
        undefined === this.nw ? (this.nw = d - d % this.ro,
        this.HD.D2()) : d >= this.nw + this.ro && (this.HD.A2(),
        this.nw = d - d % this.ro,
        this.HD.D2());
    }
    ;
    a.prototype.flush = function() {
        undefined !== this.nw && this.HD.A2();
    }
    ;
    a.prototype.reset = function() {
        this.nw = undefined;
    }
    ;
    return a;
}
)();
export const vja = t;

// Detected exports: vja
