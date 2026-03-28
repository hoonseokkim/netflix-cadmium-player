/**
 * Netflix Cadmium Playercore - Module 29385
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: v, sGa
 */

// Webpack module 29385
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = a(25640);  // import from Module_25640
p = a(37425);  // import from Module_37425
c = a(67258);  // import from Module_67258
g = a(28041);  // import from Module_28041
t = (function() {
    function f(e) {
        this.G7b = e;
    }
    f.prototype.KO = function() {
        return this.G7b();
    }
    ;
    return f;
}
)();
export const sGa = t;
export function v(f) {
    return function(e, h, k) {
        var l;
        if (undefined === f)
            throw Error(d.H6b(e.name));
        l = new c.Metadata(p.j7,f);
        "number" === typeof k ? g.HV(e, h, k, l) : g.Oha(e, h, l);
    }
    ;
}

// Detected exports: v, sGa
