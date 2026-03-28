/**
 * Netflix Cadmium Playercore - Module 35982
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: gK
 */

// Webpack module 35982
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const gK = undefined;
d = a(32296);  // import from Module_32296
p = {
    stsd: 16
};
b.gK = (function() {
    function c() {}
    c.path = function(g, f) {
        var m, n;
        for (var e = 0, h = g.byteLength, k, l = 0; l < f.length; l++) {
            m = f[l];
            for (k && (e += p[k] || 8); e < h; ) {
                n = g.getUint32(e);
                k = (0,
                d.wK)(g.getUint32(e + 4));
                if (k === m) {
                    h = e + n;
                    break;
                }
                if (0 === n)
                    return {};
                e += n;
            }
        }
        return e < h ? {
            offset: e,
            end: h
        } : {};
    }
    ;
    c.uzb = function(g) {
        var f, e, h, k, l;
        f = this.path(g, ["moof", "traf"]  /* config: moof = "traf" */).offset;
        if (undefined !== f) {
            g = new DataView(g.buffer,g.byteOffset + f + 8);
            e = this.path(g, ["tfdt"]).offset;
            if (undefined !== e) {
                1 === g.getUint8(e + 8) ? (f = g.getUint32(e + 12),
                e = g.getUint32(e + 16),
                f = 4294967296 * f + e) : f = g.getUint32(e + 12);
                h = this.path(g, ["trun"]).offset;
                if (undefined === h)
                    return {
                        X4: f
                    };
                k = g.getUint8(h + 8);
                l = g.getUint32(h + 8) & 16777215;
                e = g.getUint32(h + 12);
                l & 2048 ? (h = h + 16 + ((l & 1) << 2) + (l & 4) + (((l & 256) >> 6) + ((l & 512) >> 7) + ((l & 1024) >> 8)),
                g = 1 === k ? g.getInt32(h) : g.getUint32(h)) : g = 0;
                return {
                    X4: f,
                    vy: g,
                    Me: e
                };
            }
        }
    }
    ;
    return c;
}
)

// Detected exports: gK
