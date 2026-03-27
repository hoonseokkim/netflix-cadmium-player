/**
 * Netflix Cadmium Playercore - Module 56841
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 56841
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.l7 = void 0;
d = a(22970);
p = a(26388);
c = a(33923);
g = a(72793);
f = a(52571);
e = a(45247);
h = a(7559);
t = (function() {
    function k() {}
    k.prototype.Ivb = function(l, m, n, q, r, u, v, w) {
        void 0 === v && (v = []);
        m = this.Ewc(l, m, n, r, u, q, w);
        switch (l.lFc) {
        case "videofirst":
            return this.zlc(m, u, v);
        default:
            return this.ylc(m, u, v);
        }
    }
    ;
    k.prototype.ylc = function(l, m, n) {
        var u, v, w;
        function q(x, y) {
            return Math.exp((y.Wb ? Math.log(y.Wb) : 0) + (x.mAa ? .13 * Math.log(25 * (x.mAa - 1)) : 0));
        }
        function r(x, y, A, z) {
            var B, C;
            B = q(x, y);
            C = q(A, z);
            x = A.bitrate - x.bitrate + (z.bitrate - y.bitrate);
            return 0 !== x ? (C - B) / x : 0;
        }
        n = 0 < n.length ? n[0] : void 0;
        u = [];
        v = 0;
        w = 0;
        for (u.push(new c.QJ({
            audio: l[v],
            video: m[w],
            text: n
        })); v + 1 < l.length && w + 1 < m.length; )
            (v = [{
                m4: r(l[v], m[w], l[v], m[w + 1]),
                gYa: [v, w + 1]
            }, {
                m4: r(l[v], m[w], l[v + 1], m[w]),
                gYa: [v + 1, w]
            }, {
                m4: r(l[v], m[w], l[v + 1], m[w + 1]),
                gYa: [v + 1, w + 1]
            }],
            v.sort(function(x, y) {
                return x.m4 - y.m4;
            }),
            w = d.__read(v[v.length - 1].gYa, 2),
            v = w[0],
            w = w[1],
            u.push(new c.QJ({
                audio: l[v],
                video: m[w],
                text: n
            })));
        if (w + 1 < m.length)
            for (w++; w < m.length; w++)
                u.push(new c.QJ({
                    audio: l[v],
                    video: m[w],
                    text: n
                }));
        if (v + 1 < l.length)
            for (v++; v < l.length; v++)
                u.push(new c.QJ({
                    audio: l[v],
                    video: m[w],
                    text: n
                }));
        return u;
    }
    ;
    k.prototype.zlc = function(l, m, n) {
        var q, r, u;
        r = [];
        n = 0 < n.length ? n[0] : void 0;
        (0,
        f.assert)(0 < l.length && 0 < m.length, "We should have at least one video stream and one audio stream");
        if (0 < l.length) {
            u = l[0];
            try {
                for (var v = d.__values(m), w = v.next(); !w.done; w = v.next())
                    r.push(new c.QJ({
                        audio: u,
                        video: w.value,
                        text: n
                    }));
            } catch (y) {
                var x;
                x = {
                    error: y
                };
            } finally {
                try {
                    w && !w.done && (q = v.return) && q.call(v);
                } finally {
                    if (x)
                        throw x.error;
                }
            }
            if (1 < l.length && 0 < m.length)
                for ((m = m[m.length - 1],
                x = 1); x < l.length; x++)
                    r.push(new c.QJ({
                        audio: l[x],
                        video: m,
                        text: n
                    }));
        }
        return r;
    }
    ;
    k.prototype.PYc = function(l, m, n, q) {
        var r, u;
        r = m && m.fj(p.l.V);
        if (q === e.Yb.Ul || !r)
            return !1;
        u = m.fj(p.l.V);
        if (!n.some(function(v) {
            return v === u;
        }))
            return !1;
        m = u.profile;
        return l.cq && 0 <= l.cq.indexOf(m) ? !1 : !0;
    }
    ;
    k.prototype.Ewc = function(l, m, n, q, r, u, v) {
        if (this.PYc(l, v, q, u))
            q = [v.fj(p.l.V)];
        else if ((q = new g.j$a(l).Oh(q, void 0, void 0, void 0, u),
        v = q[0],
        r = r[0],
        !(0,
        h.PFb)(v.profile, l))) {
            l = 0;
            v && v.er && v.Db && v.Db.confidence ? (m = m(v.Db, n, u, 0, !1),
            l = Math.floor(m.lower) || 1) : r && r.er && r.Db && r.Db.confidence && (m = m(r.Db, n, u, 0, !1),
            l = Math.floor(m.lower) || 1);
            m = q.length - 1;
            for (m; 0 < m && !(l && q[m].bitrate < .15 * l); --m)
                ;
            q = [q[m]];
        }
        return q;
    }
    ;
    return k;
}
)();
b.l7 = t;


// Detected exports: l7