/**
 * Netflix Cadmium Playercore - Module 94972
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: okb
 */

// Webpack module 94972
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const okb = undefined;
d = a(79048);  // import from Module_79048
p = a(90745);  // import from Module_90745
c = a(79048);  // import from Module_79048
t = (function() {
    function g(f, e, h) {
        var k;
        k = this;
        this.console = f;
        this.L = e;
        this.za = h;
        this.Il = [];
        this.events = new p.EventEmitter();
        this.L.cg.events.on("modelUpdated", function() {
            k.YSc();
        });
    }
    g.prototype.YSc = function() {
        var f;
        f = this.L.cg.model.Il;
        this.KRc(this.Il, f) && (this.Il = f.map(function(e) {
            return {
                id: e.id,
                Yk: e.Yk ? {
                    Ga: e.Yk.Ga
                } : undefined,
                Xk: e.Xk ? {
                    Ga: e.Xk.Ga
                } : undefined
            };
        }),
        false,
        this.events.emit("programsUpdated", {
            type: "programsUpdated"
        }));
    }
    ;
    g.prototype.KRc = function(f, e) {
        var h, k, l, m, q, r;
        if (f.length !== e.length)
            return true;
        for (var n = 0; n < f.length; n++) {
            if (f[n].id !== e[n].id)
                return true;
            q = null === (h = f[n].Yk) || undefined === h ? undefined : h.Ga;
            r = null === (k = e[n].Yk) || undefined === k ? undefined : k.Ga;
            if (q !== r || q && r && q.TT(r))
                return true;
            q = null === (l = f[n].Xk) || undefined === l ? undefined : l.Ga;
            r = null === (m = e[n].Xk) || undefined === m ? undefined : m.Ga;
            if (q !== r || q && r && q.TT(r))
                return true;
        }
        return false;
    }
    ;
    g.prototype.KA = function(f) {
        var e;
        e = (0,
        c.fmc)(parseInt(this.L.R), this.L.cg.model.Il);
        f = d.fA.Jn(f, d.fA.create(e)).d2;
        f.OY(this.za.Ib);
        return f;
    }
    ;
    return g;
}
)();
b.okb =

// Detected exports: okb
