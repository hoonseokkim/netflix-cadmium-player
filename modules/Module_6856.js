/**
 * Netflix Cadmium Playercore - Module 6856
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [22970, 22674]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 6856
// Parameters: t (module), b (exports), a (require)
var p;
function d() {}

t = a(22970);
a = a(22674);
d.prototype.iBb = function(c) {
    var g;
    g = this;
    return c ? (c ^ 16 * Math.random() >> c / 4).toString(16) : ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, function(f) {
        return g.iBb(f);
    });
}
;
p = d;
export const CLa = p;
export const CLa = p = t.__decorate([(0,
a.aa)()], p);
