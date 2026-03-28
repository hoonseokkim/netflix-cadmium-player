/**
 * Netflix Cadmium Playercore - Module 51117
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Dka
 */

// Webpack module 51117
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Dka = undefined;
d = a(68157);  // import from Module_68157
t = (function() {
    function p(c, g) {
        this.o0a = c;
        this.xg = g;
        0 < g ? (this.hHb = g = Math.pow(c, 3) / g,
        c = 2 * g / c,
        500 >= c && (this.PTa = Math.exp(c))) : this.PTa = 0;
    }
    p.prototype.Ftb = function(c) {
        var g, f, e;
        g = this.o0a;
        f = this.PTa;
        if (f && 0 < c) {
            e = Math.sqrt(this.hHb / (2 * c));
            g = c / g;
            c = (0,
            d.Vaa)(e * (g - 1));
            e = (0,
            d.Vaa)(e * (g + 1));
            return Math.max((2 - c + f * e) / 2, 0);
        }
        return c < g ? 0 : c > g ? 1 : .5;
    }
    ;
    p.prototype.xU = function(c, g, f) {
        for (var e = 0, h = this.o0a + 5 * Math.sqrt(this.xg), k = 1, l = 0; Math.abs(k) > g && f--; )
            (l = (e + h) / 2,
            k = this.Ftb(l),
            k = c - k,
            0 > k ? h = l : e = l);
        return l;
    }
    ;
    p.prototype.rgc = function(c) {
        var g, f, e, h;
        g = this.o0a;
        f = this.PTa;
        if (f && 0 < c) {
            e = Math.sqrt(this.hHb / (2 * c));
            h = c / g;
            c = 2 - (0,
            d.Vaa)(e * (h - 1));
            f *= (0,
            d.Vaa)(e * (h + 1));
            return [Math.max((c + f) / 2, 0), Math.max(g * (c - f) / 2, 0)];
        }
        return c < g ? [0, 0] : c > g ? [1, g] : [.5, g / 2];
    }
    ;
    return p;
}
)();
b.Dka =

// Detected exports: Dka
