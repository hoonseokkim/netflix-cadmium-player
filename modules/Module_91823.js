/**
 * Netflix Cadmium Playercore - Module 91823
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: IUb; Dependencies: [67258, 28041]
 * Original signature: function(t, b, a)
 */

// Webpack module 91823
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(67258);
p = a(28041);
export function IUb(c, g) {
    return function(f, e, h) {
        var k;
        k = new d.Metadata(c,g);
        "number" === typeof h ? p.HV(f, e, h, k) : p.Oha(f, e, k);
    }
    ;
}
;
