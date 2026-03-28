/**
 * Netflix Cadmium Playercore - Module 74742
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 */

// Webpack module 74742
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.HQc = f;
}
b.$Ea = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(94800);  // import from Module_94800
a = a(18580);  // import from Module_18580
d.prototype.Nsc = function() {
    var f, e;
    f = {
        Y_: c.qP.c7b
    };
    try {
        e = this.HQc.PresentationRequest;
        e && (new e("https://netflix.com").getAvailability() || Promise.reject()).then(function(h) {
            var k;
            f.Y_ = h.value ? c.qP.bkb : c.qP.u9a;
            if (f.Y_ === c.qP.u9a) {
                k = function() {
                    h.value && (f.Y_ = c.qP.bkb);
                    h.removeEventListener("change", k);
                }
                ;
                h.addEventListener("change", k);
            }
        }).catch(function() {
            f.Y_ = c.qP.Error;
        });
    } catch (h) {
        f.Y_ = c.qP.Error;
    }
    return f;
}
;
g = d;
b.$Ea = g;
b.$Ea = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.ckb))],

