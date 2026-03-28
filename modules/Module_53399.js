/**
 * Netflix Cadmium Playercore - Module 53399
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: ALa
 */

// Webpack module 53399
// Parameters: t (module), b (exports), a (require)

var p, c;
function d() {}
export const ALa = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
d.prototype.encode = function(g) {
    return p.mTa(g);
}
;
d.prototype.decode = function(g) {
    return p.bSa(g);
}
;
d.mTa = function(g) {
    if (!g)
        throw new TypeError("Invalid byte array");
    for (var f = 0, e, h = g.length, k = ""; f < h; ) {
        e = g[f++];
        if (!(0 <= e && 255 >= e))
            throw Error("bad utf8");
        if (e & 128)
            if (192 === (e & 224))
                e = ((e & 31) << 6) + (g[f++] & 63);
            else if (224 === (e & 240))
                e = ((e & 15) << 12) + ((g[f++] & 63) << 6) + (g[f++] & 63);
            else
                throw Error("unsupported utf8 character");
        k += String.fromCharCode(e);
    }
    return k;
}
;
d.bSa = function(g) {
    var f, e, h, k, l;
    f = g.length;
    e = 0;
    k = 0;
    if (!(0 <= f))
        throw Error("bad string");
    for (h = f; h--; ) {
        l = g.charCodeAt(h);
        128 > l ? e++ : e = 2048 > l ? e + 2 : e + 3;
    }
    e = new Uint8Array(e);
    for (h = 0; h < f; h++)
        (l = g.charCodeAt(h),
        128 > l ? e[k++] = l : (2048 > l ? e[k++] = 192 | l >>> 6 : (e[k++] = 224 | l >>> 12,
        e[k++] = 128 | l >>> 6 & 63),
        e[k++] = 128 | l & 63));
    return e;
}
;
c = p = d;
export const ALa = c;
b.ALa = c = p = t.__decorate([(0,
a.aa)()],

// Detected exports: ALa
