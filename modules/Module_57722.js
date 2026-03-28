/**
 * Netflix Cadmium Playercore - Module 57722
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Sd, pEc, rBc, EEc, DDc, tDc, wVa, tXc, KQa
 */

// Webpack module 57722
// Parameters: t (module), b (exports), a (require)

var p;
function d(c, g) {
    var f, e;
    f = p.__assign({}, c);
    e = p.__read(g || [], 1)[0];
    e && c[e] && (c = c[e],
    "object" === typeof c ? (g = g.concat(),
    g.shift(),
    f[e] = d(c, g)) : f[e] = c);
    return f;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Sd(c) {
    return !(null === c || undefined === c || !c.position);
}
;
export function pEc(c) {
    return !(null === c || undefined === c || !c.M) && !(null === c || undefined === c || !c.offset);
}
;
export function rBc(c) {
    return !(null === c || undefined === c || !c.M) || !(null === c || undefined === c || !c.segmentId);
}
;
export function EEc(c, g) {
    return "string" === typeof c && !(!g.rd.Z.ba[c] && !g.za.Z.ba[c]);
}
;
export function DDc(c) {
    return !(null === c || undefined === c || !c.J) && !(null === c || undefined === c || !c.Ga);
}
;
export function tDc(c) {
    return !(null === c || undefined === c || !c.Qd);
}
;
export function wVa(c, g) {
    var f;
    f = c;
    g.forEach(function(e) {
        f = null === f || undefined === f ? undefined : f[e];
    });
    return f;
}
;
export const KQa = d;
export function tXc(c, g, f) {
    for (var e = 0; e < g.length - 1 && c; e++)
        c = c[g[e]];
    return c ? (c[g[g.length - 1]] = f,
    true) : false;
}
;
p = a(2297

// Detected exports: Sd, pEc, rBc, EEc, DDc, tDc, wVa, tXc, KQa
