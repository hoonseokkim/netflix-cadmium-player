/**
 * Netflix Cadmium Playercore - Module 93652
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 93652
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h, k, l;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.Mvb = b.AHa = b.unc = b.oM = void 0;
t = a(22970);
d = t.__importDefault(a(51411));
p = t.__importDefault(a(10690));
c = t.__importDefault(a(42979));
g = t.__importDefault(a(36114));
f = t.__importDefault(a(20754));
e = a(54449);
a(61693);
a(97962);
h = t.__importDefault(a(32260));
k = a(32260);
new Uint8Array(0);
b.oM = function(m) {
    if (0 > m || m > d.default.kf)
        throw new p.default("Message ID " + m + " is outside the valid range.");
    return m == d.default.kf ? 0 : m + 1;
}
;
b.unc = function(m) {
    if (0 > m || m > d.default.kf)
        throw new p.default("Message ID " + m + " is outside the valid range.");
    return 0 == m ? d.default.kf : m - 1;
}
;
l = (function() {
    function m(n, q, r, u, v) {
        var w;
        w = this;
        c.default(v, function() {
            if (void 0 == u || null == u)
                u = h.default.Nyc(n);
            else if (0 > u || u > d.default.kf)
                throw new p.default("Message ID " + u + " is outside the valid range.");
            n.nsa({
                result: function(x) {
                    c.default(v, function() {
                        w.tFb(n, u, n.EG, x, q, r, null);
                        return w;
                    });
                },
                error: v.error
            });
        });
    }
    m.prototype.tFb = function(n, q, r, u, v, w, x) {
        var y, A;
        y = [];
        A = n.Zm.dM(v, w);
        y.push.apply(y, A);
        x && x.forEach(function(z) {
            if (z.Iy() && !z.Qh(v))
                throw new f.default(g.default.hKa,"st " + z + "; mt " + v).qc(v);
            if (z.Nw() && !z.Qh(w))
                throw new f.default(g.default.iKa,"st " + z + "; uit " + w).qc(v).Ne(w);
            y.push(z);
        }, this);
        this.Ak = n;
        this.lQ = u;
        this.Zt = v;
        this.uQ = q;
        this.EG = r;
        this.zK = null;
        this.d9 = this.Vx = this.Q8 = !1;
        this.AK = {};
        this.RNa = null;
        this.HQ = w;
        this.tD = y;
        this.Q9b = this.O9b = null;
        this.P9b = [];
    }
    ;
    m.prototype.ECb = function() {
        return this.uQ;
    }
    ;
    m.prototype.vi = function(n) {
        if (0 > n || n > d.default.kf)
            throw new p.default("Message ID " + n + " is out of range.");
        this.uQ = n;
        return this;
    }
    ;
    m.prototype.oE = function() {
        return this.Zt;
    }
    ;
    m.prototype.yy = function() {
        return this.HQ;
    }
    ;
    m.prototype.ZXb = function() {
        return this.Zt || this.lQ.scheme.bra;
    }
    ;
    m.prototype.$Xb = function() {
        return this.Zt || this.zK || this.lQ.scheme.bra;
    }
    ;
    m.prototype.aYb = function() {
        return this.Zt || this.lQ.scheme.OOb;
    }
    ;
    m.prototype.bYb = function() {
        return this.Zt || this.zK || this.lQ.scheme.OOb;
    }
    ;
    m.prototype.Os = function(n) {
        var q;
        q = this;
        c.default(n, function() {
            var r, u, v;
            r = q.zK ? q.zK.keyResponseData : null;
            u = [];
            for (v in q.AK)
                u.push(q.AK[v]);
            if (q.Q8) {
                if (!q.Zt)
                    throw new f.default(g.default.v3b);
                v = q.Ak.Zm.byc(q.Zt);
            } else
                v = null;
            r = new e.Mdb(q.uQ,v,q.d9,q.Vx,q.EG,u,r,q.RNa,q.HQ,q.tD);
            u = new e.Rdb(q.O9b,q.Q9b,q.P9b);
            q.SZ(q.Ak, q.lQ, q.Zt, r, u, n);
        });
    }
    ;
    m.prototype.SZ = function(n, q, r, u, v, w) {
        e.SZ(n, q, r, u, v, w);
    }
    ;
    m.prototype.Su = function() {
        return this.Q8;
    }
    ;
    m.prototype.nV = function(n) {
        if (this.Q8 = n)
            this.Vx = !1;
    }
    ;
    m.prototype.Tu = function() {
        return this.d9;
    }
    ;
    m.prototype.F5a = function(n) {
        (this.d9 = n) || (this.Vx = !1);
    }
    ;
    m.prototype.zM = function() {
        return this.Vx;
    }
    ;
    m.prototype.wXc = function(n) {
        if (this.Vx = n)
            (this.Q8 = !1,
            this.d9 = !0);
    }
    ;
    m.prototype.cSb = function(n, q) {
        var r, u, w;
        r = this;
        if (q && !q.Qh(n))
            throw new p.default("User ID token must be bound to master token.");
        if (this.zK)
            throw new p.default("Attempt to set message builder master token when key exchange data exists as a trusted network server.");
        try {
            u = this.Ak.Zm.dM(n, q);
        } catch (x) {
            if (k.Md(x))
                throw new p.default("Invalid master token and user ID token combination despite checking above.",x);
            throw x;
        }
        for (var v = this.tD.length - 1; 0 <= v; --v) {
            w = this.tD[v];
            (w.Nw() && !w.Qh(q) || w.Iy() && !w.Qh(n)) && this.tD.splice(v, 1);
        }
        u.forEach(function(x) {
            r.ezb(x.name, x.Iy(), x.Nw());
            r.tD.push(x);
        });
        this.Zt = n;
        (this.HQ = q) || (this.RNa = null);
    }
    ;
    m.prototype.If = function(n) {
        this.RNa = n;
        return this;
    }
    ;
    m.prototype.Eac = function(n) {
        this.AK[n.wi()] = n;
    }
    ;
    m.prototype.Xac = function(n) {
        var q;
        q = this.zK ? this.zK.keyResponseData.mc : this.Zt;
        if (n.Iy() && !n.Qh(q))
            throw new f.default(g.default.hKa,"st " + n + "; mt " + q).qc(q);
        if (n.Nw() && !n.Qh(this.HQ))
            throw new f.default(g.default.iKa,"st " + n + "; uit " + this.HQ).qc(q).Ne(this.HQ);
        this.ezb(n.name, n.Iy(), n.Nw());
        this.tD.push(n);
    }
    ;
    m.prototype.ezb = function() {
        var n, q, r, v;
        if (1 == arguments.length) {
            n = arguments[0];
            q = n.name;
            r = n.Iy();
            n = n.Nw();
        } else
            (arguments.length = 3,
            q = arguments[0],
            r = arguments[1],
            n = arguments[2]);
        for (var u = this.tD.length - 1; 0 <= u; --u) {
            v = this.tD[u];
            v.name == q && v.Iy() == r && v.Nw() == n && this.tD.splice(u, 1);
        }
    }
    ;
    m.prototype.dM = function() {
        var n;
        n = [];
        n.push.apply(n, this.tD);
        return n;
    }
    ;
    return m;
}
)();
b.AHa = l;
b.Mvb = function(m, n, q, r, u) {
    new l(m,n,q,r,u);
}
;


// Detected exports: Mvb, AHa, unc, oM