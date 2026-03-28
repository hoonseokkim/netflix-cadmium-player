/**
 * Netflix Cadmium Playercore - Module 49781
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: rkb
 */

// Webpack module 49781
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const rkb = undefined;
d = a(22970);  // import from Module_22970
t = a(90745);  // import from Module_90745
p = a(62411);  // import from Module_62411
a = (function(c) {
    function g(f) {
        var e;
        e = c.call(this) || this;
        e.rg = Promise.resolve();
        e.count = 0;
        e.Wd = f;
        return e;
    }
    d.__extends(g, c);
    Object.defineProperties(g.prototype, {
        length: {
            get: function() {
                return this.count;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.push = function(f, e) {
        var h, k;
        h = this;
        k = this.Wd;
        k.open && (this.count++,
        this.rg = this.rg.then(function() {
            return d.__awaiter(h, undefined, undefined, function() {
                var l;
                return d.__generator(this, function(m) {
                    switch (m.label) {
                    case 0:
                        if (!k.open)
                            return [3, 5];
                        m.label = 1;
                    case 1:
                        return (m.ac.push([1, 3, 4, 5]),
                        [4, e(this)]);
                    case 2:
                        return (m.T(),
                        [3, 5]);
                    case 3:
                        return (l = m.T(),
                        k.emit("failure", {
                            Oe: f,
                            Wd: k,
                            error: (0,
                            p.EO)(l)
                        }),
                        [3, 5]);
                    case 4:
                        return (--this.count || this.emit("empty"),
                        [7]);
                    case 5:
                        return [2];
                    }
                });
            });
        }));
        return this.rg;
    }
    ;
    return g;
}
)(t.EventEmitter);
b.rkb =

// Detected exports: rkb
