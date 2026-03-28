/**
 * Netflix Cadmium Playercore - Module 88251
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 */

// Webpack module 88251
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = a(67286)("%Symbol.species%", true);
p = a(5408);  // import from Module_05408
c = a(5158);  // import from Module_05158
g = a(20451);  // import from Module_20451
t.exports = function(f, e) {
    if (!c(f))
        throw new p("Assertion failed: Type(O) is not Object");
    f = f.constructor;
    if ("undefined" === typeof f)
        return e;
    if (!c(f))
        throw new p("O.constructor is not an Object");
    f = d ? f[d] : undefined;
    if (null == f)
        return e;
    if (g(f))
        return f;
    throw new p("no constructor found");
}

