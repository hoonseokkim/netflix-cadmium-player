/**
 * Netflix Cadmium Playercore - Module 56445
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: znb
 * Dependencies: 22970, 25337, 32296, 89931, 93334
 * Purpose: Buffer/Segment management, Configuration, UI components, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_25337 from './Module_25337.js';
// import dep_32296 from './Module_32296.js';
// import dep_89931 from './Module_89931.js';
// import dep_93334 from './Module_93334.js';

// Webpack module 56445
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(93334);
c = a(89931);
g = a(32296);
t = a(25337);
f = (function() {
    function e(h) {
        h ? (this.Dt = h.Dt.slice(),
        this.Oz = h.Oz.slice(),
        this.Rf = h.Rf.slice(),
        this.trim = h.trim) : (this.Dt = [],
        this.Oz = [],
        this.Rf = []);
    }
    Object.defineProperties(e.prototype, {
        empty: {
            get: function() {
                return 0 === this.Dt.length && 0 === this.Oz.length && 0 === this.Rf.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
t = (function(e) {
    class h extends e {
    constructor(k, l, m) {
        k = e.call(this, k, l, m) || this;
        k.oyb = [];
        k.Bf = new f();
        return k;
    }
    rW(k, l) {
        this.Bf.Oz.push({
            offset: undefined !== l ? l : this.offset,
            value: k,
            size: 2,
            nha: false
        });
        undefined === l && (this.offset += 2);
    }
    fo(k, l) {
        this.Bf.Oz.push({
            offset: undefined !== l ? l : this.offset,
            value: k,
            size: 4,
            nha: false
        });
        undefined === l && (this.offset += 4);
    }
    jYb(k, l) {
        this.Bf.Oz.push({
            offset: undefined !== l ? l : this.offset,
            value: k,
            size: 8,
            nha: false
        });
        undefined === l && (this.offset += 8);
    }
    a9a(k) {
        this.fo((0,
        g.jMa)(k));
    }
    d9a(k, l) {
        this.Bf.Rf.push({
            offset: this.offset,
            zs: k,
            value: l
        });
        this.offset += 4;
    }
    xr(k, l, m) {
        this.Bf.Dt.push({
            offset: l,
            remove: k,
            Fb: m
        });
    }
    Yya(k, l, m, n) {
        this.Bf.Dt.push({
            offset: m,
            remove: k,
            replace: l,
            Fb: n
        });
    }
    trim(k) {
        this.Bf.trim = k;
    }
    eSc() {
        this.oyb.push(new f(this.Bf));
    }
    TPc() {
        this.Bf = this.oyb.pop() || new f();
    }
    pa() {
        var k, l, m, n, q, r, u;
        k = this;
        if (0 === this.Bf.Dt.length && 0 === this.Bf.Oz.length && 0 === this.Bf.Rf.length)
            return {
                Na: [undefined === this.Bf.trim ? this.view.buffer : this.view.buffer.slice(0, this.Bf.trim)]
            };
        this.Bf.Dt.sort(function(v, w) {
            return v.offset - w.offset;
        });
        this.Bf.Oz.sort(function(v, w) {
            return v.offset - w.offset;
        });
        this.ZUc();
        l = this.ktc();
        m = this.view.buffer.slice(0, l);
        n = l ? new DataView(m) : this.view;
        this.Bf.Oz.forEach(h.occ.bind(undefined, n));
        this.P2c(n);
        this.O2c(n);
        q = [];
        r = undefined !== this.Bf.trim ? Math.min(this.Bf.trim, this.view.byteLength) : this.view.byteLength;
        u = 0;
        this.Bf.Dt.filter(function(v) {
            return v.offset <= r;
        }).forEach(function(v) {
            v.offset > u && (q.push(n.buffer.slice(u, v.offset)),
            v.offset > n.byteLength && n !== k.view && (n = k.view,
            q.push(n.buffer.slice(l, v.offset))));
            v.replace && q.push(v.replace);
            u = v.offset + v.remove;
        });
        u < l && q.push(m.slice(u));
        u < r && (m = Math.max(m.byteLength, u),
        m < r && q.push(this.view.buffer.slice(m, r)));
        m = this.Bf.Dt.filter(function(v) {
            return v.offset + v.remove > r;
        }).map(function(v) {
            var w;
            w = v.offset;
            v = v.remove;
            return w < r ? {
                offset: r,
                remove: v - (r - w)
            } : {
                offset: w,
                remove: v
            };
        });
        return {
            Na: q,
            QL: m
        };
    }
    ktc() {
        var k, l, m;
        k = [];
        l = this.Bf.Oz[this.Bf.Oz.length - 1];
        m = this.Bf.Rf[this.Bf.Rf.length - 1];
        l && k.push(l.offset + l.size);
        m && k.push(m.offset + 4);
        this.Bf.Dt.filter(function(n) {
            return n.Fb;
        }).forEach(function(n) {
            return k.push(n.Fb.byteOffset + 4);
        });
        if (0 === k.length)
            return 0;
        l = Math.max.apply(undefined, k);
        return undefined !== this.Bf.trim ? Math.min(l, this.Bf.trim) : l;
    }
    ZUc() {
        this.Bf.Dt = this.Bf.Dt.reduce(function(k, l) {
            var m, n;
            if (0 === k.length)
                return (k.push(l),
                k);
            m = k[k.length - 1];
            n = m.offset + m.remove;
            l.offset >= n ? k.push(l) : l.offset + l.remove > n && ((0,
            p.assert)(m.Fb === l.Fb),
            m.remove += l.offset + l.remove - n,
            l.replace && (m.replace = m.replace ? (0,
            c.concat)(m.replace, l.replace) : l.replace));
            return k;
        }, []);
    }
    P2c(k) {
        var l;
        l = this;
        this.Bf.Rf.forEach(function(m) {
            var n, q, r, u;
            n = k;
            q = m.offset;
            l.Bf.Dt.some(function(v) {
                return v.offset <= m.offset && v.replace && v.offset + v.replace.byteLength >= m.offset + 4 ? (n = new DataView(v.replace),
                q = m.offset - v.offset,
                true) : false;
            });
            r = m.zs + (undefined !== m.value ? m.value : n.getInt32(q));
            u = l.Bf.Dt.reduce(function(v, w) {
                return w.offset > m.zs && w.offset < r ? v + (w.remove - (w.replace ? w.replace.byteLength : 0)) : v;
            }, 0);
            n.setInt32(q, r - m.zs - u);
        });
    }
    O2c(k) {
        this.Bf.Dt.forEach(function(l) {
            var m;
            m = (l.remove || 0) - (l.replace ? l.replace.byteLength : 0);
            if (0 !== m)
                for (l = l.Fb; l; )
                    (k.setUint32(l.byteOffset, k.getUint32(l.byteOffset) - m),
                    l = l.parent);
        });
    }
}
d.h.occ = function(k, l) {
        if (l.offset + l.size <= k.byteLength)
            switch (l.size) {
            case 1:
                k.setUint8(l.offset, l.value);
                break;
            case 2:
                l.nha ? k.setInt16(l.offset, l.value) : k.setUint16(l.offset, l.value);
                break;
            case 4:
                l.nha ? k.setInt32(l.offset, l.value) : k.setUint32(l.offset, l.value);
                break;
            case 8:
                (0,
                p.assert)(!l.nha);
                k.setUint32(l.offset, Math.floor(l.value / 4294967296));
                k.setUint32(l.offset + 4, l.value & 4294967295);
                break;
            default:
                (0,
                p.assert)(false);
            }
    }
    ;
    Object.defineProperties(h.prototype, {
        Nqa: {
            get: function() {
                return !this.Bf.empty;
            },
            enumerable: false,
            configurable: true
        }
    });
    h.prototype.$h = function(k, l) {
        this.Bf.Oz.push({
            offset: undefined !== l ? l : this.offset,
            value: k,
            size: 1
        });
        undefined === l && (this.offset += 1);
    }
    ;
    return h;
}
)(t.uma);
export const znb = t;

// Detected exports: znb
