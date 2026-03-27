/**
 * Netflix Cadmium Playercore - Module 26286
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 26286
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.jab = void 0;
d = a(22970);
p = a(91176);
c = a(66164);
t = (function() {
    function g(f, e, h, k, l, m) {
        this.J = f;
        this.kC = e;
        this.OI = h;
        this.oNc = k;
        this.y1a = l;
        this.Mba = m;
        this.UNa = new p.Zo();
    }
    Object.defineProperties(g.prototype, {
        L: {
            get: function() {
                var f;
                return null === (f = this.Tia) || void 0 === f ? void 0 : f.L;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        mq: {
            get: function() {
                return this.UNa.promise;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    g.prototype.La = function() {
        var f;
        this.L && (this.L.s2c(this.ma),
        this.y1a(this.L));
        null === (f = this.Tia) || void 0 === f ? void 0 : f.Qk.release();
        this.Tia = void 0;
    }
    ;
    g.prototype.kta = function() {
        return this.kC.kta(this.J);
    }
    ;
    g.prototype.Gb = function(f, e) {
        return d.__awaiter(this, void 0, void 0, function() {
            var h, k, l, m, n, q, r, u, v;
            return d.__generator(this, function(w) {
                switch (w.label) {
                case 0:
                    return (this.ma = f,
                    this.kC.kta(this.J) || !e ? [3, 2] : [4, e()]);
                case 1:
                    h = w.T();
                    if (f.fd)
                        throw Error("Branch cancelled");
                    w.label = 2;
                case 2:
                    k = this.Mba();
                    l = this.kC.Yp(this.J, k);
                    m = l.mq;
                    n = l.L;
                    q = l.Qk;
                    this.Tia = {
                        Qk: q,
                        L: n
                    };
                    r = {
                        jC: c.platform.time.fa(),
                        mC: void 0
                    };
                    if (n)
                        return (r.mC = r.jC,
                        this.lFb(n, f, h, r, !1),
                        this.UNa.resolve(n),
                        [2, n]);
                    w.label = 3;
                case 3:
                    return (w.ac.push([3, 5, , 6]),
                    [4, m]);
                case 4:
                    return (u = w.T(),
                    r.mC = c.platform.time.fa(),
                    [3, 6]);
                case 5:
                    throw (v = w.T(),
                    r.mC = c.platform.time.fa(),
                    this.oNc(f, v, h, r),
                    v);
                case 6:
                    return (this.UNa.resolve(u),
                    this.lFb(u, f, h, r, !0),
                    [2, u]);
                }
            });
        });
    }
    ;
    g.prototype.lFb = function(f, e, h, k, l) {
        this.Tia && (this.Tia.L = f,
        f.vTc(e),
        this.OI(e, f, h, k, l));
    }
    ;
    return g;
}
)();
b.jab = t;


// Detected exports: jab