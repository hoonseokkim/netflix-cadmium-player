/**
 * Netflix Cadmium Playercore - Module 31413
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Hlb
 * Dependencies: 22970, 40666, 48170, 52571, 65161, 66164, 89527, 91176
 * Purpose: Manifest handling, Audio handling, Video handling, Encryption/Decryption
 */

// import dep_22970 from './Module_22970.js';
// import dep_40666 from './Module_40666.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_89527 from './Module_89527.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 31413
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

d = a(22970);
p = a(91176);
c = a(91176);
g = a(66164);
f = a(65161);
e = a(48170);
h = a(89527);
k = a(52571);
l = a(40666);
t = (function() {
    class m {
    constructor(n, q, r, u, v, w, x, y, A, z, B, C) {
        var D;
        D = this;
        this.ka = n;
        this.sd = q;
        this.events = r;
        this.Sa = u;
        this.vc = v;
        this.pOa = w;
        this.rha = x;
        this.JZc = y;
        this.E9 = A;
        this.vn = z;
        this.v$ = B;
        this.console = C;
        this.al = g.platform.time.now();
        this.IF = new Map();
        this.uD = 0;
        (0,
        k.assert)(w.S, "Presenting ad should have a manifest");
        this.Fqb = q.Fs(function() {
            return D.E1c();
        }, "impressionLogging");
        this.ka.player.cx.forEach(function(E, G) {
            (E = E.d0(h.OW)) && D.IF.set(G, E);
        });
    }
    La() {
        this.Fqb.La();
    }
    E1c() {
        var n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F;
        return d.__generator(this, function(H) {
            switch (H.label) {
            case 0:
                e.u && this.console.trace("AdImpressionLogger: starting at", this.E9.ca());
                n = this.vc;
                this.tub();
                if (!n.wD)
                    return (this.console.error(("AdImpressionLogger: no actionAdEvents for ad ").concat(n.id)),
                    [2]);
                q = this.rha.offset.G;
                r = this.E9;
                u = this.E9.add(n.duration);
                v = this.JZc;
                H.label = 1;
            case 1:
                (H.ac.push([1, 12, 13, 14]),
                (0,
                k.assert)(null === (E = n.wD) || undefined === E ? undefined : E.start, "Start event info should be defined"),
                this.emit(n.wD.start, q, v, false, q),
                (0,
                k.assert)(n.Wha, "Timed event info should be defined"),
                H.label = 2);
            case 2:
                (H.ac.push([2, 7, 8, 9]),
                w = d.__values(n.Wha),
                x = w.next(),
                H.label = 3);
            case 3:
                if (x.done)
                    return [3, 6];
                y = x.value;
                r = this.E9.add(p.I.Ca(y.fq));
                if (r.lessThan(v))
                    return [3, 5];
                e.u && this.console.trace(("AdImpressionLogger[").concat(this.rha.M, "]: waiting for ").concat(y.fq, "ms timed event") + (" at ").concat(r.ca()));
                return [4, l.ie.Jm(r)];
            case 4:
                (H.T(),
                v = r,
                this.emit(y, y.fq, r, false, q),
                H.label = 5);
            case 5:
                return (x = w.next(),
                [3, 3]);
            case 6:
                return [3, 9];
            case 7:
                return (A = H.T(),
                C = {
                    error: A
                },
                [3, 9]);
            case 8:
                try {
                    x && !x.done && (D = w.return) && D.call(w);
                } finally {
                    if (C)
                        throw C.error;
                }
                return [7];
            case 9:
                if (!u.greaterThan(r))
                    return [3, 11];
                r = u;
                e.u && this.console.trace(("AdImpressionLogger[").concat(this.rha.M, "]: waiting for end of ad at ").concat(r.ca()));
                return [4, l.ie.Jm(r)];
            case 10:
                (H.T(),
                v = r,
                H.label = 11);
            case 11:
                return [3, 14];
            case 12:
                return (z = H.T(),
                this.console.error("AdImpressionLogger: error", z),
                this.uD++,
                [3, 14]);
            case 13:
                v = this.ka.player.z1 ? this.ka.player.z1.No : this.ka.player.Sd ? this.ka.player.Rd : v;
                if (v.$f(u))
                    ((0,
                    k.assert)(null === (G = n.wD) || undefined === G ? undefined : G.complete, "Complete event should be defined"),
                    this.emit(n.wD.complete, n.endTime.G, u, true, q));
                else if (null === (F = n.wD) || undefined === F ? 0 : F.stop)
                    (B = v.da(this.E9).G,
                    this.emit(n.wD.stop, B, v, true, q));
                this.tub();
                return [7];
            case 14:
                return [2];
            }
        });
    }
    emit(n, q, r, u, v) {
        var w, x, y;
        e.u && this.console.trace(("AdImpressionLogger[").concat(this.rha.M, "]: emitting ").concat(n.event, " event at ").concat(q, "ms") + (" for player time ").concat(r.ca()));
        q = {
            M: this.rha.M,
            offset: p.I.Ca(q)
        };
        w = this.jWa(r);
        try {
            x = this.v$(q);
            y = d.__assign(d.__assign({
                type: "adEvent"
            }, n), {
                ii: q,
                XB: w,
                S: this.pOa.S,
                al: this.al,
                Dld: u ? g.platform.time.now() : -1,
                Wv: this.Sa.kj,
                Ub: this.Sa.Ub,
                N4: this.vc.N4,
                c1: this.vc.c1,
                eu: this.Sa.type,
                hb: this.Sa.Cu(),
                oOa: v,
                LH: x,
                F2a: r
            });
            this.vn && (y.vn = this.vn);
            this.events.emit("adEvent", y);
        } catch (A) {
            this.console.error("Impression error event", A);
            this.uD++;
        }
    }
    jWa(n) {
        var q, r, u;
        q = this.pOa.S.R;
        r = d.__read(this.YCb(n, this.IF.get(f.l.V), q), 2);
        u = r[0];
        r = r[1];
        n = d.__read(this.YCb(n, this.IF.get(f.l.U), q), 2);
        return {
            audio: u,
            video: n[0],
            text: [],
            total: Math.max(r, n[1])
        };
    }
    YCb(n, q, r) {
        n = (null === q || undefined === q ? undefined : q.sZc(n, r)) || [];
        n = (0,
        c.flatten)(n.map(function(u) {
            return Object.keys(u.yo).map(function(v) {
                v = u.yo[v];
                return {
                    ob: v.ob,
                    duration: v.totalTime,
                    Gk: u.Gk
                };
            });
        }));
        q = n.reduce(function(u, v) {
            return u + v.duration;
        }, 0);
        e.u && this.console.trace("Getting playtime journal", {
            R: r,
            lkd: n.length,
            totalTime: q
        });
        return [n, q];
    }
    tub() {
        var n, q, r;
        r = this.pOa.S.R;
        null === (n = this.IF.get(f.l.V)) || undefined === n ? undefined : n.NPb(r);
        null === (q = this.IF.get(f.l.U)) || undefined === q ? undefined : q.NPb(r);
    }
    Tq() {
        return {
            ad: this.Fqb.Tq(),
            errors: this.uD
        };
    }
}
Object.defineProperties(m.prototype, {
        HJ: {
            get: function() {
                return this.uD;
            },
            enumerable: false,
            configurable: true
        }
    });
    return m;
}
)();
export const Hlb = t;

// Detected exports: Hlb
