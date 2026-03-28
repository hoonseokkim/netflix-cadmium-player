/**
 * Netflix Cadmium Playercore - Module 15341
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: nkb
 */

// Webpack module 15341
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const nkb = undefined;
d = a(91176);  // import from Module_91176
t = (function() {
    function p(c, g, f) {
        var e;
        this.config = c;
        this.Fg = g;
        this.console = f;
        this.jF = d.I.ia;
        this.console.debug("ProfileTimestampOffset initialized with config:", {
            maa: this.config.maa,
            eL: this.config.eL,
            x8a: this.config.x8a,
            ySa: null === (e = this.Fg) || undefined === e ? undefined : e.ySa
        });
    }
    p.prototype.yt = function(c) {
        this.jF = this.Nfc(c);
        this.console.debug(("ProfileTimestampOffset for ").concat(c.track.pPa, ": ") + this.jF.ca());
    }
    ;
    p.prototype.append = function(c) {
        var g, f, e, h;
        g = c.Na;
        f = c.offset;
        e = c.qf;
        h = c.Ih;
        c = c.Sh;
        this.console.debug("ProfileTimestampOffset.append applying adjustment:", {
            Wjd: f.ca(),
            Ckd: this.jF.ca(),
            Zkd: f.add(this.jF).ca()
        });
        return {
            Na: g,
            offset: f.add(this.jF),
            qf: e,
            Ih: h,
            Sh: c
        };
    }
    ;
    p.prototype.Nfc = function(c) {
        var g, f, e;
        g = c.track.pPa;
        if (undefined === g)
            return (this.console.debug("ProfileTimestampOffset.calculateProfileTimestampOffset: No codec name, returning zero offset"),
            d.I.ia);
        c = c.Ge;
        f = this.xSa(g);
        e = c.da(f);
        this.console.debug("ProfileTimestampOffset.calculateProfileTimestampAdjustment:", {
            E$: g,
            Yld: c.ca(),
            xSa: f.ca(),
            result: e.ca()
        });
        return e;
    }
    ;
    p.prototype.xSa = function(c) {
        var g, f, e;
        f = d.I.ia;
        if ("AAC" === c) {
            e = null === (g = this.Fg) || undefined === g ? undefined : g.ySa;
            this.config.x8a && undefined !== e && 0 <= e ? (f = new d.I(-e,48E3),
            this.console.debug("ProfileTimestampOffset using device assumed AAC encoder delay:", {
                ySa: e,
                Jjd: f.ca()
            })) : this.config.eL || (f = new d.I(this.config.maa.ticks,this.config.maa.timescale));
        }
        this.console.debug("ProfileTimestampOffset.deviceAppliedTimestampOffset final result:", {
            E$: c,
            xSa: f.ca()
        });
        return f;
    }
    ;
    return p;
}
)();
b.nkb =

// Detected exports: nkb
