/**
 * Netflix Cadmium Playercore - Module 63002
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: Jcb
 */

// Webpack module 63002
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Jcb = undefined;
d = a(22970);  // import from Module_22970
p = a(48170);  // import from Module_48170
c = a(40666);  // import from Module_40666
t = (function() {
    function g(f, e, h) {
        this.tc = f;
        this.BJc = e;
        this.ub = h;
    }
    Object.defineProperties(g.prototype, {
        name: {
            get: function() {
                return "ExitZone";
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.waitUntil = function(f) {
        var e;
        f = (0,
        c.s5)(this.tc, f, true);
        e = f.promise;
        this.V8a = f.Oe;
        return e;
    }
    ;
    g.prototype.process = function(f) {
        return d.__awaiter(this, undefined, undefined, function() {
            var e, h;
            return d.__generator(this, function(k) {
                switch (k.label) {
                case 0:
                    if (f.done)
                        return [3, 2];
                    e = f.value.value;
                    if (!e.kUa)
                        return [3, 2];
                    h = e.Vb.da(this.BJc);
                    p.u && this.ub.trace(("[").concat(e.mediaType, "] JIT: waiting until playertime >= ").concat(h.G), ("to append next request ").concat(e.toString()));
                    return [4, this.waitUntil(h)];
                case 1:
                    (k.T(),
                    p.u && this.ub.trace(("[").concat(e.mediaType, "] JIT: now appending request ").concat(e.toString())),
                    k.label = 2);
                case 2:
                    return [2, f];
                }
            });
        });
    }
    ;
    g.prototype.reset = function() {
        var f;
        null === (f = this.V8a) || undefined === f ? undefined : f.La();
    }
    ;
    return g;
}
)();
b.Jcb =

// Detected exports: Jcb
