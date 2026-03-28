/**
 * Netflix Cadmium Playercore - Module 47511
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: fIa
 */

// Webpack module 47511
// Parameters: t (module), b (exports), a (require)

var p, c;
function d() {}
export const fIa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(76564);  // import from Module_76564
d.prototype.compare = function(g, f) {
    var e;
    e = [];
    this.RQa(g, f, "", e);
    return e;
}
;
d.prototype.RQa = function(g, f, e, h) {
    var k;
    k = this;
    if (c.CP.SQ(g))
        c.CP.SQ(f) && g.length === f.length ? g.forEach(function(n, q) {
            k.RQa(g[q], f[q], e + "[" + q + "]", h);
        }) : h.push({
            a: g,
            b: f,
            path: e
        });
    else if (c.CP.N9(g) && null != g) {
        if (c.CP.N9(f) && null != f) {
            for (var l in g)
                this.RQa(g[l], f[l], e + "." + l, h);
            for (var m in f)
                (m in g) || undefined === f[m] || h.push({
                    a: undefined,
                    b: f[m],
                    path: e + "." + m
                });
        } else
            h.push({
                a: g,
                b: f,
                path: e
            });
    } else
        g !== f && h.push({
            a: g,
            b: f,
            path: e
        });
}
;
a = d;
export const fIa = a;
b.fIa = a = t.__decorate([(0,
p.aa)()],

// Detected exports: fIa
