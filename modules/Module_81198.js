/**
 * Netflix Cadmium Playercore - Module 81198
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 61161
 * Purpose: Utility module
 */

// import dep_61161 from './Module_61161.js';

// Webpack module 81198
// Parameters: t (module), b (exports), a (require)

class d {
    constructor(e) {
    this.data = e;
    this.right = this.left = null;
    this.red = true;
}
    xj(e) {
    return e ? this.right : this.left;
}
    px(e, h) {
    e ? this.right = h : this.left = h;
}
}
class p {
    constructor(e) {
    this.Qg = null;
    this.hA = e;
    this.size = 0;
}
    Qu(e) {
    var h, k, l, m, n, q, r, u;
    if (null === this.Qg)
        (this.Qg = new d(e),
        this.size++);
    else {
        h = new d(undefined);
        k = 0;
        l = 0;
        m = null;
        n = h;
        q = null;
        r = this.Qg;
        for (n.right = this.Qg; ; ) {
            null === r ? (r = new d(e),
            q.px(k, r),
            this.size++) : c(r.left) && c(r.right) && (r.red = true,
            r.left.red = false,
            r.right.red = false);
            if (c(r) && c(q)) {
                u = n.right === m;
                r === q.xj(l) ? n.px(u, g(m, !l)) : n.px(u, f(m, !l));
            }
            u = this.hA(r.data, e);
            if (0 === u)
                break;
            l = k;
            k = 0 > u;
            null !== m && (n = m);
            m = q;
            q = r;
            r = r.xj(k);
        }
        this.Qg = h.right;
    }
    this.Qg.red = false;
}
    remove(e) {
    var h, k, r, u, v;
    if (null === this.Qg)
        return false;
    h = new d(undefined);
    k = h;
    k.right = this.Qg;
    for (var l = null, m, n = null, q = 1; null !== k.xj(q); ) {
        r = q;
        m = l;
        l = k;
        k = k.xj(q);
        u = this.hA(e, k.data);
        q = 0 < u;
        0 === u && (n = k);
        if (!c(k) && !c(k.xj(q)))
            if (c(k.xj(!q)))
                (m = g(k, q),
                l.px(r, m),
                l = m);
            else if (!c(k.xj(!q)) && (u = l.xj(!r),
            null !== u))
                if (c(u.xj(!r)) || c(u.xj(r))) {
                    v = m.right === l;
                    c(u.xj(r)) ? m.px(v, f(l, r)) : c(u.xj(!r)) && m.px(v, g(l, r));
                    r = m.xj(v);
                    r.red = true;
                    k.red = true;
                    r.left.red = false;
                    r.right.red = false;
                } else
                    (l.red = false,
                    u.red = true,
                    k.red = true);
    }
    null !== n && (n.data = k.data,
    l.px(l.right === k, k.xj(null === k.left)),
    this.size--);
    this.Qg = h.right;
    null !== this.Qg && (this.Qg.red = false);
    return null !== n;
}
}
function c(e) {
    return null !== e && e.red;
}
function g(e, h) {
    var k;
    k = e.xj(!h);
    e.px(!h, k.xj(h));
    k.px(h, e);
    e.red = true;
    k.red = false;
    return k;
}
function f(e, h) {
    e.px(!h, g(e.xj(!h), !h));
    return g(e, h);
}
b = a(61161);
p.prototype = new b();
t.exports = p;

