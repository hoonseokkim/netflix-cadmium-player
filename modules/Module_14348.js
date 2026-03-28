/**
 * Netflix Cadmium Playercore - Module 14348
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: lma
 */

// Webpack module 14348
// Parameters: t (module), b (exports), a (require)

var d, p;
export const lma = undefined;
d = a(22970);  // import from Module_22970
p = a(69193);  // import from Module_69193
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.Be = function(f, e) {
        if (!e || e === p.TC.yG) {
            e = 0;
            for (var h, k = f.length, l = ""; e < k; ) {
                h = f[e++];
                if (h & 128)
                    if (192 === (h & 224))
                        h = ((h & 31) << 6) + (f[e++] & 63);
                    else if (224 === (h & 240))
                        h = ((h & 15) << 12) + ((f[e++] & 63) << 6) + (f[e++] & 63);
                    else
                        throw Error("unsupported character");
                l += String.fromCharCode(h);
            }
            return l;
        }
        throw Error("unsupported encoding");
    }
    ;
    g.prototype.Ed = function(f, e) {
        var h, k, l, m;
        if (!e || e === p.TC.yG) {
            e = f.length;
            h = 0;
            l = 0;
            for (k = e; k--; ) {
                m = f.charCodeAt(k);
                128 > m ? h++ : h = 2048 > m ? h + 2 : h + 3;
            }
            h = new Uint8Array(h);
            for (k = 0; k < e; k++)
                (m = f.charCodeAt(k),
                128 > m ? h[l++] = m : (2048 > m ? h[l++] = 192 | m >>> 6 : (h[l++] = 224 | m >>> 12,
                h[l++] = 128 | m >>> 6 & 63),
                h[l++] = 128 | m & 63));
            return h;
        }
        throw Error("unsupported encoding");
    }
    ;
    return g;
}
)(p.smb);
b.lma =

// Detected exports: lma
