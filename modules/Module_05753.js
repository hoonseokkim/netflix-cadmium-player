/**
 * Netflix Cadmium Playercore - Module 5753
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 */

// Webpack module 5753
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.I$a = undefined;
d = a(48170);  // import from Module_48170
t = (function() {
    function p(c) {
        this.console = c;
    }
    p.prototype.yt = function() {}
    ;
    p.prototype.append = function(c, g) {
        var f, e, h, k, l, m, n;
        if (c.Ih)
            return c;
        f = false;
        e = c.Na;
        h = c.offset;
        k = c.qf;
        c = c.Sh;
        g = g.b2;
        l = e.Sb;
        if (this.vr && l.lessThan(this.vr.Sb)) {
            m = this.vr.b2.da(e.Vb);
            n = e.Sb.da(this.vr.b2);
            n.lessThan(m) && (d.u && this.console.trace(("AudioOverlapGuard: skipping append of ").concat(e) + (", current error: ").concat(m.ca()) + (", discard error: ").concat(n.ca())),
            f = true);
        }
        this.vr = (e.Si || e.AB) && g ? {
            b2: g,
            Sb: l
        } : undefined;
        return {
            Na: e,
            offset: h,
            qf: k,
            Ih: f,
            Sh: c
        };
    }
    ;
    return p;
}
)();
b.I$a =

