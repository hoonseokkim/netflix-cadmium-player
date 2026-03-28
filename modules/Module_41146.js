/**
 * Netflix Cadmium Playercore - Module 41146
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: TVb, MVb, JUb, HKb
 */

// Webpack module 41146
// Parameters: t (module), b (exports), a (require)

var c;
function d(g) {
    return function(f) {
        function e(h) {
            return null !== h && null !== h.target && h.target.E_a(g)(f);
        }
        e.RJb = new c.Metadata(g,f);
        return e;
    }
    ;
}
function p(g, f) {
    g = g.RI;
    return null !== g ? f(g) ? true : p(g, f) : false;
}
t = a(37425);  // import from Module_37425
c = a(67258);  // import from Module_67258
export const MVb = p;
export const JUb = d;
a = d(t.hK);
export const HKb = a;
export function TVb(g) {
    return function(f) {
        var e;
        if (null !== f) {
            e = f.k$[0];
            return "string" === typeof g ? e.ti === g : g === f.k$[0].$q;
        }
        return false;
    }
    ;
}

// Detected exports: TVb, MVb, JUb, HKb
