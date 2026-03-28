/**
 * Netflix Cadmium Playercore - Module 72869
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Dhb
 * Dependencies: 22970, 48170, 51044, 66164, 72697, 94451
 * Purpose: Logging, ABR/Quality selection, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_51044 from './Module_51044.js';
// import dep_66164 from './Module_66164.js';
// import dep_72697 from './Module_72697.js';
// import dep_94451 from './Module_94451.js';

// Webpack module 72869
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k) {
    k = k.length + 1;
    for (var l = Array(k), m = 0; m < k; m++) {
        l[m] = Array(k);
        for (var n = 0; n < k; n++)
            l[m][n] = 0;
    }
    return l;
}

p = a(22970);
t = a(66164);
c = a(72697);
g = a(94451);
f = a(51044);
e = a(48170);
h = new t.platform.Console("ASEJS_NETWORK_ENTROPY","media|asejs");
a = (function(k) {
    class l extends k {
    constructor(m) {
        var n;
        n = k.call(this, m.sw, m.mw) || this;
        n.MC = m.sw;
        n.rj = m.mw;
        n.m$ = {
            uhd: (0,
            f.writable)(m.uhdl),
            hd: (0,
            f.writable)(m.hdl)
        };
        n.window = Math.max(Math.ceil(1 * n.MC / n.rj), 1);
        n.JJc = m.mins || 1;
        n.reset();
        return n;
    }
    flush() {
        var m;
        m = this;
        this.ph.map(function(n, q) {
            m.crb(n, m.NUa(q));
        });
    }
    lfc() {
        var m, n, q, r, u, v, w, z;
        m = this.m$;
        for (n in m) {
            e.u && h.trace(("Calculating Network Entropy based on ").concat(n, " bitrate ladder (").concat(JSON.stringify(m[n]), ")"));
            q = m[n];
            r = this.IVb[n];
            u = this.GVb[n];
            if (r.first) {
                v = r.first;
                w = r.jz;
                undefined !== w && (u[v][w] += 1);
                r.first = undefined;
            }
            e.u && h.trace(("Transition Matrix: ").concat(this.qpc(u)));
            r = [];
            v = q = q.length + 1;
            for (var x = w = 0; x < v; x++) {
                for (var y = 0, A = 0; A < q; A++)
                    y += u[A][x];
                w += y;
                r.push(y);
            }
            e.u && h.trace(("steadyStateVector: ").concat(JSON.stringify(r)));
            y = -1;
            if (w > this.JJc) {
                for (x = y = 0; x < v; x++)
                    if (0 < r[x])
                        for (A = 0; A < q; A++) {
                            z = u[A][x];
                            0 < z && (y -= z * Math.log(1 * z / r[x]));
                        }
                y /= w * Math.log(2);
            }
            e.u && h.trace(("entropy: ").concat(y));
            this.Xyb[n] = y;
        }
        return this.Xyb;
    }
    crb(m, n) {
        var u, v, w;
        for (var q = this.window, r = this.m$; this.Fqa.length >= q; )
            this.Fqa.shift();
        for (; this.Gqa.length >= q; )
            this.Gqa.shift();
        this.Fqa.push(m);
        this.Gqa.push(n);
        m = (0,
        g.U6a)(this.Fqa);
        n = (0,
        g.U6a)(this.Gqa);
        if (0 < n)
            for (n in (m = 8 * m / n,
            e.u && h.trace(("Adding sliding window throughput into Transition Matrix: ").concat(m)),
            n = undefined,
            r)) {
                q = this.IVb[n];
                u = this.GVb[n];
                v = this.iSc(m, r[n]);
                w = q.jz;
                undefined !== w ? u[v][w] += 1 : q.first = v;
                q.jz = v;
            }
    }
    iSc(m, n) {
        for (var q = 0; q < n.length && m > n[q]; )
            q += 1;
        return q;
    }
    shift() {
        this.crb(this.ph[0], this.NUa(0));
        k.prototype.shift.call(this);
    }
    reset() {
        this.Fqa = [];
        this.Gqa = [];
        undefined !== this.m$ && (this.Xyb = {
            hd: 0,
            uhd: 0
        },
        this.IVb = {
            hd: {
                first: undefined,
                jz: undefined
            },
            uhd: {
                first: undefined,
                jz: undefined
            }
        },
        this.GVb = {
            hd: d(this.m$.hd),
            uhd: d(this.m$.uhd)
        },
        k.prototype.reset.call(this));
    }
    qpc(m) {
        for (var n = "", q = m.length, r = 0; r < q; r++) {
            for (var u = 0; u < q; u++)
                n += " " + m[r][u];
            n += "\n";
        }
        return n;
    }
}
p.return l;
}
)(c.j6);
export const Dhb = a;

// Detected exports: Dhb
