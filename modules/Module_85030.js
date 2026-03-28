/**
 * Netflix Cadmium Playercore - Module 85030
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: nlb
 * Dependencies: 22970, 48170, 52571, 65161, 66164, 69575, 90745, 91176
 * Purpose: Buffer/Segment management, Logging, Event handling, Configuration
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_69575 from './Module_69575.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 85030
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k;

d = a(22970);
p = a(91176);
c = a(90745);
g = a(66164);
f = a(48170);
e = a(65161);
h = a(69575);
k = a(52571);
t = (function() {
    class l {
    constructor(m, n, q) {
        var r;
        r = this;
        this.Mb = m;
        this.player = n;
        this.pending = new Map();
        this.listeners = new c.sf();
        this.B0a = false;
        this.QAc = function(u) {
            r.IQb(true, function() {
                f.u && r.console.debug("cancelling playback ending");
                u.cancel();
            });
        }
        ;
        this.listeners.addListener(n, "playbackEnding", this.QAc);
        this.console = (0,
        h.Nf)(g.platform, q, "SEAMLESSMANAGER");
        f.u && this.console.debug("construct");
    }
    La() {
        f.u && this.console.debug("destruct");
        this.pending.clear();
        this.listeners.clear();
    }
    yTc(m) {
        this.qRb = m;
    }
    QXb(m) {
        var n, q;
        0 === this.pending.size && ((0,
        k.assert)(undefined === this.un, "SeamlessManager: No pending transitions, but a wait is deferred"),
        this.un = new p.Zo());
        (0,
        k.assert)(this.un, "SeamlessManager: deferred is undefined");
        if (this.pending.has(m.mediaType)) {
            q = this.pending.get(m.mediaType);
            if (q.mediaType === m.mediaType && q.lba === m.lba && q.from.M === m.from.M && q.to.M === m.to.M && q.timestamp.equal(m.timestamp) && q.Ffa.equal(m.Ffa) && q.to.stream === m.to.stream && q.from.stream === m.from.stream)
                return (f.u && this.console.trace(("duplicate waitTillAllowed request for media [").concat(m.mediaType, "]")),
                this.un.promise);
        }
        (0,
        k.assert)(!this.pending.has(m.mediaType), "SeamlessManager: There is already a pending transition for mediaType " + m.mediaType);
        this.pending.set(m.mediaType, m);
        f.u && this.console.trace(("got new transition [").concat(m.mediaType, "] --> ").concat(null === (n = m.to.stream) || undefined === n ? undefined : n.id));
        n = this.Mb.Uh;
        f.u && this.console.debug("checking pending", {
            size: this.pending.size,
            Aed: n
        });
        if (this.pending.size === n.length && !this.B0a) {
            n = this.BEc();
            if (n.N2a)
                return (f.u && this.console.trace(("seamless transition possible at ").concat(m.timestamp.ca())),
                this.un.resolve(),
                this.reset(),
                Promise.resolve());
            f.u && this.console.trace(("starting non-seamless transition at ").concat(m.timestamp.ca()));
            this.UZc(n.info);
        }
        return this.un.promise;
    }
    TUc(m) {
        f.u && this.console.trace(("reset media [").concat(m, "]"));
        this.pending.delete(m);
        0 === this.pending.size && this.reset();
    }
    reset() {
        f.u && this.console.debug("resetting");
        this.B0a = false;
        this.un = undefined;
        this.pending.clear();
    }
    BEc() {
        var m, n, q, r, w, x, y, A, z, B, C, D, E, G, F;
        r = {
            N2a: true
        };
        try {
            for (var u = d.__values(this.pending.entries()), v = u.next(); !v.done; v = u.next()) {
                w = d.__read(v.value, 2);
                x = w[0];
                y = w[1];
                if (y.from) {
                    A = y.from.stream;
                    z = y.to.stream;
                    if ((null === A || undefined === A ? undefined : A.track) === (null === z || undefined === z ? undefined : z.track))
                        f.u && this.console.debug("Seamless deemed possible due to same track", {
                            mediaType: x
                        });
                    else {
                        B = null === A || undefined === A ? undefined : A.Ps();
                        C = null === z || undefined === z ? undefined : z.Ps();
                        D = undefined;
                        E = this.Mb.Pn(y.timestamp);
                        D = y.from.M && 0 > this.Mb.eT.value.G ? {
                            M: y.from.M,
                            offset: p.I.Ca(0)
                        } : this.Mb.Pn(y.Ffa);
                        G = undefined;
                        G = x !== e.l.Ea ? this.player.qu({
                            mediaType: x,
                            lba: y.lba,
                            from: B,
                            to: C,
                            Aba: D,
                            aia: E
                        }) : {
                            qu: true,
                            reason: "Text"
                        };
                        if (G.qu)
                            f.u && this.console.debug("Seamless deemed possible", {
                                mediaType: x,
                                from: B,
                                to: C,
                                Aba: D,
                                aia: E
                            });
                        else {
                            f.u && this.console.debug("Non-seamless transition; details:", {
                                reason: G.reason,
                                mediaType: x,
                                from: B,
                                to: C
                            });
                            F = r.N2a ? [] : r.info.rPb;
                            G.reason && (y.reason = "string" !== typeof G.reason ? G.reason : undefined,
                            F.push(G.reason));
                            r = {
                                N2a: false,
                                info: {
                                    poc: null !== (n = y.to.M) && undefined !== n ? n : "unk",
                                    AZc: null !== (q = y.from.M) && undefined !== q ? q : "unk",
                                    F2a: y.timestamp,
                                    rPb: F
                                }
                            };
                        }
                    }
                }
            }
        } catch (J) {
            var H;
            H = {
                error: J
            };
        } finally {
            try {
                v && !v.done && (m = u.return) && m.call(u);
            } finally {
                if (H)
                    throw H.error;
            }
        }
        return r;
    }
    UZc(m) {
        var n;
        null === (n = this.qRb) || undefined === n ? undefined : n.Tac(m);
        this.B0a = true;
        this.Mb.Np.value ? (f.u && this.console.trace("Signaling EOS for upcoming restart"),
        this.Mb.lha()) : (m = this.Mb,
        f.u && this.console.trace("Signaling immediate restart", {
            append: this.Mb.Np.value,
            Wbd: m.sourceBuffers.map(function(q) {
                return q.Np.value;
            })
        }),
        this.IQb(false));
    }
    IQb(m, n) {
        var q, r, u, v, w, x, y, B, C, D;
        u = this;
        if (this.pending.size) {
            f.u && this.console.trace("playback ending, restarting player");
            w = {};
            x = (q = {},
            q[e.l.V] = undefined,
            q[e.l.U] = undefined,
            q[e.l.Ea] = undefined,
            q[e.l.yk] = undefined,
            q);
            q = undefined;
            y = [];
            try {
                for (var A = d.__values(this.pending.entries()), z = A.next(); !z.done; z = A.next()) {
                    B = d.__read(z.value, 2);
                    C = B[0];
                    D = B[1];
                    w[C] = null === (v = D.to.stream) || undefined === v ? undefined : v.Ps();
                    q = {
                        to: {
                            M: D.to.M,
                            offset: D.timestamp
                        }
                    };
                    D.reason && y.push(D.reason);
                    D.from.M && (x[C] = D.from.M,
                    q.from = {
                        M: D.from.M,
                        offset: D.Ffa
                    });
                }
            } catch (G) {
                var E;
                E = {
                    error: G
                };
            } finally {
                try {
                    z && !z.done && (r = A.return) && r.call(A);
                } finally {
                    if (E)
                        throw E.error;
                }
            }
            null === n || undefined === n ? undefined : n();
            this.Mb.WZc(q, m, y);
            f.u && this.console.debug("Restarting player", w);
            this.player.kd(w, x, q).then(function() {
                var G, F;
                null === (G = u.un) || undefined === G ? undefined : G.resolve();
                f.u && u.console.debug("Restart completed");
                null === (F = u.qRb) || undefined === F ? undefined : F.Uac();
                u.reset();
            });
        }
    }
}
return l;
}
)();
export const nlb = t;

// Detected exports: nlb
