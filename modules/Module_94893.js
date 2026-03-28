/**
 * Netflix Cadmium Playercore - Module 94893
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Y7
 */

// Webpack module 94893
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Y7 = undefined;
d = a(22970);  // import from Module_22970
t = (function() {
    function c() {
        var g;
        g = this;
        this.c9 = [];
        this.UTc = function(f) {
            f = g.c9.indexOf(f);
            0 <= f && g.c9.splice(f, 1);
        }
        ;
    }
    Object.defineProperties(c.prototype, {
        ioa: {
            get: function() {
                return 0 !== this.c9.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        zLb: {
            get: function() {
                return this.c9.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.add = function() {
        var g;
        g = new p(this.UTc);
        this.c9.push(g);
        return g;
    }
    ;
    c.prototype.fYb = function(g) {
        d.__awaiter(this, undefined, undefined, function() {
            var f, e;
            return d.__generator(this, function(h) {
                switch (h.label) {
                case 0:
                    (f = this.add(),
                    h.label = 1);
                case 1:
                    return (h.ac.push([1, , 3, 4]),
                    [4, g()]);
                case 2:
                    return (e = h.T(),
                    [2, e]);
                case 3:
                    return (f.release(),
                    [7]);
                case 4:
                    return [2];
                }
            });
        });
    }
    ;
    c.prototype.W4c = function(g) {
        var f;
        f = this.add();
        try {
            g();
        } finally {
            f.release();
        }
    }
    ;
    return c;
}
)();
export const Y7 = t;
p = (function() {
    function c(g) {
        this.xNa = g;
    }
    c.prototype.release = function() {
        this.xNa(this);
    }
    ;
    return c;
}
)

// Detected exports: Y7
