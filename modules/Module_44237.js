/**
 * Netflix Cadmium Playercore - Module 44237
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: TCa
 */

// Webpack module 44237
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const TCa = undefined;
d = a(91176);  // import from Module_91176
p = a(48170);  // import from Module_48170
t = (function() {
    function c(g) {
        this.console = g;
        this.ON = d.I.ia;
    }
    c.prototype.yt = function(g) {
        g = g.ci ? g.Ge || d.I.ia : d.I.ia;
        this.Ge && (this.ON = g.da(this.Ge),
        p.u && this.console.log("AudioDiscontinuity: profile timestamp offset change: " + this.ON.ca()));
        this.Ge = g;
    }
    ;
    c.prototype.append = function(g) {
        var f, e, h, k, l, m;
        if (g.Ih)
            return g;
        f = g.Na;
        e = g.offset;
        h = g.Sh;
        k = f.qa;
        l = f.wa;
        m = k.add(e);
        e = l.add(e);
        if (!this.MM)
            return (this.MM = e,
            g);
        l = this.MM.add(this.ON);
        m = m.da(l);
        this.MM = e;
        this.ON = d.I.ia;
        if (m.equal(d.I.ia))
            return g;
        g.Sh = h || [];
        f = {
            stream: f.Oa,
            pts: k.G,
            gap: m.G
        };
        g.Sh.push({
            type: "logdata",
            target: "endplay",
            fields: {
                audiodisc: {
                    type: "array",
                    value: f
                }
            }
        });
        p.u && this.console.log(("AudioDiscontinuity: ").concat(JSON.stringify(f)));
        return g;
    }
    ;
    return c;
}
)();
b.TCa =

// Detected exports: TCa
