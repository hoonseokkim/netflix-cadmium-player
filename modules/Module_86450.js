/**
 * Netflix Cadmium Playercore - Module 86450
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 86450
// Parameters: t (module), b (exports), a (require)

var p;
function d(c, g) {
    g = Math.max(c, g);
    return isNaN(g) ? c || -Infinity : g;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.k$a = undefined;
p = a(65161);  // import from Module_65161
t = (function() {
    function c(g) {
        this.config = g;
        this.I3a = 0;
        this.state = p.Yd.Wt;
        this.rKb = d(g.IT, g.HT);
        this.f0a = d(g.II, g.GT);
    }
    c.prototype.Oh = function(g, f) {
        var e;
        e = this;
        if (f !== this.state) {
            this.state = f;
            if (f === p.Yd.Xf || f === p.Yd.jma)
                return g;
            f === p.Yd.Qm && this.HSc();
        }
        return g.filter(function(h) {
            return !(undefined !== h.Wb && h.Wb < e.f0a || (undefined === h.Wb || 0 > e.f0a) && h.bitrate < e.rKb);
        });
    }
    ;
    c.prototype.HSc = function() {
        ++this.I3a;
        this.f0a = d(this.config.II, this.config.GT - this.config.AJc * this.I3a);
        this.rKb = this.config.IT || -Infinity;
    }
    ;
    return c;
}
)();
b.k$a =

