/**
 * Netflix Cadmium Playercore - Module 80068
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: Jfb
 */

// Webpack module 80068
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Jfb = undefined;
d = a(22970);  // import from Module_22970
p = a(61996);  // import from Module_61996
t = a(14739);  // import from Module_14739
c = a(94972);  // import from Module_94972
a = (function(g) {
    function f(e, h, k, l) {
        undefined === l && (l = "CphAsePlaygraph");
        h = g.call(this, e, h, k, l) || this;
        h.Wp = e;
        h.L4a = k;
        return h;
    }
    d.__extends(f, g);
    f.prototype.Gb = function() {
        g.prototype.Gb.call(this);
    }
    ;
    f.prototype.dC = function(e) {
        var h, k;
        h = this;
        k = g.prototype.dC.call(this, e);
        k && e.Hy && !this.m3a && (this.m3a = new c.okb(this.ub,e,this.za),
        this.m3a.events.on("programsUpdated", function() {
            false;
            h.$fa();
        }),
        this.$fa());
        return k;
    }
    ;
    f.prototype.KA = function(e) {
        var h;
        return (null === (h = this.m3a) || undefined === h ? undefined : h.KA(e)) || e;
    }
    ;
    d.__decorate([(0,
    p.kb)({
        methodName: "processViewableResponse"
    })], f.prototype, "dC", null);
    return f;
}
)(t.ula);
b.Jfb =

// Detected exports: Jfb
