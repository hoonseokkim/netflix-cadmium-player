/**
 * Netflix Cadmium Playercore - Module 4515
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: Cjb
 */

// Webpack module 4515
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Cjb = undefined;
d = a(22970);  // import from Module_22970
p = a(66164);  // import from Module_66164
c = a(61996);  // import from Module_61996
g = a(69575);  // import from Module_69575
f = a(64281);  // import from Module_64281
e = a(5472);  // import from Module_05472
t = (function() {
    function h(k, l) {
        var m;
        m = this;
        this.Xca = k;
        this.events = (0,
        f.xRa)(function() {
            return m.Wp;
        }, this.Xca.events, l, e.TNb);
        this.JBc = (0,
        g.Nf)(p.platform, this.Xca.console, "PLAYERHOST");
        new c.Tm({
            Ig: 10,
            Ej: this,
            source: "PlayerHost",
            console: this.JBc
        });
    }
    h.prototype.GQa = function() {
        this.Wp = undefined;
    }
    ;
    h.prototype.E5a = function(k) {
        this.Wp = k;
    }
    ;
    d.__decorate([(0,
    c.kb)({
        methodName: "clearProxyPlaygraphContext"
    })], h.prototype, "GQa", null);
    d.__decorate([(0,
    c.kb)({
        methodName: "setProxyPlaygraphContext"
    })], h.prototype, "E5a", null);
    return h;
}
)();
b.Cjb =

// Detected exports: Cjb
