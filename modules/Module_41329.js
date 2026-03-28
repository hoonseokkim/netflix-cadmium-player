/**
 * Netflix Cadmium Playercore - Module 41329
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Umb
 */

// Webpack module 41329
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Umb = undefined;
d = a(91176);  // import from Module_91176
p = a(48170);  // import from Module_48170
t = (function() {
    function c(g, f) {
        this.Ha = g;
        this.console = f;
        this.Ge = d.I.ia;
    }
    c.prototype.yt = function(g) {
        this.Ge = g.ci ? g.Ge : d.I.ia;
        p.u && this.console.debug("TruncateEndOfStreamAudio initialized with profile timestamp offset:", {
            Ge: this.Ge.ca(),
            Oa: g.Oa
        });
    }
    ;
    c.prototype.append = function(g, f) {
        var e, h, k, l, m, n;
        e = g.Na;
        h = g.offset;
        k = g.qf;
        l = g.Sh;
        g = g.Ih;
        if (!g) {
            m = f.endOfStream;
            f = f.b2;
            if (m && f) {
                m = e.qa.da(this.Ge).add(h);
                n = e.wa.da(this.Ge).add(h);
                f = f.da(d.I.bz);
                p.u && this.console.trace("TruncateEndOfStreamAudio: last fragment has adjusted times " + m.ca() + "-" + n.ca() + " vs media splice point at " + f.ca());
                m.add(this.Ha).$f(f) ? (p.u && this.console.trace("TruncateEndOfStreamAudio: dropping whole fragment"),
                g = true) : n.$f(f) && (f = Math.ceil(n.da(f).Af(this.Ha)),
                e.pa ? (p.u && this.console.trace(("TruncateEndOfStreamAudio: drop ").concat(f, " frames")),
                e.Kqa(f)) : (p.u && this.console.trace("TruncateEndOfStreamAudio: fragment.edit is false, dropping whole fragment"),
                g = true));
            } else
                m && p.u && this.console.trace("TruncateEndOfStreamAudio: last fragment has no media splice point");
        }
        return {
            Na: e,
            offset: h,
            qf: k,
            Ih: g,
            Sh: l
        };
    }
    ;
    return c;
}
)();
b.Umb =

// Detected exports: Umb
