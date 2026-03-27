/**
 * Netflix Cadmium Playercore - Module 61651
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 61651
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(91176);
c = a(52571);
g = a(48170);
f = a(17122);
t = (function(e) {
    function h(k) {
        var l;
        l = e.call(this) || this;
        l.ka = k;
        l.W8 = new Map();
        l.bb = [];
        l.al = Number.MAX_SAFE_INTEGER;
        l.y8 = new f.dma({
            zj: false,
            currentTime: function() {
                return l.Sd ? l.Rd : p.I.uh;
            },
            speed: 1
        });
        return l;
    }
    d.__extends(h, e);
    Object.defineProperties(h.prototype, {
        Qa: {
            get: function() {
                return this.y8;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(h.prototype, {
        sd: {
            get: function() {
                throw Error("Can't get scheduler on placeholder player");
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(h.prototype, {
        lq: {
            get: function() {
                return this.q9;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(h.prototype, {
        cx: {
            get: function() {
                return this.W8;
            },
            enumerable: false,
            configurable: true
        }
    });
    h.prototype.xoa = function(k, l) {
        var m;
        m = !this.ka;
        m && (this.ka = k,
        this.lMa = (null === l || undefined === l ? 0 : l.Sd) ? l.Rd : undefined,
        this.q9 = null === l || undefined === l ? undefined : l.lq,
        this.W8 = l ? l.cx : new Map(),
        null === l || undefined === l ? undefined : l.L2());
        return m;
    }
    ;
    h.prototype.L2 = function() {
        this.W8 = this.q9 = undefined;
    }
    ;
    h.prototype.sL = function() {
        this.bb = [];
        this.lMa = undefined;
    }
    ;
    h.prototype.vSa = function(k) {
        g.u && (0,
        c.assert)(this.ka === k);
        this.ka = undefined;
        this.sL();
    }
    ;
    h.prototype.P_ = function() {
        for (var k, l = [], m = 0; m < arguments.length; m++)
            l[m] = arguments[m];
        (k = this.bb).push.apply(k, d.__spreadArray([], d.__read(l), false));
        e.prototype.P_.apply(this, d.__spreadArray([], d.__read(l), false));
    }
    ;
    h.prototype.iE = function() {
        return this.lMa ? this.lMa : e.prototype.iE.call(this);
    }
    ;
    h.prototype.gda = function() {
        return false;
    }
    ;
    h.prototype.pO = function() {}
    ;
    h.prototype.hVa = function() {
        return Infinity;
    }
    ;
    h.prototype.fha = function() {}
    ;
    h.prototype.AV = function() {}
    ;
    h.prototype.La = function() {
        e.prototype.La.call(this);
        this.cx.forEach(function(k) {
            return k.close();
        });
    }
    ;
    return h;
}
)(a(82867).uJa);
export const sla = t;

// Detected exports: sla