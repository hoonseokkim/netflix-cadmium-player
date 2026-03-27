/**
 * Netflix Cadmium Playercore - Module 91772
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 91772
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
p = a(90745);
t = (function(c) {
    function g(f, e, h, k) {
        var l;
        l = c.call(this) || this;
        l.ub = f;
        l.track = e;
        l.pn = false;
        l.qM = false;
        l.ek = new p.sf();
        l.ek.on(e, "networkfailing", function() {
            l.emit("networkfailing");
        });
        l.ek.on(e, "error", function() {
            l.ub.warn("requestQueue got error");
            l.emit("error");
        });
        if (h)
            (l.pn = true,
            Promise.resolve().then(function() {
                return l.emit("created");
            }));
        else
            l.ek.on(e, "created", function() {
                l.pn = true;
                l.emit("created");
            });
        l.qM = k;
        return l;
    }
    d.__extends(g, c);
    Object.defineProperties(g.prototype, {
        TTa: {
            get: function() {
                return this.track.TTa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Zg: {
            get: function() {
                return this.track.Zg;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        dh: {
            get: function() {
                return this.track.dh;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        UTa: {
            get: function() {
                return this.track.UTa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        config: {
            get: function() {
                return this.track.config;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Gb = function() {
        var f, e;
        this.qM || (null === (e = (f = this.track).Gb) || undefined === e ? undefined : e.call(f),
        this.qM = true);
    }
    ;
    g.prototype.toString = function() {
        return this.track.toString();
    }
    ;
    g.prototype.toJSON = function() {
        return this.track;
    }
    ;
    g.prototype.Hh = function() {
        this.ek.clear();
    }
    ;
    return g;
}
)(p.EventEmitter);
export const a8 = t;

// Detected exports: a8