/**
 * Netflix Cadmium Playercore - Module 33543
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: YCa
 */

// Webpack module 33543
// Parameters: t (module), b (exports), a (require)

var p, c;
function d() {}
export const YCa = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
p = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15
};
d.prototype.decode = function(g) {
    for (var f = new Uint8Array(g.length / 2), e = 0; e < f.length; e++)
        f[e] = this.iVb(g.substr(2 * e, 2));
    return f;
}
;
d.prototype.encode = function(g) {
    var k;
    for (var f = "", e = g.length, h = 0; h < e; h++) {
        k = g[h];
        f += ("0123456789ABCDEF")[k >>> 4] + ("0123456789ABCDEF")[k & 15];
    }
    return f;
}
;
d.prototype.Ora = function(g, f) {
    var e;
    e = "";
    for (f <<= 1; f--; )
        (e = (("0123456789ABCDEF")[g & 15] || "0") + e,
        g >>>= 4);
    return e;
}
;
d.prototype.iVb = function(g) {
    var f;
    f = g.length;
    if (7 < f)
        throw Error("hex to long");
    for (var e = 0, h = 0; h < f; h++)
        e = 16 * e + p[g[h]];
    return e;
}
;
c = d;
export const YCa = c;
b.YCa = c = t.__decorate([(0,
a.aa)()],

// Detected exports: YCa
