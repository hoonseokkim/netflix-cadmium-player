/**
 * Netflix Cadmium Playercore - Module 28871
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: hZa, bZa, SYa, isEqual, Zf, Jsa
 */

// Webpack module 28871
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Jsa = b.Zf = b.isEqual = b.SYa = b.bZa = b.hZa = undefined;
d = a(91176);  // import from Module_91176
p = a(6783);  // import from Module_06783
export function hZa(c) {
    return !!c.J;
}
;
export function bZa(c) {
    return !!c.T9;
}
;
export function SYa(c) {
    return !!c.Z;
}
;
export function isEqual(c, g) {
    var f, e;
    f = (0,
    b.SYa)(c);
    e = (0,
    b.SYa)(g);
    return f && e ? c.Z === g.Z : f || e ? false : "" + (0,
    b.Zf)(c) === "" + (0,
    b.Zf)(g);
}
;
export function Zf(c) {
    if ((0,
    b.hZa)(c))
        return c.J;
    if ((0,
    b.bZa)(c))
        return c.T9;
    c = c.Z;
    return c.ba[c.Ef].J;
}
;
export function Jsa(c, g) {
    var f;
    return c.Ooa ? c.Ooa instanceof d.I ? (c = (0,
    p.Ds)(g, (0,
    b.Zf)(c.key), c.Ooa),
    (null === c || undefined === c ? 0 : c.offset.greaterThan(d.I.ia)) ? c : {
        offset: d.I.ia,
        M: null !== (f = null === c || undefined === c ? undefined : c.M) && undefined !== f ? f : g.Ef
    }) : c.Ooa : {
        offset: d.I.ia,
        M: g.Ef
    };
}

// Detected exports: hZa, bZa, SYa, isEqual, Zf, Jsa
