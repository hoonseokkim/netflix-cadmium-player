/**
 * Netflix Cadmium Playercore - Module 24500
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t)
 */

// Webpack module 24500
// Parameters: t (module), exports (exports), N/A (require)


var b;
b = (function() {
    var a;
    a = new Uint32Array([0, 0]);
    a.set(new Uint32Array([16843009]), 1);
    return 0 !== a[0];
}
)() ? function(a, d, p) {
    new Uint8Array(a.buffer,a.byteOffset,a.byteLength).set(new Uint8Array(d.buffer,d.byteOffset,d.byteLength), p * a.byteLength / a.length);
}
: function(a, d, p) {
    a.set(d, p);
}
;
t.exports = {
    from: function(a, d, p, c) {
        a = new a(d.length);
        for (var g = "function" === typeof p, f = 0; f < d.length; ++f)
            a[f] = g ? p.call(c, d[f], f, d) : d[f];
        return a;
    },
    set: b
};
