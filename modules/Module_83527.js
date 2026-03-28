/**
 * Netflix Cadmium Playercore - Module 83527
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: ICa
 */

// Webpack module 83527
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ICa = undefined;
d = a(22970);  // import from Module_22970
p = a(78015);  // import from Module_78015
t = (function(c) {
    function g(f, e, h, k) {
        var l;
        l = c.call(this, f, h) || this;
        l.rg = undefined;
        g.iFb(l, f, e, h, k);
        return l;
    }
    d.__extends(g, c);
    g.iFb = function(f, e, h, k, l) {
        p.xW.iYa(f, e, k);
        f.K = h;
        f.HG = k.ck;
        f.Bk = k.Hxa;
        f.xob = k.ry;
        f.ub = l;
    }
    ;
    Object.defineProperties(g.prototype, {
        Ee: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        ck: {
            get: function() {
                return this.HG;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Hxa: {
            get: function() {
                return this.Bk;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        ry: {
            get: function() {
                return this.xob;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Lea: {
            get: function() {
                return this.p9b;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.toJSON = function() {
        return {
            movieId: this.R,
            streamId: this.Oa,
            bitrate: this.bitrate
        };
    }
    ;
    return g;
}
)(p.xW);
b.ICa =

// Detected exports: ICa
