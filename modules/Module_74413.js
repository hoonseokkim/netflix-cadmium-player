/**
 * Netflix Cadmium Playercore - Module 74413
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: i5c, sYb, Dnd, tYb, j5c, uYb, rYb
 */

// Webpack module 74413
// Parameters: t (module), b (exports), a (require)

var p;
function d(c) {
    var g, f, e, h, k, l, m;
    f = {};
    f[p.g9a] = c.localName;
    e = {};
    f[p.$ia] = e;
    h = [];
    f[p.oYb] = h;
    k = c.attributes;
    l = k.length;
    for (g = 0; g < l; g++) {
        m = k[g];
        e[m.localName] = m.value;
    }
    c = c.childNodes;
    l = c.length;
    e = {};
    for (g = 0; g < l; g++)
        switch ((k = c[g],
        k.nodeType)) {
        case b.tYb:
            k = d(k);
            m = k[p.g9a];
            k[p.pYb] = f;
            h.push(k);
            f[m] ? e[m][p.qYb] = k : f[m] = k;
            e[m] = k;
            break;
        case b.uYb:
        case b.rYb:
            (k = k.text || k.nodeValue,
            h.push(k),
            f[p.RF] || (f[p.RF] = k));
        }
    return f;
}
export const sYb = b.rYb = b.uYb = b.j5c = b.tYb = undefined;
export function i5c(c) {
    return d(c.nodeType == b.sYb ? c.documentElement : c);
}
;
export const Dnd = d;
p = a(62604);  // import from Module_62604
export const tYb = 1;
export const j5c = 2;
export const uYb = 3;
export const rYb = 4;
b.sYb =

// Detected exports: i5c, sYb, Dnd, tYb, j5c, uYb, rYb
