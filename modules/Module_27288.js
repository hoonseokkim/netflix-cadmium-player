/**
 * Netflix Cadmium Playercore - Module 27288
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Lfb
 * Dependencies: 6832, 8149, 13550, 22970, 26388, 65161, 71460, 91176, 91967
 * Purpose: Buffer/Segment management, Encryption/Decryption, Logging, Event handling
 */

// import dep_6832 from './Module_6832.js';
// import dep_8149 from './Module_8149.js';
// import dep_13550 from './Module_13550.js';
// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_65161 from './Module_65161.js';
// import dep_71460 from './Module_71460.js';
// import dep_91176 from './Module_91176.js';
// import dep_91967 from './Module_91967.js';

// Webpack module 27288
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

t = a(22970);
d = a(26388);
p = a(91176);
c = a(6832);
g = a(71460);
f = t.__importDefault(a(40497));
e = a(8149);
h = a(13550);
k = a(65161);
l = a(91967);
a = (function() {
    class m {
    constructor(n, q) {
        this.Cs = n;
        this.ka = q;
        this.enabled = true;
        this.q_ = {};
        this.FO = {};
        q.events.on("liveMissingSegment", this.TSc.bind(this));
    }
    TSc(n) {
        var q, r;
        n = n.mediaType;
        n = (0,
        k.FI)(n);
        (q = this.q_)[n] || (q[n] = 0);
        (r = this.FO)[n] || (r[n] = 0);
        this.q_[n] += 1;
        this.FO[n] += 1;
    }
    Ph(n) {
        var q, r, u, v, w, x, y, A, z, B, C;
        n = n.Xs;
        if (n === l.Od.aq || n === l.Od.WS || n === l.Od.vw || n === l.Od.mv || n === l.Od.xha || n === l.Od.qH || n === l.Od.hga || n === l.Od.uI || n === l.Od.VI) {
            x = this.ka.player;
            if (x.Sd) {
                y = x.bC;
                A = y.L;
                z = A.jk || A;
                B = null === (q = y.$d(d.l.U)) || undefined === q ? undefined : q.El;
                if (z.Ab && B) {
                    (0,
                    p.assert)(z.Ic, "Expected live viewable with position service");
                    q = z.Ic.Zba(true).G;
                    C = this.ka.Pn(x.Rd);
                    if (C) {
                        C = this.ka.Rs(C).Ga;
                        q = {
                            encodingpipelinetime: z.Wf,
                            devicepts: q + C.G
                        };
                        if (n === l.Od.uI) {
                            (C = null === (r = x.cx.get(d.l.U)) || undefined === r ? undefined : r.d0(c.hma)) && (q.vbitrate = null === (u = C.kca()) || undefined === u ? undefined : u.stream.bitrate);
                            (r = null === (v = x.cx.get(d.l.V)) || undefined === v ? undefined : v.d0(c.hma)) && (q.abitrate = null === (w = r.kca()) || undefined === w ? undefined : w.stream.bitrate);
                            0 < Object.keys(this.FO).length && (q.liveMissingFragments = this.FO);
                            0 < Object.keys(this.q_).length && (q.missingFragmentsDelta = this.q_,
                            this.q_ = {});
                            if (v = y.$d(d.l.U))
                                (v = v.track.Rba(),
                                q.minvencodingbitrate = v.a0a,
                                q.maxvencodingbitrate = v.yT);
                            q.edgecushion = z.Ic.bIb;
                        }
                        n === l.Od.aq && (0,
                        e.dk)(B) && (q.presentationtimeoffset = B.Wk.G);
                        if (n === l.Od.aq || n === l.Od.mv)
                            (v = f.default.instance().BWa(),
                            u = this.Cs.QVa(A),
                            w = this.ka.tCb(),
                            r = new g.Tdb(v,this.ka.config,this.ka.console),
                            B = (0,
                            h.hAa)(B.L, u.oT),
                            q.presentationdelay = w,
                            q.sessionStats = v,
                            q.ishighandstable = r.WDc(),
                            q.isSlowBufferFilling = B,
                            q.requestOffsetMs = z.Ic.nQb,
                            q.edgecushion = z.Ic.bIb);
                        if (n === l.Od.aq || n === l.Od.mv || n === l.Od.uI)
                            (z = this.ka.uCb(),
                            q.targetbufferduration = z);
                        n === l.Od.vw && (q.livePostplayEvents = A.SGc,
                        0 < Object.keys(this.FO).length && (q.missingFragments = this.FO,
                        this.FO = {}));
                        q.usingElla = this.nDc();
                        q.ellaEligible = this.mDc();
                        return q;
                    }
                }
            }
        }
    }
    nDc() {
        var n, q;
        n = this.$d(d.l.U);
        q = this.$d(d.l.V);
        return (null === q || undefined === q ? undefined : q.Dia) || (null === n || undefined === n ? undefined : n.Dia) || false;
    }
    mDc() {
        var n, q;
        n = this.$d(d.l.U);
        q = this.$d(d.l.V);
        return (null === q || undefined === q ? undefined : q.Qqa) || (null === n || undefined === n ? undefined : n.Qqa) || false;
    }
}
Object.defineProperties(m.prototype, {
        ic: {
            get: function() {
                return "live-reporter";
            },
            enumerable: false,
            configurable: true
        }
    });
    m.prototype.$d = function(n) {
        var q, r;
        return null === (r = (q = this.ka).getPipelineForPresentingBranch) || undefined === r ? undefined : r.call(q, n);
    }
    ;
    return m;
}
)();
export const Lfb = a;

// Detected exports: Lfb
