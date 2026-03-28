/**
 * Netflix Cadmium Playercore - Module 62604
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: dwc, fkd, JOc, sid, NOc, oYb, g9a, RF, pYb, qYb
 */

// Webpack module 62604
// Parameters: t (module), b (exports), a (require)

var d, p;
export const NOc = b.qYb = b.pYb = b.RF = b.g9a = b.oYb = b.$ia = undefined;
export function dwc(c, g, f) {
    for (var e = 2; e < arguments.length; ++e)
        ;
    for (e = 1; (g = arguments[e++]) && (c = c[g]); )
        ;
    return c;
}
;
export function fkd(c, g) {
    var f;
    c ? f = (0,
    d.wm)(c[b.RF]) : undefined !== g && (f = g);
    (0,
    p.iaa)(f);
    return f;
}
;
export function JOc(c, g) {
    var f;
    c ? f = c[b.RF] : undefined !== g && (f = g);
    (0,
    p.Uwb)(f);
    return f;
}
;
export function sid(c, g) {
    var f;
    f = {};
    f[b.$ia] = c;
    f[b.RF] = g;
    return f;
}
;
d = a(3887);  // import from Module_03887
p = a(45146);  // import from Module_45146
b.$ia = "$attributes";
export const oYb = "$children";
export const g9a = "$name";
export const RF = "$text";
export const pYb = "$parent";
export const qYb = "$sibling";
b.NOc = /^\s*<\?xml.*\?>

// Detected exports: dwc, fkd, JOc, sid, NOc, oYb, g9a, RF, pYb, qYb
