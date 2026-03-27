/**
 * Netflix Cadmium Playercore - Module 88874
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 88874
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Hjb = void 0;
d = a(22970);
p = a(91176);
c = a(69575);
g = a(52571);
f = a(61520);
t = (function() {
    function e() {
        this.bb = new c.phb();
        this.Lr = new f.pma();
    }
    Object.defineProperties(e.prototype, {
        empty: {
            get: function() {
                return this.bb.empty;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        size: {
            get: function() {
                return this.bb.size;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    e.prototype.reset = function() {
        var h;
        h = this.bb.values();
        this.bb.clear();
        this.Lr.clear();
        h.forEach(function(k) {
            return k.Tg();
        });
    }
    ;
    e.prototype.yn = function(h, k, l) {
        var m, n;
        m = this.bb.get(h);
        if (k) {
            n = null === m || void 0 === m ? void 0 : m.filter(function(q) {
                return q.K.Va === k;
            });
            0 === (null === n || void 0 === n ? void 0 : n.length) && (null === l || void 0 === l ? void 0 : l.trace(("getBranches ").concat(h, " startTimeMs: ").concat(k, " no matches, have ").concat(null === m || void 0 === m ? void 0 : m.map(function(q) {
                return q.K.Va;
            }))));
            return n;
        }
        return m;
    }
    ;
    e.prototype.has = function(h) {
        return this.bb.has(h);
    }
    ;
    e.prototype.root = function() {
        return this.Lr.root;
    }
    ;
    e.prototype.contains = function(h) {
        var k;
        k = h.K.id;
        if (this.has(k))
            return -1 !== this.yn(k).indexOf(h);
    }
    ;
    e.prototype.SL = function(h) {
        this.Lr.SL(h);
    }
    ;
    e.prototype.Fsa = function(h) {
        return this.Lr.parent(h);
    }
    ;
    e.prototype.Jvc = function(h) {
        return this.Lr.children(h);
    }
    ;
    e.prototype.$sa = function(h) {
        return this.Lr.$sa(h);
    }
    ;
    e.prototype.ITc = function(h) {
        var k;
        if (this.bb.delete(h.K.id, h)) {
            k = this.Lr.children(h);
            this.Lr.root === h ? 0 === k.length ? this.Lr.clear() : ((0,
            g.assert)(1 === k.length, "cannot remove the root branch with multiple successors"),
            this.Lr.$Tc(k[0])) : ((0,
            g.assert)(0 === k.length, "cannot remove non-root branch with successors"),
            this.Lr.remove(h));
        }
    }
    ;
    e.prototype.forEach = function(h) {
        var k;
        k = this;
        this.bb.forEach(function(l, m) {
            return h(l, m, k);
        });
    }
    ;
    e.prototype.values = function() {
        return this.bb.values();
    }
    ;
    e.prototype.reduce = function(h, k) {
        var l;
        l = this;
        return this.bb.reduce(function(m, n, q) {
            return h(m, n, q, l);
        }, k);
    }
    ;
    e.prototype.map = function(h) {
        var k;
        k = this;
        return this.bb.map(function(l, m) {
            return h(l, m, k);
        });
    }
    ;
    e.prototype.filter = function(h) {
        var k;
        k = this;
        return this.bb.filter(function(l, m) {
            return h(l, m, k);
        });
    }
    ;
    e.prototype.cAc = function() {
        var h;
        h = {};
        this.forEach(function(k, l) {
            (k = k.Gz) && (h[l] || (h[l] = [])).push(k.G);
        });
        return h;
    }
    ;
    e.prototype.E2c = function(h, k, l) {
        var m, n;
        m = this;
        h = this.Ylc(h, k, l);
        n = h.Gxb(this.Lr);
        k = n.NY;
        l = n.mz;
        n = n.c4a;
        this.Lr.clear();
        this.Lr = h;
        k.forEach(function(q) {
            return m.bb.set(q.K.id, q);
        });
        k.forEach(function(q) {
            return q.Gb();
        });
        l.forEach(function(q) {
            return m.bb.delete(q.K.id, q);
        });
        n.forEach(function(q) {
            q.exa();
        });
        return {
            mz: l,
            c4a: n
        };
    }
    ;
    e.prototype[Symbol.iterator] = function() {
        return d.__generator(this, function(h) {
            switch (h.label) {
            case 0:
                return [5, d.__values(this.bb)];
            case 1:
                return (h.T(),
                [2]);
            }
        });
    }
    ;
    e.prototype.Ylc = function(h, k, l) {
        var m, n, q;
        m = this;
        n = new Map();
        q = new f.pma();
        h.SL(function(r, u) {
            var v, w, x;
            if (u) {
                v = n.get(u);
                if (!v)
                    return !0;
            }
            w = (0,
            p.kc)(m.yn(r.K.id, r.K.Va, l), function(y) {
                return m.Lr.parent(y) === v || !u;
            });
            null === l || void 0 === l ? void 0 : l.trace(("createNewBranchTree ").concat(r.K.id, " reusableBranch: ").concat(!!w));
            x = w || k(r.K.id, v);
            x.xh = r.xh;
            n.set(r, x);
            q.add(x, v);
            w && x.update(r.K);
            return !0;
        });
        return q;
    }
    ;
    return e;
}
)();
b.Hjb = t;


// Detected exports: Hjb