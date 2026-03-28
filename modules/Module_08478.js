/**
 * Netflix Cadmium Playercore - Module 8478
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Ccb
 */

// Webpack module 8478
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ccb = undefined;
d = a(97967);  // import from Module_97967
p = a(91967);  // import from Module_91967
t = (function() {
    function c(g) {
        this.gra = g;
        this.um = "engine";
        this.enabled = true;
    }
    Object.defineProperties(c.prototype, {
        ic: {
            get: function() {
                return this.um;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.Ph = function(g) {
        var f;
        f = g.Ui;
        g = g.Xs;
        if (f === p.Sc.Gm || f === p.Sc.Mr || f === p.Sc.Wj || undefined === f && undefined === g)
            return (f = this.gra.KPc.map(function(e) {
                var h;
                h = e.Z;
                return {
                    id: h.id,
                    weight: h.weight,
                    relativeWeight: e.bga
                };
            }),
            f = {
                prefetcher: this.gra.aC.getStats(),
                playgraphs: f,
                viewables: this.gra.s4c,
                players: this.gra.IPc.length
            },
            d.eHa.instance && (f.mfCache = d.eHa.instance.u_a.getStats()),
            f);
    }
    ;
    return c;
}
)();
b.Ccb =

// Detected exports: Ccb
