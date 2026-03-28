/**
 * Netflix Cadmium Playercore - Module 69216
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: gEa
 * Dependencies: 5021, 21801, 22365, 22674, 22970, 31149, 36129, 81918, 85001
 * Purpose: Audio handling, Video handling, Buffer/Segment management, Configuration
 */

// import dep_5021 from './Module_5021.js';
// import dep_21801 from './Module_21801.js';
// import dep_22365 from './Module_22365.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_31149 from './Module_31149.js';
// import dep_36129 from './Module_36129.js';
// import dep_81918 from './Module_81918.js';
// import dep_85001 from './Module_85001.js';

// Webpack module 69216
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
class d {
    constructor(n, q) {
    this.$a = n;
    this.config = q;
}
    Bxb(n) {
    var q, r, u, v, w, x, y, A, z, B;
    q = this;
    v = n.mediaTime.value;
    w = n.ju.value;
    x = n.bc.value;
    y = n.state.value;
    A = {
        segmentId: n.nWa(),
        mediaTime: v,
        segmentTime: n.bM(),
        bufferingState: p.Iec[w],
        presentingState: p.PQc[x],
        playbackState: p.xPc[y],
        mseBuffersBusy: this.tzc(n),
        intBuffersBusy: this.Zwc(n),
        tabVisible: this.G0c(),
        decodedFrameCount: this.rnc(n),
        videoElementInDom: this.j4c(n),
        lastVideoSync: this.$a.Fc().da((0,
        k.pc)(n.Lha)).na(k.Ba)
    };
    z = x === h.Qb.Bh ? n.qb.bh ? this.config.rMb : this.config.qMb : this.config.oKb;
    if (w !== h.zh.Lf) {
        if ((w = e.Y.w_b,
        this.$sb(A.mseBuffersBusy, A.intBuffersBusy)))
            B = p.U$a;
    } else if ((x !== h.Qb.Bg ? w = e.Y.y_b : (w = e.Y.x_b,
    (x = n.ae) && 0 === x.ksa() && (B = p.l7b)),
    x = n.ae))
        (A.mediaBuffered = x.r0(),
        A.mediaBufferedSegments = x.s0(),
        x.jc.sourceBuffers.forEach(function(C) {
            var D, E;
            D = p.Uh[C.mediaType];
            A[D + "Ranges"] = C.bsa();
            try {
                E = C.buffered();
            } catch (G) {
                E = undefined;
            }
            E && 0 !== E.length ? (C = 1E3 * E.end(0) - v,
            A[D + "Undecoded"] = C,
            1 < E.length && (B = p.qZb),
            v < 1E3 * E.start(0) || v > 1E3 * E.end(0) ? B = p.rZb : C < z.na(k.Ba) ? B = p.sZb : q.$sb(A.mseBuffersBusy, A.intBuffersBusy) && (B = p.U$a)) : (A[D + "Undecoded"] = 0,
            B = p.pZb);
        }));
    x = n.j4a.KWa();
    y = v === (null === (r = x.repositionTrace) || undefined === r ? undefined : r[0].newMediaTime);
    A.lastRepositionCausedTimeout = y;
    A.trackChangeInProgress = null === (u = n.fb) || undefined === u ? undefined : u.G7a;
    Object.assign(A, x);
    n = "";
    try {
        n = JSON.stringify(A);
    } catch (C) {
        n = "Cannot stringify details: " + C;
    }
    return new f.we(e.ea.oib,w,B,undefined,undefined,undefined,n,undefined);
}
    tzc(n) {
    var q;
    if (n.jc) {
        q = {};
        n.jc.sourceBuffers.forEach(function(r) {
            q[0 === r.type ? "audio" : "video"] = {
                updating: r.updating()
            };
        });
        return q;
    }
}
    Zwc(n) {
    var q;
    if (n.jc) {
        q = {};
        n.jc.sourceBuffers.forEach(function(r) {
            q[0 === r.type ? "audio" : "video"] = {
                updating: r.ak()
            };
        });
        return q;
    }
}
    G0c() {
    return !l.$i.hidden;
}
    rnc(n) {
    return (n = n.ae) && (n = n.jc.Ja) && undefined !== n.webkitDecodedFrameCount ? n.webkitDecodedFrameCount : NaN;
}
    j4c(n) {
    if (n = n.ae)
        if (n = n.jc.Ja)
            return l.$i.body.contains(n);
    return false;
}
}
t = a(22970);
c = a(22674);
g = a(81918);
f = a(31149);
e = a(36129);
h = a(85001);
k = a(5021);
l = a(22365);
a = a(21801);
d.prototype.$sb = function(n, q) {
    var r, u, v, w;
    return !((null === (r = n.audio) || undefined === r ? undefined : r.updating) === (null === (u = q.audio) || undefined === u ? undefined : u.updating) && (null === (v = n.video) || undefined === v ? undefined : v.updating) === (null === (w = q.video) || undefined === w ? undefined : w.updating));
}
;
m = p = d;
export const gEa = m;
m.pZb = "1";
m.qZb = "2";
m.rZb = "3";
m.U$a = "4";
m.sZb = "5";
m.l7b = "6";
m.Uh = ["Audio", "Video"] /* Audio */;
m.Iec = ["", "NORMAL", "BUFFERING", "STALLED"];
m.PQc = ["", "WAITING", "PLAYING ", "PAUSED", "ENDED"];
m.xPc = ["STATE_NOTLOADED", "STATE_LOADING", "STATE_NORMAL", "STATE_CLOSING", "STATE_CLOSED"] /* STATE_NOTLOADED */;
export const gEa = m = p = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(g.re)), t.__param(1, (0,
c.v)(a.JHa))], m);

// Detected exports: gEa
