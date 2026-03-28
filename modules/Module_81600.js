/**
 * Netflix Cadmium Playercore - Module 81600
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: yhb
 */

// Webpack module 81600
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const yhb = undefined;
d = a(91176);  // import from Module_91176
p = a(52571);  // import from Module_52571
c = a(48170);  // import from Module_48170
t = (function() {
    function g(f, e) {
        this.console = e;
        this.tga = false;
        this.ci = f.ci;
    }
    g.prototype.yt = function(f) {
        (0,
        p.assert)(f.Ha, "NegativePtsGuard: stream.frameDuration must exist.");
        this.Ha = f.Ha;
        this.ci = f.ci;
        this.Ge = f.Ge || d.I.ia;
    }
    ;
    g.prototype.append = function(f) {
        var e, h, k, l, m;
        if (this.tga || f.Ih)
            return f;
        e = f.Na;
        h = f.offset;
        k = f.qf;
        f = f.Sh;
        if (e.pa) {
            l = e.qa.da(this.ci ? this.Ge : d.I.ia).add(h);
            if (l.lessThan(d.I.ia)) {
                m = Math.ceil(l.wh(-1).Af(this.Ha));
                c.u && this.console.trace(("NegativePtsGuard: dropping ").concat(m, " frames on first fragment to avoid nagative pts, ") + ("profile offset ").concat(this.Ge.ca(), ", ") + ("request content start ").concat(e.qa.ca(), ", ") + ("current timestamp offset ").concat(h.ca(), " => ") + ("firstPlatformTimestamp ").concat(l.ca(), "."));
                e.PSa(m);
            }
        }
        this.tga = true;
        return {
            Na: e,
            offset: h,
            qf: k,
            Ih: false,
            Sh: f
        };
    }
    ;
    return g;
}
)();
b.yhb =

// Detected exports: yhb
