/**
 * Netflix Cadmium Playercore - Module 67525
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: XJa
 */

// Webpack module 67525
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    this.F0c = g;
}
export const XJa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
a = a(10306);  // import from Module_10306
d.prototype.random = function() {
    return this.F0c.random();
}
;
d.prototype.fPb = function(g, f) {
    if ("number" !== typeof g)
        (f = g.end,
        g = g.start);
    else if ("undefined" === typeof f)
        throw Error("max must be provided for randomInteger API");
    return Math.round(g + this.random() * (f - g));
}
;
c = d;
export const XJa = c;
b.XJa = c = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.hmb))],

// Detected exports: XJa
