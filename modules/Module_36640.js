/**
 * Netflix Cadmium Playercore - Module 36640
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: vlb
 * Dependencies: 22970, 48170, 52571, 91176
 * Purpose: Buffer/Segment management, Logging, Event handling, Playback control
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 36640
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(91176);
c = a(48170);
g = a(52571);
f = 0;
t = (function(e) {
    class h extends e {
    constructor(k, l, m, n, q, r, u, v, w) {
        k = e.call(this, ("segment").concat(f++, "-").concat(k), l, m, n, q, r, u, "segment", w, null === v || undefined === v ? undefined : v.UXa()) || this;
        k.lq = v;
        return k;
    }
    Np(k) {
        var l, m, n, q, r, u, v, w, x, y, A, z, B, C, D;
        x = k.Vb;
        y = k.Sb;
        A = k.qa;
        z = k.wa;
        B = k.bitrate;
        C = k.Wb;
        (0,
        g.assert)(undefined !== x);
        D = null === (l = this.Mb.Pn(x)) || undefined === l ? undefined : l.M;
        (0,
        g.assert)(D, "missing segment id");
        l = k.stream.L.mM ? k.stream.track.Rba().yT : undefined;
        k = {
            M: D,
            Xe: k.K.Xe,
            xAb: k.xn,
            qa: A,
            wa: z,
            sXb: B,
            kW: k.stream.Oa,
            Wb: C,
            ZQc: null === (m = this.OM) || undefined === m ? undefined : m.sXb,
            aRc: null === (n = this.OM) || undefined === n ? undefined : n.Wb,
            $Qc: null === (q = this.OM) || undefined === q ? undefined : q.kW,
            TQc: null === (r = this.OM) || undefined === r ? undefined : r.wa,
            de: null === (u = k.stream.L.S) || undefined === u ? undefined : u.de,
            GJb: null === l || undefined === l ? undefined : l.bitrate,
            HJb: null === l || undefined === l ? undefined : l.reason,
            XQc: null === (v = this.OM) || undefined === v ? undefined : v.GJb,
            YQc: null === (w = this.OM) || undefined === w ? undefined : w.HJb
        };
        c.u && this.console.log("segmentTracker: mediaAppended", {
            item: k
        });
        this.OM = k;
        this.BOa(k, x, y) && c.u && this.trace(("segment ").concat(D, " @ ").concat(x.G, "ms"), k);
    }
    rua(k, l) {
        return k.M === l.M && !l.xAb;
    }
    cTa(k, l, m) {
        var n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F;
        n = k.Mt;
        q = n.M;
        r = n.Xe;
        u = n.sXb;
        v = n.ZQc;
        w = n.Wb;
        x = n.aRc;
        y = n.$Qc;
        A = n.kW;
        z = n.qa;
        B = n.TQc;
        C = n.GJb;
        D = n.HJb;
        E = n.XQc;
        n = n.YQc;
        G = this.Mb.Pn(l);
        F = G ? this.Mb.vAc(G) : undefined;
        (0,
        g.assert)(undefined !== G, "segmentTracker::emitPresentingEvent: position should be defined");
        c.u && this.trace(("emitSegmentPresentingEvent @ ").concat(k.timestamp.G, "ms for segment ").concat(q));
        G.M !== q && (c.u && this.console.warn("player position:", G, "not equal to trackedElement:", q),
        G = {
            M: q,
            offset: p.I.ia
        });
        k = {
            type: "segmentPresenting",
            playerTimestamp: l,
            position: G,
            seek: m,
            playbackContextId: k.Mt.de,
            branchId: null === F || undefined === F ? undefined : F.pL
        };
        undefined !== r && (k.programId = r);
        if (this.lq) {
            if (q = this.lq.XVa(q))
                (q.destvbitrate = u,
                q.destvmaf = w,
                q.destVdlid = A,
                q.srcvbitrate = v,
                q.srcvmaf = x,
                q.srcVdlid = y,
                q.srcMoffms = null === B || undefined === B ? undefined : B.G,
                q.destMoffms = z.G,
                q.srcmaxvencodingbitrate = E,
                q.srcmaxvencodingreason = n,
                q.destmaxvencodingbitrate = C,
                q.destmaxvencodingreason = D);
            k.metrics = q;
        }
        c.u && this.trace(("segmentPresenting: ").concat(JSON.stringify(k)));
        this.events.emit(k.type, k);
    }
    reset() {
        e.prototype.reset.call(this);
        this.OM = undefined;
    }
    close() {
        e.prototype.close.call(this);
        this.OM = undefined;
    }
    GM(k) {
        return ("").concat(k.M, " seqFirst:").concat(k.xAb);
    }
}
d.return h;
}
)(a(546).yla);
export const vlb = t;

// Detected exports: vlb
