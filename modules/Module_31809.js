/**
 * Netflix Cadmium Playercore - Module 31809
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: zkb
 */

// Webpack module 31809
// Parameters: t (module), b (exports), a (require)

var d, p;
export const zkb = undefined;
d = 0 - a(22970).__importDefault(a(51411)).default.kf;
"undefined" !== typeof Da && (p = Da.msCrypto || Da.crypto);
t = (function() {
    function c() {}
    c.prototype.KKc = function() {
        var f;
        for (var g = d; g == d; ) {
            g = new Uint8Array(7);
            p.getRandomValues(g);
            f = 16777216 * ((g[6] & 31) << 24 | g[5] << 16 | g[4] << 8 | g[3]) + (g[2] << 16 | g[1] << 8 | g[0]);
            g = g[6] & 128 ? -f - 1 : f;
        }
        return g;
    }
    ;
    c.prototype.GKc = function(g) {
        var e, h;
        for (var f = 0; ; ) {
            e = Math.min(65536, g.length - f);
            if (0 == e)
                break;
            h = new Uint8Array(e);
            p.getRandomValues(h);
            g.set(h, f);
            f += e;
        }
    }
    ;
    return c;
}
)();
b.zkb =

// Detected exports: zkb
