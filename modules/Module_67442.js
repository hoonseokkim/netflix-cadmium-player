/**
 * Netflix Cadmium Playercore - Module 67442
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 67442
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.iFa = void 0;
d = a(50214);
p = a(85068);
t = (function() {
    function c(g, f) {
        var e;
        this.console = g;
        this.Ig = f.Ig;
        this.sPa = null !== (e = f.sPa) && void 0 !== e ? e : !1;
        this.clear();
    }
    Object.defineProperties(c.prototype, {
        mF: {
            get: function() {
                return this.rg.length;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(c.prototype, {
        GY: {
            get: function() {
                return this.x9.size;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    c.prototype.Ytb = function() {
        var g;
        for (; this.x9.size < this.Ig && this.rg.length; ) {
            g = this.rg.pop();
            this.hzb(g);
        }
    }
    ;
    c.prototype.hzb = function(g) {
        var f;
        f = this;
        this.console.debug("Execute throttler item", {
            sya: g.item.priority,
            mF: this.mF,
            rqb: this.GY,
            vda: g.un.aO
        });
        g.un.aO || (g.un.resolve(g.item.LFb()),
        this.x9.add(g.item),
        g.un.promise.catch(function() {
            return f.remove(g.item);
        }),
        this.sPa && g.un.promise.then(function() {
            return f.remove(g.item);
        }, function() {
            return f.remove(g.item);
        }));
    }
    ;
    c.prototype.add = function(g) {
        var f, e;
        f = this;
        this.console.debug("item added", {
            sya: g.priority,
            mF: this.mF,
            rqb: this.GY
        });
        e = {
            item: g,
            un: new p.Zo()
        };
        this.rg.push(e);
        this.Ytb();
        return {
            uT: function() {
                f.rg.remove(e);
                f.hzb(e);
            },
            item: e.un.promise
        };
    }
    ;
    c.prototype.remove = function(g) {
        var f, e;
        this.console.debug("item removed", {
            sya: g.priority,
            mF: this.mF,
            rqb: this.GY
        });
        e = this.rg.find(function(h) {
            return h.item === g;
        });
        e && this.rg.remove(e);
        this.x9.delete(g);
        null === (f = g.q1a) || void 0 === f ? void 0 : f.call(g);
        this.Ytb();
    }
    ;
    c.prototype.clear = function() {
        var g, f;
        null === (g = this.x9) || void 0 === g ? void 0 : g.forEach(function(e) {
            var h;
            return null === (h = e.q1a) || void 0 === h ? void 0 : h.call(e);
        });
        null === (f = this.rg) || void 0 === f ? void 0 : f.map(function(e) {
            var h, k;
            return null === (k = (h = e.item).q1a) || void 0 === k ? void 0 : k.call(h);
        });
        this.rg = new d.LP([],function(e, h) {
            return e.item.priority - h.item.priority;
        }
        );
        this.x9 = new Set();
    }
    ;
    return c;
}
)();
b.iFa = t;


// Detected exports: iFa