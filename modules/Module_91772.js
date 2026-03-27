/**
 * Netflix Cadmium Playercore - Module 91772
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 91772
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.a8 = void 0;
d = a(22970);
p = a(90745);
t = (function(c) {
    function g(f, e, h, k) {
        var l;
        l = c.call(this) || this;
        l.ub = f;
        l.track = e;
        l.pn = !1;
        l.qM = !1;
        l.ek = new p.sf();
        l.ek.on(e, "networkfailing", function() {
            l.emit("networkfailing");
        });
        l.ek.on(e, "error", function() {
            l.ub.warn("requestQueue got error");
            l.emit("error");
        });
        if (h)
            (l.pn = !0,
            Promise.resolve().then(function() {
                return l.emit("created");
            }));
        else
            l.ek.on(e, "created", function() {
                l.pn = !0;
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
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        Zg: {
            get: function() {
                return this.track.Zg;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        dh: {
            get: function() {
                return this.track.dh;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        UTa: {
            get: function() {
                return this.track.UTa;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        config: {
            get: function() {
                return this.track.config;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    g.prototype.Gb = function() {
        var f, e;
        this.qM || (null === (e = (f = this.track).Gb) || void 0 === e ? void 0 : e.call(f),
        this.qM = !0);
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
b.a8 = t;


// Detected exports: a8