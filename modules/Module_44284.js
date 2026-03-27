/**
 * Netflix Cadmium Playercore - Module 44284
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 44284
// Parameters: t (module), b (exports), a (require)


var p, c, g, f;
function d(e, h, k) {
    var l;
    l = (0,
    c.hn)(e, function(m) {
        return k && m.Wb ? m.Wb > k : m.bitrate > h;
    });
    l = 0 < l ? l - 1 : 0 === l ? 0 : e.length - 1;
    return e[l];
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.dGa = b.jLa = void 0;
b.wDb = d;
p = a(22970);
c = a(91176);
g = a(33923);
t = (function() {
    function e() {
        this.wC = [];
    }
    Object.defineProperties(e.prototype, {
        first: {
            get: function() {
                var h;
                return null === (h = this.wC[0]) || void 0 === h ? void 0 : h.Xd;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    e.prototype.OQ = function(h) {
        this.wC.push({
            Xd: h
        });
    }
    ;
    e.prototype.TL = function(h) {
        this.wC.forEach(function(k, l) {
            return h(k.Xd, l);
        });
    }
    ;
    e.prototype.JAb = function(h) {
        this.TL(function(k) {
            k.forEach(function(l, m) {
                return h(l, m);
            });
        });
    }
    ;
    e.prototype.FWa = function(h, k, l) {
        var m, n, q, r, u, v, w;
        m = l;
        n = k;
        q = 0;
        r = [];
        u = this.first[h];
        v = u.Wb;
        w = u.bitrate;
        this.wC.forEach(function(x, y) {
            var A, z;
            x = x.Xd;
            0 >= m || (y = 0 === y ? u : d(x, w, v),
            x = null === (A = y.Ta) || void 0 === A ? void 0 : A.Mpa(n, m),
            A = null !== (z = null === x || void 0 === x ? void 0 : x.blocks) && void 0 !== z ? z : 0,
            q += A,
            r.push({
                stream: y,
                blocks: A,
                Ve: n
            }),
            null === x || void 0 === x ? !0 : !x.A3) || (n = 0,
            m -= x.A3);
        });
        return {
            D6a: r,
            C7a: q
        };
    }
    ;
    e.prototype.y1c = function() {
        var h, k;
        h = new f();
        k = this.wC.map(function(l) {
            var m;
            m = l.Xd.map(function(n) {
                return (0,
                g.F6a)(n);
            });
            return p.__assign(p.__assign({}, l), {
                Xd: m
            });
        });
        h.ZXc(k);
        return h;
    }
    ;
    return e;
}
)();
b.jLa = t;
f = (function() {
    function e() {
        this.wC = [];
    }
    Object.defineProperties(e.prototype, {
        first: {
            get: function() {
                var h;
                return null === (h = this.wC[0]) || void 0 === h ? void 0 : h.Xd;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    e.prototype.OQ = function(h) {
        this.wC.push({
            Xd: h
        });
    }
    ;
    e.prototype.TL = function(h) {
        this.wC.forEach(function(k, l) {
            return h(k.Xd, l);
        });
    }
    ;
    e.prototype.JAb = function(h) {
        this.TL(function(k) {
            k.forEach(function(l, m) {
                return h(l, m);
            });
        });
    }
    ;
    e.prototype.ZXc = function(h) {
        this.wC = p.__spreadArray([], p.__read(h), !1);
    }
    ;
    e.prototype.FWa = function(h, k, l) {
        var m, n, q, r, u, v, w;
        m = l;
        n = k;
        q = 0;
        r = [];
        u = this.first[h];
        v = u.Wb;
        w = u.bitrate;
        this.wC.forEach(function(x, y) {
            var A, z;
            x = x.Xd;
            0 >= m || (y = 0 === y ? u : d(x, w, v),
            x = null === (A = y.Ta) || void 0 === A ? void 0 : A.Mpa(n, m),
            A = null !== (z = null === x || void 0 === x ? void 0 : x.blocks) && void 0 !== z ? z : 0,
            q += A,
            r.push({
                stream: y,
                blocks: A,
                Ve: n
            }),
            null === x || void 0 === x ? !0 : !x.A3) || (n = 0,
            m -= x.A3);
        });
        return {
            D6a: r,
            C7a: q
        };
    }
    ;
    e.prototype.toJSON = function() {
        return {};
    }
    ;
    return e;
}
)();
b.dGa = f;


// Detected exports: dGa, jLa, wDb