/**
 * Netflix Cadmium Playercore - Module 80735
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Error handling
 * Exports: fla
 */

// Webpack module 80735
// Parameters: t, b

function a(d) {
    var p, f, e;
    p = d.length;
    if (!(0 <= p))
        throw Error("bad string");
    for (var c = 0, g = p; g--; ) {
        f = d.charCodeAt(g);
        128 > f ? c++ : c = 2048 > f ? c + 2 : c + 3;
    }
    c = new Uint8Array(c);
    e = 0;
    for (g = 0; g < p; g++)
        (f = d.charCodeAt(g),
        128 > f ? c[e++] = f : (2048 > f ? c[e++] = 192 | f >>> 6 : (c[e++] = 224 | f >>> 12,
        c[e++] = 128 | f >>> 6 & 63),
        c[e++] = 128 | f & 63));
    return c;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const fla = undefined;
t = (function() {
    function d(p, c, g) {
        this.header = p;
        this.body = c;
        this.$qa = g;
    }
    d.prototype.encode = function(p) {
        var c;
        c = (this.$qa || a)(JSON.stringify(this.header));
        p.rW(c.length);
        p.c9a(c);
        p.c9a(this.body);
    }
    ;
    return d;
}
)();
export const fla = t;

// Detected exports: fla
