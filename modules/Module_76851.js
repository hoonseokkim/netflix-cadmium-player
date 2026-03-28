/**
 * Netflix Cadmium Playercore - Module 76851
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ihb
 * Dependencies: 4574, 18797, 22699, 22970, 51665, 74528, 76495, 97115
 * Purpose: Subtitles/Captions, Buffer/Segment management, Logging, Event handling
 */

// import dep_4574 from './Module_4574.js';
// import dep_18797 from './Module_18797.js';
// import dep_22699 from './Module_22699.js';
// import dep_22970 from './Module_22970.js';
// import dep_51665 from './Module_51665.js';
// import dep_74528 from './Module_74528.js';
// import dep_76495 from './Module_76495.js';
// import dep_97115 from './Module_97115.js';

// Webpack module 76851
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k;

d = a(22970);
t = a(22699);
p = a(18797);
c = a(76495);
g = a(51665);
f = a(4574);
e = a(97115);
h = a(74528);
k = t.EventEmitter;
a = (function(l) {
    class m extends l {
    constructor(n, q) {
        var r, u, v;
        undefined === q && (q = c.u7.Ea);
        r = l.call(this) || this;
        u = n.yd;
        v = n.va;
        k.call(r);
        r.YG = new f.CGa(v);
        r.$l = "number" === typeof u ? n.yd : 0;
        r.ya = "object" === typeof v ? n.va : console;
        r.Tb = [];
        r.ol = 0;
        r.oo = r.$l;
        r.wf = null;
        r.ql = false;
        r.ns = false;
        r.cQ = n.Pfa || 0;
        r.Pe = new e.Hhb(r.ya);
        r.FQ = n.M6a;
        r.Lpb = q;
        if (q === c.u7.Ea)
            r.GNa = new h.wlb(r.ya,r.FQ);
        else
            throw Error("Not implemented yet");
        r.ya.trace("LiveTextStream created with options", n);
        return r;
    }
    start() {
        this.ya.info(("Incremental live text stream created, starting at pts ").concat(this.$l));
        "undefined" !== typeof this.Pe.ES(this.$l) && this.gU.call(this, this.$l);
    }
    w3a(n) {
        var q, r, u, v;
        q = this;
        r = n.xml;
        u = r.indexOf("<p");
        if (this.Lpb === c.u7.Ea)
            v = new g.Rfb(n,-1 !== u ? u : 0);
        else
            throw Error("Not yet implemented");
        this.Pe.zOa(v);
        this.ql || (n = this.Pe.Ch[0],
        this.Pe.ria(n),
        this.$l = n.Nb);
        -1 < u ? (this.YG.Vqb(r, v.M, v.iz),
        this.ya.trace(("Live segment ").concat(v.M, " is pushed to segment manager"), {
            Nb: v.Nb,
            Xg: v.Xg,
            Loc: v.iz
        }),
        !this.ql && 4 > this.ol && (r = 0 < this.Tb.length ? this.Tb[this.Tb.length - 1].startTime + 1 : this.$l,
        this.ya.trace("parseNextSegment is called from push new live Segment at " + r),
        this.gU.call(this, r))) : (this.ya.trace(("Live segment ").concat(v.M, " is pushed to segment manager, it is an empty segment")),
        this.ql || setTimeout(function() {
            q.KC(v.M);
        }, 10));
    }
    ZL(n) {
        var q, r, u, v, w, x;
        q = this;
        v = this;
        v.ya.trace(("LiveTextStream:get subtitles at pts ").concat(n));
        w = v.Pe.ES(n);
        if ("undefined" === typeof w)
            return (v.ya.debug(("LiveTextStream: get subtitle at pts ").concat(n, " returns empty result with segment not available at this pts")),
            []);
        v.Pe.ria(w);
        n < v.oo - v.cQ ? (v.ya.trace(("Pts is less than backup tolerance, resetting buffer. pts: ").concat(n), (", _lastPts: ").concat(v.oo, ", _backupTolerance: ").concat(v.cQ)),
        v.Tb = [],
        v.ol = 0) : (v.ol = 0 < v.Tb.length ? Math.max(v.Pe.aca() - w.M + 1, 0) : 0,
        0 === v.ol && (v.Tb = []));
        w = v.Tb;
        v.ya.trace(("LiveTextStream: lastBufferedPts calculation ").concat(n), (", buffer.length: ").concat(w.length, ", result: ").concat(0 < w.length ? null === (r = w[w.length - 1]) || undefined === r ? undefined : r.startTime : n));
        r = this.Pe.Ov;
        x = 0 < w.length && undefined !== r ? r.Nb : n;
        v.oo = n;
        v.ya.info("LiveTextStream: timer is " + v.wf + " bufffered segment number is " + v.ol + " is parsing entry : " + this.ns + " maxBufferedStartPts " + (null === (u = this.Pe.Ov) || undefined === u ? undefined : u.Nb));
        for (!v.wf && 4 > v.ol && !v.ns && (v.ya.info("LiveTextStream: buffer size: " + v.ol + "; minimum: 4"),
        v.ns = true,
        v.wf = setTimeout(function() {
            v.wf = null;
            q.ya.trace("parseNextSegment is called from getCurrentAndNextSubtitle at " + (x + 1));
            q.gU.call(v, x + 1);
        }, 10)); 0 < w.length && w[0].endTime < n; )
            w.shift();
        return this.GNa.psa(w, n).map(function(y) {
            var A;
            A = v.Pe.yVa(y.segId);
            return q.GNa.tqa(A, y);
        });
    }
    Zq(n, q) {
        return this.YG ? this.YG.Zq(n, q) : 0;
    }
    close() {}
    gU(n) {
        d.__awaiter(this, undefined, undefined, function() {
            var q, r;
            return d.__generator(this, function(u) {
                switch (u.label) {
                case 0:
                    q = this;
                    r = this.$Va.call(q, n);
                    if ("undefined" === typeof r)
                        return [3, 4];
                    q.ya.trace("Next segment to parse at pts " + n + " is segment " + r.M);
                    if (0 !== r.NS)
                        return [3, 1];
                    q.ya.trace("This is an empty segment");
                    this.KC(r.M);
                    return [3, 3];
                case 1:
                    return [4, this.a2a.call(q, r)];
                case 2:
                    (u.T(),
                    q.ya.trace("parseNextSegEntries buffer length: " + q.Tb.length),
                    u.label = 3);
                case 3:
                    return [3, 5];
                case 4:
                    return (q.ya.debug("Next segment is undefined at pts " + n),
                    this.ns = false,
                    [2]);
                case 5:
                    return [2];
                }
            });
        });
    }
    a2a(n) {
        return d.__awaiter(this, undefined, undefined, function() {
            var q, r, u, v, w, x, y, A, z;
            return d.__generator(this, function(B) {
                switch (B.label) {
                case 0:
                    (q = this,
                    r = n.xml.slice(0, n.NS),
                    B.label = 1);
                case 1:
                    return (B.ac.push([1, 3, , 4]),
                    [4, this.qOc(r)]);
                case 2:
                    return (u = B.T(),
                    [3, 4]);
                case 3:
                    return (v = B.T(),
                    this.bTa(v),
                    [3, 4]);
                case 4:
                    if (!u)
                        return (w = Error("Parsing header text returned undefined"),
                        this.bTa(w),
                        [2]);
                    if (u.error)
                        return (x = u.error,
                        x.EEb = r,
                        x.M = n.M,
                        this.bTa(x),
                        [2]);
                    A = u.head;
                    this.Pe.l8a(n.M, A);
                    return this.Lpb !== c.u7.Ea ? [3, 6] : [4, this.GNa.X1a(n, A)];
                case 5:
                    return (y = B.T(),
                    [3, 7]);
                case 6:
                    throw Error("Not yet implemented");
                case 7:
                    return (z = q.Tb.reduce(function(C, D) {
                        D = D.blocks.reduce(function(E, G) {
                            return E.concat([G.id]);
                        }, []);
                        return C.concat(D);
                    }, []),
                    y && (y.forEach(function(C) {
                        var D;
                        if (-1 === z.indexOf(C.id)) {
                            D = C && C.blocks && C.blocks.filter(function(E) {
                                return 0 < E.textNodes.length;
                            });
                            D && 0 < D.length && (C.blocks = D,
                            q.Tb.push(C));
                        }
                    }),
                    this.KC(n.M)),
                    [2]);
                }
            });
        });
    }
    bTa(n) {
        this.ya.error(n);
        this.emit("error", n);
    }
    KC(n) {
        this.Pe.KC(n);
        this.ol += 1;
        this.ns = false;
        !this.ql && 4 <= this.ol && (this.ql = true,
        this.emit("ready"));
    }
    qOc(n) {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function() {
                return [2, new Promise(function(q) {
                    (0,
                    p.UMb)(n, function(r, u) {
                        r ? q({
                            error: r
                        }) : q({
                            head: u
                        });
                    });
                }
                )];
            });
        });
    }
}
d.m.prototype.$Va = function(n) {
        var q, r;
        r = this.YG.HCb(n);
        this.ya.trace(("Most recent entry at current pts ").concat(n, " is segment id  ").concat(r));
        -1 === r && (r = (null === (q = this.Pe.ES(n)) || undefined === q ? undefined : q.M) || -1);
        return r === this.Pe.aca() ? this.Pe.cWa() : this.Pe.fE(r);
    }
    ;
    return m;
}
)(k);
export const Ihb = a;

// Detected exports: Ihb
