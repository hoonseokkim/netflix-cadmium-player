/**
 * Netflix Cadmium Playercore - Module 30033
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: ZCa
 */

// Webpack module 30033
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d() {}
export const ZCa = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
c = Array.prototype.slice;
g = c.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
c = c.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_");
f = {};
e = {};
h = {};
k = {};
l = /\s+/g;
[g, c].forEach(function(m) {
    var q;
    for (var n = m.length; n--; ) {
        q = m[n];
        f[q] = n << 18;
        e[q] = n << 12;
        h[q] = n << 6;
        k[q] = n;
    }
});
d.prototype.encode = function(m) {
    return p.mTa(m, g, "=");
}
;
d.prototype.decode = function(m) {
    return p.bSa(m);
}
;
d.bSa = function(m) {
    var n, q, r;
    m = m.replace(l, "");
    n = m.length;
    q = m.charAt(n - 1);
    "=" !== q && "." !== q || n--;
    q = m.charAt(n - 1);
    "=" !== q && "." !== q || n--;
    q = 3 * (n >> 2);
    r = 0;
    switch (n % 4) {
    case 2:
        r = 1;
        break;
    case 3:
        r = 2;
        break;
    case 1:
        throw Error("bad base64");
    }
    n = new Uint8Array(q + r);
    for (var u = 0, v = 0, w; v < q; ) {
        w = f[m[u++]] + e[m[u++]] + h[m[u++]] + k[m[u++]];
        if (!(0 <= w && 16777215 >= w))
            throw Error("bad base64");
        n[v++] = w >>> 16;
        n[v++] = w >>> 8 & 255;
        n[v++] = w & 255;
    }
    if (0 < r && (w = f[m[u++]] + e[m[u++]],
    n[v++] = w >>> 16,
    1 < r && (w += h[m[u++]],
    n[v++] = w >>> 8 & 255),
    !(0 <= w && 16776960 >= w && 0 === (w & (1 < r ? 255 : 65535)))))
        throw Error("bad base64");
    return n;
}
;
d.mTa = function(m, n, q) {
    for (var r = "", u = 0, v = m.length, w = v - 2, x; u < w; ) {
        x = (m[u++] << 16) + (m[u++] << 8) + m[u++];
        if (!(0 <= x && 16777215 >= x))
            throw Error("not bytes");
        r += n[x >>> 18] + n[x >>> 12 & 63] + n[x >>> 6 & 63] + n[x & 63];
    }
    if (u == w) {
        x = (m[u++] << 8) + m[u++];
        if (!(0 <= x && 65535 >= x))
            throw Error("not bytes");
        r += n[x >>> 10] + n[x >>> 4 & 63] + n[x << 2 & 63] + q;
    } else if (u == v - 1) {
        x = m[u++];
        if (!(0 <= x && 255 >= x))
            throw Error("not bytes");
        r += n[x >>> 2] + n[x << 4 & 63] + q + q;
    }
    return r;
}
;
c = p = d;
export const ZCa = c;
b.ZCa = c = p = t.__decorate([(0,
a.aa)()],

// Detected exports: ZCa
