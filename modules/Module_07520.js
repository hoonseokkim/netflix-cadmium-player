/**
 * Netflix Cadmium Playercore - Module 7520
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: DRM / content protection
 * Exports: C7
 */

// Webpack module 7520
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const C7 = undefined;
d = a(91176);  // import from Module_91176
p = a(48170);  // import from Module_48170
t = (function() {
    function c(g, f) {
        this.console = g;
        this.config = f;
        this.y8a = false;
    }
    c.prototype.Oh = function(g, f, e, h) {
        undefined === e && (e = d.I.ia);
        undefined === h && (h = false);
        p.u && this.console.trace("Filtering streams for fastplay", {
            y8a: this.y8a,
            Ga: e.G,
            thd: h
        });
        if (this.y8a || e.G >= this.config.yIc || false === h) {
            f = g.filter(this.ipc);
            if (f.length)
                return f;
            p.u && this.console.trace("No drm streams to return");
        }
        f = g.filter(this.Nhc);
        if (f.length)
            return f;
        p.u && this.console.trace("No clear streams to return");
        return g;
    }
    ;
    c.prototype.ipc = function(g) {
        return g.Nk;
    }
    ;
    c.prototype.Nhc = function(g) {
        return !g.Nk;
    }
    ;
    return c;
}
)();
b.C7 =

// Detected exports: C7
