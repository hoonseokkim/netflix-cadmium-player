/**
 * Netflix Cadmium Playercore - Module 487
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 * Exports: GFa
 */

// Webpack module 487
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.va = f.zb("HeaderParserImpl");
}
export const GFa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(91562);  // import from Module_91562
a = a(87386);  // import from Module_87386
d.prototype.parse = function(f, e, h) {
    f = new c.Om(this.va,{
        mediaType: f
    },e,["sidx"]).parse();
    if (f.TB && f.Ta)
        return this.NOa(f.Ta, h);
}
;
d.prototype.NOa = function(f, e) {
    var h, k, l, m, n;
    h = 0;
    k = 0;
    l = 0;
    m = f.offset;
    n = [];
    f.og.forEach(function(q, r) {
        k += q;
        l += f.sizes[r];
        if (1E3 * k / f.O >= e || r === f.og.length - 1)
            (n.push({
                duration: k / f.O,
                Nb: h / f.O,
                byteOffset: m,
                afc: l
            }),
            h += k,
            k = 0,
            m += l,
            l = 0);
    });
    return n;
}
;
g = d;
export const GFa = g;
b.GFa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.Bb))], g)

// Detected exports: GFa
