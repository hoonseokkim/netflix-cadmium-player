/**
 * Netflix Cadmium Playercore - Module 42193
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: ncb
 * Dependencies: 18690, 22970, 26388, 67895, 68902, 87231
 * Purpose: Manifest handling, Logging, Configuration, Error handling
 */

// import dep_18690 from './Module_18690.js';
// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_67895 from './Module_67895.js';
// import dep_68902 from './Module_68902.js';
// import dep_87231 from './Module_87231.js';

// Webpack module 42193
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

d = a(22970);
p = a(26388);
c = a(18690);
g = a(68902);
f = a(87231);
e = a(67895);
t = (function() {
    class h {
    constructor(k, l, m, n, q, r) {
        this.console = l;
        this.config = q;
        this.ot = r;
        this.WSa = false;
        this.FH = new g.tcb(k);
        k = this.klc(m, n);
        m = this.jmc();
        0 < k[p.l.V].length && 0 < k[p.l.U].length && 0 < m[p.l.V].length && 0 < m[p.l.U].length ? (l.warn("EllaAlgorithms: initializing"),
        this.YSa = c.qcb.Ykc(k, this.FH, q),
        this.NR = e.ucb.imc(l, m, q),
        this.WSa = true) : l.warn("EllaAlgorithms: not initializing, incomplete manifest information");
    }
    klc(k, l) {
        var m;
        m = {
            0: [],
            1: [],
            2: [],
            3: []
        };
        m[p.l.V] = this.Gvb(k, p.l.V);
        m[p.l.U] = this.Gvb(l, p.l.U);
        return m;
    }
    Gvb(k, l) {
        var m, n, q, r, w;
        if (undefined === k)
            return [];
        r = [];
        if (this.config.TNc && k.R === String(this.config.Spc)) {
            this.console.trace("EllaAlgorithms: creating ella streams from override config for", l);
            try {
                for (var u = d.__values(k.Xd), v = u.next(); !v.done; v = u.next()) {
                    w = v.value;
                    r.push(new f.KEa(w.Oa,w.bitrate,this.bmc(w)));
                }
            } catch (B) {
                var x;
                x = {
                    error: B
                };
            } finally {
                try {
                    v && !v.done && (m = u.return) && m.call(u);
                } finally {
                    if (x)
                        throw x.error;
                }
            }
        } else {
            this.console.trace("EllaAlgorithms: creating ella streams from manifest for", l);
            try {
                for (var y = d.__values(k.Xd), A = y.next(); !A.done; A = y.next())
                    (w = A.value,
                    (null === (q = w.vT) || undefined === q ? 0 : q.Pqa) && r.push(new f.KEa(w.Oa,w.bitrate,w.vT.Pqa)));
            } catch (B) {
                var z;
                z = {
                    error: B
                };
            } finally {
                try {
                    A && !A.done && (n = y.return) && n.call(y);
                } finally {
                    if (z)
                        throw z.error;
                }
            }
        }
        return r;
    }
    bmc(k) {
        var l, m, n, q;
        l = [];
        m = this.config.Ipc;
        n = this.config.Npc;
        q = this.console;
        this.config.$pc.forEach(function(r) {
            var u;
            r = Number((1 / r).toFixed(2));
            u = m + ("/").concat(k.Oa, "?dutyCycle=").concat(r, "&fec=").concat(n);
            l.push({
                ec: u,
                TSa: r,
                ara: k.bitrate,
                Jzb: n,
                ivb: true
            });
            q.trace("bitrate: " + k.bitrate + ", channel name: " + u);
        });
        return l;
    }
    jmc() {
        var k, l;
        k = {
            0: [],
            1: [],
            2: [],
            3: []
        };
        if (this.config.BMb) {
            l = this.config.syb;
            k[p.l.V] = l.map(function(m) {
                return Number(m.id);
            });
            k[p.l.U] = l.map(function(m) {
                return Number(m.id);
            });
            this.console.trace("EllaAlgorithms: using override relay servers, ids:", k[p.l.V]);
        } else
            (l = (this.ot || []).map(function(m) {
                return Number(m.id);
            }),
            k[p.l.V] = l,
            k[p.l.U] = l,
            this.console.trace("EllaAlgorithms: using manifest relay servers, ids:", l));
        return k;
    }
}
return h;
}
)();
export const ncb = t;

// Detected exports: ncb
