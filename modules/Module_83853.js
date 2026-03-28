/**
 * Netflix Cadmium Playercore - Module 83853
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: NZb
 * Dependencies: 22970, 25078, 53389
 * Purpose: Timing/Scheduling, Error handling, UI components, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_25078 from './Module_25078.js';
// import dep_53389 from './Module_53389.js';

// Webpack module 83853
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
t = a(53389);
p = a(25078);
c = d.__importDefault(a(48795));
g = d.__importDefault(a(79804));
a = (function(f) {
    class e extends f {
    constructor(h) {
        var k;
        k = f.call(this) || this;
        k.au = h;
        k.Tb = null;
        k.mo = 0;
        k.Rv = -1;
        k.Xl = false;
        return k;
    }
    abort() {
        this.au.abort();
    }
    close(h, k) {
        this.Xl = true;
        this.au.close(h, k);
    }
    mark(h) {
        var k;
        if (!this.Tb)
            (this.Tb = new p.wja(),
            this.mo = 0);
        else if (0 < this.mo) {
            k = this.Tb.T4();
            this.Tb = new p.wja();
            this.Tb.write(k, this.mo, k.length - this.mo, -1, {
                result: function() {},
                error: function() {}
            });
            this.mo = 0;
        }
        this.Rv = h;
    }
    reset() {
        if (!this.Tb)
            throw new c.default("Cannot reset before input stream has been marked or if mark has been invalidated.");
        this.mo = 0;
    }
    read(h, k, l) {
        var n;
        function m(q, r) {
            var u;
            if (!r)
                return q;
            n.Tb && (-1 != n.Rv && n.Tb.size() + r.length > n.Rv ? (n.Tb = null,
            n.mo = 0,
            n.Rv = -1) : (n.Tb.write(r, 0, r.length, -1, {
                result: function() {},
                error: function() {}
            }),
            n.mo += r.length));
            if (!q)
                return r;
            u = new Uint8Array(q.length + r.length);
            u.set(q);
            u.set(r, q.length);
            return u;
        }
        n = this;
        g.default(l, function() {
            var q, r;
            if (n.Xl)
                throw new c.default("Stream is already closed.");
            if (n.Tb && n.Tb.size() > n.mo) {
                q = undefined;
                q = -1 == h ? n.Tb.size() : Math.min(n.Tb.size(), n.mo + h);
                r = n.Tb.T4().subarray(n.mo, q);
                n.mo += r.length;
                if (r.length >= h)
                    return r;
            } else
                r = null;
            q = -1;
            -1 != h && (q = h - (r ? r.length : 0));
            n.au.read(q, k, {
                result: function(u) {
                    g.default(l, function() {
                        return m(r, u);
                    });
                },
                timeout: function(u) {
                    g.default(l, function() {
                        var v;
                        v = m(r, u);
                        l.timeout(v);
                    });
                },
                error: l.error
            });
        });
    }
    skip(h, k, l) {
        var m;
        m = this;
        g.default(l, function() {
            var n;
            if (m.Xl)
                throw new c.default("Stream is already closed.");
            n = 0;
            if (m.Tb && m.Tb.size() > m.mo && (n = Math.min(h, m.Tb.size() - m.mo),
            m.mo += n,
            n == h))
                return n;
            m.read(h - n, k, {
                result: function(q) {
                    g.default(l, function() {
                        return q ? q.length + n : n;
                    });
                },
                timeout: function(q) {
                    g.default(l, function() {
                        return q ? q.length + n : n;
                    });
                },
                error: l.error
            });
        });
    }
}
d.return e;
}
)(t.Cka);
export const NZb = a;

// Detected exports: NZb
