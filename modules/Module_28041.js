/**
 * Netflix Cadmium Playercore - Module 28041
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: HV, Oha, BL
 */

// Webpack module 28041
// Parameters: t (module), b (exports), a (require)

var c, g;
function d(f, e, h, k, l) {
    var m, n, r;
    m = {};
    n = "number" === typeof l;
    l = undefined !== l && n ? l.toString() : h;
    if (n && undefined !== h)
        throw Error(c.P1b);
    Reflect.rXa(f, e) && (m = Reflect.getMetadata(f, e));
    h = m[l];
    if (Array.isArray(h)) {
        n = 0;
        for (var q = h; n < q.length; n++) {
            r = q[n];
            if (r.key === k.key)
                throw Error(c.f0b + " " + r.key.toString());
        }
    } else
        h = [];
    h.push(k);
    m[l] = h;
    Reflect.kqa(f, m, e);
}
function p(f, e) {
    return function(h, k) {
        e(h, k, f);
    }
    ;
}
c = a(25640);  // import from Module_25640
g = a(37425);  // import from Module_37425
export function HV(f, e, h, k) {
    d(g.imb, f, e, k, h);
}
;
export function Oha(f, e, h) {
    d(g.jmb, f.constructor, e, h);
}
;
export function BL(f, e, h) {
    "number" === typeof h ? (f = [p(h, f)],
    Reflect.BL(f, e)) : "string" === typeof h ? Reflect.BL([f], e, h) : Reflect.BL([f], e);
}

// Detected exports: HV, Oha, BL
