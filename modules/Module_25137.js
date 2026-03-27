/**
 * Netflix Cadmium Playercore - Module 25137
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 25137
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.UX = void 0;
t = a(22970);
d = t.__importDefault(a(51411));
p = t.__importDefault(a(10690));
c = t.__importDefault(a(1966));
g = t.__importDefault(a(36114));
f = a(32260);
a = (function() {
    function e() {
        this.Zs = {};
        this.$Z = {};
        this.Iz = {};
        this.Wea = {};
        this.b5 = {};
        this.p2 = {};
        this.a5 = {};
    }
    e.prototype.dha = function(h, k) {
        var l;
        if (k) {
            l = h.wi();
            this.Zs[l] = h;
            this.$Z[l] = k;
        } else
            this.OPb(h);
    }
    ;
    e.prototype.oE = function() {
        var h, k, l;
        h = null;
        for (k in this.Zs) {
            l = this.Zs[k];
            if (!h || l.kEc(h))
                h = l;
        }
        return h;
    }
    ;
    e.prototype.byc = function(h) {
        var k;
        h = h.Vf;
        k = void 0 !== this.Wea[h] ? this.Wea[h] : 0;
        if (0 > k || k > d.default.kf)
            throw new p.default("Non-replayable ID " + k + " is outside the valid range.");
        k = k == d.default.kf ? 0 : k + 1;
        return this.Wea[h] = k;
    }
    ;
    e.prototype.WA = function(h) {
        return this.$Z[h.wi()];
    }
    ;
    e.prototype.OPb = function(h) {
        var k, l, m, n, q;
        k = this;
        l = h.wi();
        if (this.Zs[l]) {
            m = h.Vf;
            for (n in this.Zs) {
                q = this.Zs[n];
                if (!q.equals(h) && q.Vf == m) {
                    delete this.Zs[l];
                    delete this.$Z[l];
                    return;
                }
            }
            Object.keys(this.Iz).forEach(function(r) {
                r = k.Iz[r];
                r.Qh(h) && k.fga(r);
            });
            try {
                this.Uya(null, h, null);
            } catch (r) {
                if (f.Md(r))
                    throw new p.default("Unexpected exception while removing master token bound service tokens.",r);
                throw r;
            }
            delete this.Wea[m];
            delete this.Zs[l];
            delete this.$Z[l];
        }
    }
    ;
    e.prototype.Ghc = function() {
        [this.Zs, this.$Z, this.Wea, this.Iz, this.a5, this.p2].forEach(function(h) {
            for (var k in h)
                delete h[k];
        });
    }
    ;
    e.prototype.Vna = function(h, k) {
        var l, m;
        l = !1;
        for (m in this.Zs)
            if (k.Qh(this.Zs[m])) {
                l = !0;
                break;
            }
        if (!l)
            throw new c.default(g.default.T6b,"uit mtserialnumber " + k.ik);
        this.Iz[h] = k;
    }
    ;
    e.prototype.yy = function(h) {
        return this.Iz[h];
    }
    ;
    e.prototype.fga = function(h) {
        var k, l, m, n;
        k = this;
        l = null;
        for (m in this.Zs) {
            n = this.Zs[m];
            if (h.Qh(n)) {
                l = n;
                break;
            }
        }
        Object.keys(this.Iz).forEach(function(q) {
            if (k.Iz[q].equals(h)) {
                try {
                    k.Uya(null, l, h);
                } catch (r) {
                    if (f.Md(r))
                        throw new p.default("Unexpected exception while removing user ID token bound service tokens.",r);
                    throw r;
                }
                delete k.Iz[q];
            }
        });
    }
    ;
    e.prototype.Sna = function(h) {
        var k;
        k = this;
        h.forEach(function(l) {
            var m, n;
            if (l.Iy()) {
                m = !1;
                for (n in k.Zs)
                    if (l.Qh(k.Zs[n])) {
                        m = !0;
                        break;
                    }
                if (!m)
                    throw new c.default(g.default.a6b,"st mtserialnumber " + l.ik);
            }
            if (l.Nw()) {
                m = !1;
                for (var q in k.Iz)
                    if (l.Qh(k.Iz[q])) {
                        m = !0;
                        break;
                    }
                if (!m)
                    throw new c.default(g.default.c6b,"st uitserialnumber " + l.Fz);
            }
        });
        h.forEach(function(l) {
            var m;
            if (l.WEc())
                k.b5[l.wi()] = l;
            else {
                if (l.Iy()) {
                    m = k.p2[l.ik];
                    m || (m = {});
                    m[l.wi()] = l;
                    k.p2[l.ik] = m;
                }
                l.Nw() && ((m = k.a5[l.Fz]) || (m = {}),
                m[l.wi()] = l,
                k.a5[l.Fz] = m);
            }
        });
    }
    ;
    e.prototype.dM = function(h, k) {
        var l, m, n;
        if (k) {
            if (!h)
                throw new c.default(g.default.U6b);
            if (!k.Qh(h))
                throw new c.default(g.default.uLa,"uit mtserialnumber " + k.ik + "; mt " + h.Vf);
        }
        l = {};
        for (m in this.b5) {
            n = this.b5[m];
            l[n.wi()] = n;
        }
        if (h && (m = this.p2[h.Vf]))
            for (var q in m)
                (n = m[q],
                n.Nw() || (l[q] = n));
        if (k && (k = this.a5[k.Vf]))
            for (var r in k)
                (q = k[r],
                q.Qh(h) && (l[r] = q));
        h = [];
        for (var u in l)
            h.push(l[u]);
        return h;
    }
    ;
    e.prototype.Uya = function(h, k, l) {
        var m, n, q;
        m = this;
        if (l && k && !l.Qh(k))
            throw new c.default(g.default.uLa,"uit mtserialnumber " + l.ik + "; mt " + k.Vf);
        !h || k || l || Object.keys(this.b5).forEach(function(r) {
            m.b5[r].name == h && delete m.b5[r];
        });
        k && !l && (n = this.p2[k.Vf]) && (Object.keys(n).forEach(function(r) {
            var u;
            u = n[r];
            h && u.name != h || delete n[r];
        }),
        this.p2[k.Vf] = n);
        l && (q = this.a5[l.Vf]) && (k = Object.keys(q),
        k.forEach(function(r) {
            var u;
            u = q[r];
            h && u.name != h || delete q[r];
        }),
        this.a5[l.Vf] = q);
    }
    ;
    return e;
}
)();
b.UX = a;


// Detected exports: UX