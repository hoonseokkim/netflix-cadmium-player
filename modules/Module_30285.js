/**
 * Netflix Cadmium Playercore - Module 30285
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Icb
 * Dependencies: 22970
 * Purpose: Event handling, Configuration, Parsing/Serialization, Enum definitions
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 30285
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
t = (function() {
    class c {
    constructor(g, f) {
        undefined === f && (f = {});
        this.yp = g;
        this.options = f;
        this.dS = [];
        this.VS = new p(g,this.Dac.bind(this));
    }
    Dac(g) {
        for (var f, e, h, k, l, m, n = [], q = 1; q < arguments.length; q++)
            n[q - 1] = arguments[q];
        n = {
            yw: g,
            gn: n
        };
        if (null !== (h = null === (e = (f = this.options).JYc) || undefined === e ? undefined : e.call(f, n, this.dS)) && undefined !== h ? h : 1)
            (f = n,
            this.options.Hld && (f = JSON.parse(JSON.stringify(n))),
            this.dS.push(f));
        return null !== (m = null === (l = (k = this.options).Gld) || undefined === l ? undefined : l.call(k, n)) && undefined !== m ? m : true;
    }
    ega(g) {
        this.dS = this.dS.filter(function(f, e) {
            return !g(f, e);
        });
    }
    e4a() {
        var g;
        g = this;
        this.VS.a8a();
        this.dS.forEach(function(f) {
            var e;
            (e = g.yp).emit.apply(e, d.__spreadArray([f.yw], d.__read(f.gn), false));
        });
        this.VS.EFb();
    }
    clear() {
        this.dS = [];
    }
    La() {
        this.clear();
        this.VS.a8a();
        this.options = undefined;
    }
    wlc() {
        var g;
        g = this;
        this.VS = function(f) {
            for (var e, h, k = [], l = 1; l < arguments.length; l++)
                k[l - 1] = arguments[l];
            return (null === (h = g.EA) || undefined === h ? 0 : h.call.apply(h, d.__spreadArray([g, f], d.__read(k), false))) ? (e = g.tMb).call.apply(e, d.__spreadArray([g.yp, f], d.__read(k), false)) : false;
        }
        ;
    }
    EFb() {
        this.VS && (this.yp.emit = this.VS);
    }
    a8a() {
        this.yp.emit = this.tMb;
    }
    La() {
        this.a8a();
        this.EA = this.VS = undefined;
    }
}
Object.defineProperties(c.prototype, {
        length: {
            get: function() {
                return this.dS.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    return c;
}
)();
export const Icb = t;
p = (function() {
    function c(g, f) {
        this.yp = g;
        this.EA = f;
        this.tMb = this.yp.emit;
        this.wlc();
        this.EFb();
    }
    return c;
}
)();

// Detected exports: Icb
