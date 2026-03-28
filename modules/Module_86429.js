/**
 * Netflix Cadmium Playercore - Module 86429
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: mkb, utb
 * Dependencies: 52571, 59458, 66164, 72681
 * Purpose: Logging, Configuration, Parsing/Serialization, Error handling
 */

// import dep_52571 from './Module_52571.js';
// import dep_59458 from './Module_59458.js';
// import dep_66164 from './Module_66164.js';
// import dep_72681 from './Module_72681.js';

// Webpack module 86429
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(66164);
p = a(52571);
c = a(59458);
g = a(72681);
new d.platform.Console("ASEJS_PROBE_MANAGER","asejs");
t = (function() {
    class f {
    constructor(e, h, k) {
        this.gj = e;
        this.hM = h;
        this.config = k;
        this.ao = new Set();
        this.TA = {};
        this.NN = {};
        this.qV = true;
        this.groupId = 1;
    }
    mRc(e, h) {
        var k, l, m, n, q, r, u, v, w, x;
        k = this;
        l = this.config;
        m = e.md;
        n = e.stream;
        q = e.Hb.location;
        (0,
        p.assert)(n, "Failing url should have an associated stream");
        (0,
        p.assert)(q, "Failing url should have an associated location");
        r = [];
        u = n.gk[0];
        v = false;
        w = this.TA[m];
        x = d.platform.time.fa();
        if (!w)
            w = this.nYc(m, x, h, e);
        else if (w.Ud >= x - l.Rha)
            return;
        w.eJ || (u && q.id === u.id && (e.isPrimary = true),
        w.Ud = x,
        w.eJ = false,
        w.error = h,
        ++w.count,
        n && n.urls && 0 !== n.urls.length && (n.urls.forEach(function(y) {
            var A, z, B, C, D;
            B = y.Hb.id;
            C = B + "-" + m;
            D = k.NN[C];
            if (undefined === D || undefined === D.Hfa)
                (D && D.Hr && clearTimeout(D.Hr),
                y = null === (z = null === (A = e.stream) || undefined === A ? undefined : A.aZ) || undefined === z ? undefined : z.I0(e.M, y.url),
                (0,
                p.assert)(y, ("Unexpected probeUrl: ").concat(y)),
                A = k.FRa(y, e, B),
                k.NN[C] = {
                    success: false,
                    count: 0,
                    Hfa: A.pg()
                },
                r.push(A.pg()),
                v = true);
            -1 === w.t5a.indexOf(B) && w.t5a.push(B);
        }),
        0 < r.length && (l = {
            ts: d.platform.time.fa(),
            es: h.rrb,
            fc: h.Zg,
            fn: h.Ezb,
            nc: h.dh,
            pb: r,
            gid: this.groupId
        },
        h.Mk && (l.hc = h.Mk),
        this.rT(l, "errpb")),
        v && this.groupId++));
    }
    FRa(e, h, k) {
        var l, m;
        l = new g.r$a(this);
        m = "random=" + parseInt(("").concat(1E7 * Math.random()));
        l.tNc(e + (-1 !== e.indexOf("?") ? "&" : "?") + m, h, k);
        return l;
    }
    nYc(e, h, k, l) {
        var m;
        m = this.TA[e];
        l = l.Hb.location;
        m || (m = this.TA[e] = {
            count: 0,
            Ud: h,
            eJ: false,
            error: k,
            t5a: [],
            d3a: {},
            location: l,
            M: k.M,
            Med: k
        });
        return m;
    }
    getState(e) {
        return this.TA[e];
    }
    Mhc(e) {
        this.TA[e] = undefined;
    }
    rT(e, h) {
        var k;
        if (this.qV) {
            k = {
                type: "logdata",
                target: "endplay",
                fields: {}
            };
            k.fields[h] = {
                type: "array",
                value: e,
                adjust: ["ts"]
            };
            this.gj.K0a(k);
        }
    }
    nRc(e, h) {
        var k, l, m, n, q, r, u, v, w, x, y, A, z;
        k = this;
        n = this.gj;
        q = this.config;
        r = h.md;
        if (h.AOb)
            n.w4a(e.md, false);
        else {
            u = this.TA[r];
            if (u) {
                v = e.url;
                w = this.NN[e.md + "-" + r];
                if (w) {
                    x = u.error;
                    w && w.Hr && clearTimeout(w.Hr);
                    w.success = true;
                    w.count = 0;
                    w.Hfa = undefined;
                    u.d3a[e.md] = true;
                    w = this.TA[e.md];
                    if ((null === w || undefined === w ? 0 : w.eJ) && q.QQ) {
                        n.w4a(e.md, w.error.oia[1]);
                        if (this.qV) {
                            y = {
                                ts: d.platform.time.fa(),
                                id: e.requestId,
                                servid: h.md,
                                gid: e.groupId ? e.groupId : -1
                            };
                            this.rT(y, "errst");
                        }
                        this.TA[e.md] = undefined;
                        this.hM();
                    }
                    if (v !== h.url) {
                        A = this.NN[r + "-" + r];
                        if (!A || !A.success) {
                            r = null === w || undefined === w ? undefined : w.location;
                            q = Math.min((null === (m = null === (l = null === r || undefined === r ? undefined : r.Db) || undefined === l ? undefined : l.Cl) || undefined === m ? undefined : m.Fa) || Math.random() * q.S1, q.S1);
                            z = setTimeout(function() {
                                var B;
                                k.ao.delete(z);
                                if (!(false !== u.eJ || A && A.success) && (u.eJ = true,
                                n.dJ(x.oia[0], x.oia[1], h.stream.aZ.url, x),
                                k.qV)) {
                                    B = {
                                        ts: d.platform.time.fa(),
                                        id: e.requestId,
                                        servid: h.md,
                                        gid: e.groupId ? e.groupId : -1
                                    };
                                    k.rT(B, "erep");
                                }
                            }, q);
                            this.ao.add(z);
                        }
                    }
                    this.qV && (y = {
                        ts: d.platform.time.fa(),
                        id: e.requestId,
                        result: 1,
                        servid: e.md,
                        gid: e.groupId ? e.groupId : -1
                    },
                    this.rT(y, "pbres"));
                }
            }
        }
    }
    kRc(e, h) {
        var k, l, m, n, q, r, u, v, w, x, y, A, z;
        k = this;
        if (!h.AOb) {
            n = this.gj;
            q = this.config;
            r = h.md;
            u = this.TA[r];
            v = e.md;
            w = this.NN[v + "-" + r];
            if (w)
                if (u) {
                    x = 0;
                    w.success = false;
                    w.Hfa = undefined;
                    u.d3a[v] = false;
                    y = u.t5a;
                    if (q.QQ && v === r && h.isPrimary) {
                        A = u.location;
                        A = (null === (m = null === (l = null === A || undefined === A ? undefined : A.Db) || undefined === l ? undefined : l.Cl) || undefined === m ? undefined : m.Fa) || 300 * Math.random();
                        l = (0,
                        b.utb)({
                            Mdc: A,
                            jRc: w.count,
                            EJc: q.Bea
                        });
                        w.Hr = setTimeout(function() {
                            var B;
                            w.Hr = undefined;
                            B = k.FRa(e.url, h, v);
                            B.vXc(e.groupId);
                            w.Hfa = B.pg();
                        }, l);
                    }
                    ++w.count;
                    if (v === r && (x = 0,
                    y.forEach(function(B) {
                        false === u.d3a[B] && x++;
                    }),
                    y.length === x && u.count >= q.oea)) {
                        z = u.error;
                        u.eJ = true;
                        q = h.stream;
                        (0,
                        p.assert)(q, "Probe failed url should have an associated stream");
                        q.urls.forEach(function(B) {
                            n.dJ(z.oia[0], z.oia[1], B.url, z);
                            k.qV && (B = {
                                ts: d.platform.time.fa(),
                                id: -1,
                                servid: B.Hb.id
                            },
                            k.rT(B, "erep"));
                        });
                    }
                    this.qV && (q = {
                        ts: d.platform.time.fa(),
                        id: e.requestId,
                        result: 0,
                        servid: e.md,
                        gid: e.groupId ? e.groupId : -1
                    },
                    this.rT(q, "pbres"));
                } else
                    w && (w.success = false,
                    w.Hfa = undefined);
        }
    }
    LO(e) {
        var h, k, l;
        if (e.url) {
            k = this.gj;
            l = k.p5a(e.url);
            l || (l = null === (h = this.gj.Ksa(e.stream)[0]) || undefined === h ? undefined : h.id);
            l && (e = this.TA[l]) && e.eJ && this.config.QQ && (k.w4a(e.error.rrb, false),
            this.qV && (k = {
                ts: d.platform.time.fa(),
                id: -1,
                servid: l
            },
            this.rT(k, "errst")),
            this.Mhc(l),
            (l = this.NN[l + "-" + l]) && l.Hr && clearTimeout(l.Hr));
        }
    }
    reset() {
        var e, h, k;
        e = this.NN;
        for (k in e)
            e.hasOwnProperty(k) && (h = e[k + "-" + k]) && h.Hr && clearTimeout(h.Hr);
        this.ao.forEach(function(l) {
            return clearTimeout(l);
        });
        this.ao.clear();
        this.NN = {};
        this.TA = {};
    }
}
return f;
}
)();
export const mkb = t;
export function utb(f) {
    var e, h;
    e = f.Fid;
    h = f.zhd;
    h = undefined === h ? .1 : h;
    f = Math.min(Math.max(f.EJc, f.Mdc * Math.pow(2, f.jRc)), undefined === e ? 12E4 : e);
    e = (0,
    c.ePb)(0, f * h);
    return f + e;
}
;

// Detected exports: mkb, utb
