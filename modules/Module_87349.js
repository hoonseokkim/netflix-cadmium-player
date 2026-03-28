/**
 * Netflix Cadmium Playercore - Module 87349
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 * Exports: Wz
 */

// Webpack module 87349
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Wz = undefined;
d = a(25564);  // import from Module_25564
p = a(98516);  // import from Module_98516
c = a(48014);  // import from Module_48014
t = (function() {
    function g(f, e, h) {
        this.console = f;
        this.stream = e;
        this.view = h instanceof ArrayBuffer ? new DataView(h) : new DataView(h.data,h.offset,h.length);
    }
    g.prototype.parse = function(f) {
        var e;
        e = new c.Xja(this.view.byteLength);
        this.We = new d.T5(p.o2.Se,e,this.view,this.console,{
            Fxa: true
        });
        f = this.We.parse(f);
        this.Se = this.We.Se;
        return f;
    }
    ;
    return g;
}
)();
b.Wz =

// Detected exports: Wz
