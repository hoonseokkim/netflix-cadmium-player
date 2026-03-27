/**
 * Netflix Cadmium Playercore - Module 57086
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 57086
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.lfb = b.Jka = void 0;
d = a(22970);
p = a(66164);
c = a(90745);
g = a(73550);
f = a(43529);
e = a(4742);
t = (function() {
    function h(k, l) {
        this.name = l;
        this.no = new Map();
        this.Sma = new WeakMap();
        this.console = (0,
        e.Nf)(p.platform, k, "LeaseCache");
    }
    h.prototype.get = function(k) {
        if (this.no.has(k))
            return (k = this.no.get(k),
            {
                value: k.value,
                Qk: k.BB.wA()
            });
    }
    ;
    h.prototype.keys = function() {
        return this.no.keys();
    }
    ;
    Object.defineProperties(h.prototype, {
        size: {
            get: function() {
                return this.no.size;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    h.prototype.AVb = function(k, l, m) {
        var n, q;
        if (this.no.has(l)) {
            n = this.no.get(l);
            q = d.__assign(d.__assign({}, n), {
                key: m,
                value: n.value
            });
            this.BMa(n).clear();
            this.Sma.delete(n);
            k.iNa(l, m, q);
            this.no.delete(l);
            return n.value;
        }
    }
    ;
    h.prototype.iNa = function(k, l, m) {
        var n;
        n = this;
        this.no.set(l, m);
        this.BMa(m).addListener(m.BB.events, "leaseReleased", function(q) {
            return q.cua && n.delete(l);
        });
        m.BB.name = this.name;
    }
    ;
    h.prototype.update = function(k, l) {
        var m;
        this.no.has(k) && (k = this.no.get(k),
        k.value = null !== (m = l(k.value)) && void 0 !== m ? m : k.value);
    }
    ;
    h.prototype.eWa = function(k, l) {
        this.has(k) || this.K8b(k, l(k));
        return this.get(k);
    }
    ;
    h.prototype.K8b = function(k, l) {
        (0,
        f.assert)(!this.has(k), ("key ").concat(k, " already exists in cache"));
        this.JNa(k, l.value, l.tN);
    }
    ;
    h.prototype.BMa = function(k) {
        this.Sma.has(k) || this.Sma.set(k, new c.sf(this.console));
        return this.Sma.get(k);
    }
    ;
    h.prototype.has = function(k) {
        return this.no.has(k);
    }
    ;
    h.prototype.JNa = function(k, l, m) {
        var n, q;
        n = this;
        (0,
        f.assert)(!this.no.has(k), ("key ").concat(k, " already found"));
        q = {
            Ho: !0,
            key: k,
            value: l,
            tN: m,
            BB: new g.mX({
                name: ("").concat(this.name, ":").concat(k),
                cfa: function() {},
                console: this.console
            })
        };
        this.BMa(q).addListener(q.BB.events, "leaseReleased", function(r) {
            r.cua && n.has(k) && n.no.get(k) === q && n.delete(q.key);
        });
        this.no.set(k, q);
    }
    ;
    h.prototype.Nma = function(k) {
        var l, m;
        m = this.no.get(k);
        m && (null === (l = m.tN) || void 0 === l ? void 0 : l.call(m),
        m.Ho = !1,
        this.no.delete(k));
    }
    ;
    h.prototype.delete = function(k) {
        this.Nma(k);
    }
    ;
    h.prototype.values = function() {
        return this.no.values();
    }
    ;
    h.prototype.Hh = function() {
        this.clear();
    }
    ;
    h.prototype.clear = function() {
        var k;
        try {
            for (var l = d.__values(this.no.keys()), m = l.next(); !m.done; m = l.next())
                this.Nma(m.value);
        } catch (q) {
            var n;
            n = {
                error: q
            };
        } finally {
            try {
                m && !m.done && (k = l.return) && k.call(l);
            } finally {
                if (n)
                    throw n.error;
            }
        }
    }
    ;
    return h;
}
)();
b.Jka = t;
t = (function(h) {
    function k(l, m) {
        l = h.call(this, l, m) || this;
        l.cY = new Map();
        return l;
    }
    d.__extends(k, h);
    k.prototype.ZWc = function(l, m) {
        this.has(m) && (this.cY.has(l) || this.cY.set(l, new Set()),
        this.cY.get(l).add(m));
    }
    ;
    k.prototype.cvc = function(l) {
        if (l = this.cY.get(l))
            return l.values();
    }
    ;
    k.prototype.Wnc = function(l, m) {
        var n;
        this.delete(m);
        null === (n = this.cY.get(l)) || void 0 === n ? void 0 : n.delete(m);
    }
    ;
    k.prototype.Nma = function(l) {
        h.prototype.Nma.call(this, l);
        this.cY.delete(l);
    }
    ;
    k.prototype.iNa = function(l, m, n) {
        h.prototype.iNa.call(this, l, m, n);
        this.ZWc(l, m);
    }
    ;
    return k;
}
)(t);
b.lfb = t;


// Detected exports: lfb, Jka