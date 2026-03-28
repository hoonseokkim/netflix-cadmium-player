/**
 * Netflix Cadmium Playercore - Module 94028
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: uDa
 */

// Webpack module 94028
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l, m) {
    var n;
    n = this;
    this.Hi = l;
    l = m();
    this.mg = new h({
        log: k.zb("CacheManager"),
        Qa: {
            getTime: function() {
                return n.Hi.Fc().na(f.Ba);
            }
        },
        Promise: Promise,
        xE: false,
        gfc: l.BQc,
        ffc: l.zQc,
        ksc: l.qOb,
        jsc: l.AQc
    });
}
export const uDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(81918);  // import from Module_81918
g = a(87386);  // import from Module_87386
f = a(5021);  // import from Module_05021
e = a(4203);  // import from Module_04203
h = a(83195);  // import from Module_83195
export const uDa = d;
b.uDa = d = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Bb)), t.__param(1, (0,
p.v)(c.re)), t.__param(2, (0,
p.v)(e.Pc))],

// Detected exports: uDa
