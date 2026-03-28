/**
 * Netflix Cadmium Playercore - Module 57180
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: VX
 */

// Webpack module 57180
// Parameters: t (module), b (exports), a (require)

var p;
function d() {}
export const VX = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
d.prototype.format = function(c, g) {
    var e;
    for (var f = 1; f < arguments.length; ++f)
        ;
    e = Array.prototype.slice.call(arguments, 1);
    return c.replace(/{(\d+)}/g, function(h, k) {
        return "undefined" != typeof e[k] ? e[k] : h;
    });
}
;
d.prototype.Q_c = function(c) {
    return JSON.stringify(c, null, "  ");
}
;
p = d;
export const VX = p;
b.VX = p = t.__decorate([(0,
a.aa)()],

// Detected exports: VX
