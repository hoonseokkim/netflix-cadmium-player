/**
 * Netflix Cadmium Playercore - Module 40290
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: fK
 */

// Webpack module 40290
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d() {
    this.type = p.XF.lG;
}
export const fK = undefined;
p = a(56800);  // import from Module_56800
t = a(57180);  // import from Module_57180
c = a(17612);  // import from Module_17612
g = new t.VX();
d.xlc = function() {
    return {
        isTypeSupported: function(f) {
            var e;
            try {
                if (-1 == f.toLowerCase().indexOf("codec"))
                    return Da.MSMediaKeys.isTypeSupported(f, "video/mp4");
                e = f.split("|");
                return 1 === e.length ? Da.MSMediaKeys.isTypeSupported(c.wb.aD, f) : "probably" === d.UAa(e[0], e[1]);
            } catch (h) {
                return false;
            }
        }
    };
}
;
d.Qpa = function(f, e, h) {
    e = g.format(d.lBa, e);
    if (0 === h.length)
        return e;
    h = g.format('features="{0}"', h.join());
    return g.format("{0}|{1}{2}", f, e, h);
}
;
d.UAa = function(f, e) {
    var h;
    try {
        h = Da.MSMediaKeys.isTypeSupportedWithFeatures ? Da.MSMediaKeys.isTypeSupportedWithFeatures(f, e) : "";
    } catch (k) {
        h = "exception";
    }
    return h;
}
;
export const fK = d;
d.lBa = 'video/mp4;codecs="{0},mp4a"

// Detected exports: fK
