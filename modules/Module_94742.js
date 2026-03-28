/**
 * Netflix Cadmium Playercore - Module 94742
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: tGa
 * Dependencies: 22970
 * Purpose: Configuration, Enum definitions
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 94742
// Parameters: t (module), b (exports), a (require)

var d, p;
export const tGa = b.$Ja = undefined;
d = a(22970);
(function(c) {
    c[c.u2 = 0] = "none";
    c[c.remove = 1] = "remove";
    c[c.clear = 2] = "clear";
    c[c.all = 3] = "all";
}
)(p || (b.$Ja = p = {}));
t = (function() {
    class c {
    constructor(g) {
        undefined === g && (g = {});
        this.IE = new Map();
        this.options = d.__assign({
            Sya: p.u2
        }, g);
    }
    has(g) {
        return this.IE.has(g);
    }
    Oqb(g, f) {
        this.IE.set(g, f);
    }
    delete(g) {
        return d.__awaiter(this, arguments, undefined, function(f, e) {
            var h, k;
            undefined === e && (e = true);
            return d.__generator(this, function(l) {
                switch (l.label) {
                case 0:
                    h = this.IE.get(f);
                    k = this.IE.delete(f);
                    if (l = e)
                        (l = p.remove,
                        l = (this.options.Sya & l) === l);
                    return l ? [4, Promise.resolve()] : [3, 2];
                case 1:
                    (l.T(),
                    l.label = 2);
                case 2:
                    return (h && h.release(),
                    [2, k]);
                }
            });
        });
    }
    hob(g) {
        return d.__awaiter(this, undefined, undefined, function() {
            var f;
            return d.__generator(this, function(e) {
                switch (e.label) {
                case 0:
                    return (f = Array.from(this.IE.values()),
                    this.IE.clear(),
                    g ? [4, Promise.resolve()] : [3, 2]);
                case 1:
                    (e.T(),
                    e.label = 2);
                case 2:
                    return (f.forEach(function(h) {
                        h.release();
                    }),
                    [2]);
                }
            });
        });
    }
    clear() {
        return d.__awaiter(this, undefined, undefined, function() {
            var g;
            return d.__generator(this, function(f) {
                switch (f.label) {
                case 0:
                    return (f = p.clear,
                    g = (this.options.Sya & f) === f,
                    [4, this.hob(g)]);
                case 1:
                    return (f.T(),
                    [2]);
                }
            });
        });
    }
    La() {
        this.hob(false);
    }
}
Object.defineProperties(c.prototype, {
        size: {
            get: function() {
                return this.IE.size;
            },
            enumerable: false,
            configurable: true
        }
    });
    return c;
}
)();
export const tGa = t;

// Detected exports: tGa
