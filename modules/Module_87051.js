/**
 * Netflix Cadmium Playercore - Module 87051
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Oad, Mad, Nad, Pad, jnd
 */

// Webpack module 87051
// Parameters: t (module), b (exports), a (require)

var d, p;
export function Oad(c, g, f) {
    for (f = (f - c.length) / g.length; 0 < f--; )
        c += g;
    return c;
}
;
export function Mad(c, g, f) {
    f = (0,
    d.Ri)(f) ? f : "...";
    return c.length <= g ? c : c.substr(0, c.length - (c.length + f.length - g)) + f;
}
;
export function Nad(c, g) {
    var e;
    for (var f = 1; f < arguments.length; ++f)
        ;
    e = p.slice.call(arguments, 1);
    return c.replace(/{(\d+)}/g, function(h, k) {
        return "undefined" != typeof e[k] ? e[k] : h;
    });
}
;
export function Pad(c) {
    for (var g = c.length, f = new Uint16Array(g), e = 0; e < g; e++)
        f[e] = c.charCodeAt(e);
    return f.buffer;
}
;
export function jnd(c) {
    var g;
    g = new Uint8Array(c.length);
    Array.prototype.forEach.call(c, function(f, e) {
        g[e] = f.charCodeAt(0);
    });
    return g;
}
;
d = a(32687);  // import from Module_32687
p = a(2236

// Detected exports: Oad, Mad, Nad, Pad, jnd
