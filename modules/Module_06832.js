/**
 * Netflix Cadmium Playercore - Module 6832
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: hma
 * Dependencies: 22970, 26388, 48170, 52571, 97685
 * Purpose: Manifest handling, Audio handling, Video handling, Logging
 */

// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_97685 from './Module_97685.js';

// Webpack module 6832
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

d = a(22970);
p = a(26388);
c = a(97685);
g = a(48170);
f = a(52571);
e = 0;
t = (function(h) {
    class k extends h {
    constructor(l, m, n, q, r, u, v, w, x) {
        return h.call(this, ("stream").concat(e++, "-").concat(l), m, n, q, r, u, v, "stream", w, x) || this;
    }
    Np(l) {
        var m, n, q;
        m = l.stream;
        n = l.Vb;
        q = l.Sb;
        l = l.qa;
        (0,
        f.assert)(undefined !== n, "playerStartTimestamp undefined at media append");
        (0,
        f.assert)(undefined !== l, "contentStartTimestamp undefined at media append");
        this.BOa({
            stream: m,
            qa: l
        }, n, q) && g.u && this.trace(("stream ").concat(m.id, ", ").concat(m.bitrate, "kbit/s @ ").concat(n.G, "ms"));
    }
    rua(l, m) {
        return l.stream === m.stream;
    }
    cTa(l, m) {
        var n, q, r, u, v, w, x;
        u = l.Mt.stream;
        v = this.Mb.Pn(m);
        (0,
        f.assert)(undefined !== v);
        g.u && this.trace(("emitStreamPresentingEvent @ ").concat(l.timestamp.G, "ms for ").concat(null === u || undefined === u ? undefined : u.id, ", ") + ("").concat(null === u || undefined === u ? undefined : u.bitrate, "kbit/s"));
        this.events.emit("streamPresenting", {
            type: "streamPresenting",
            mediaType: u.mediaType,
            playerTimestamp: m,
            position: v,
            trackIndex: null === (q = null === u || undefined === u ? undefined : u.track) || undefined === q ? undefined : q.SK,
            streamIndex: null === u || undefined === u ? undefined : u.It,
            stream: u,
            manifest: null === (r = u.L) || undefined === r ? undefined : r.S,
            contentStartTimestamp: l.Mt.qa
        });
        if (c.jb.isEnabled && u)
            if ((l = u.Le,
            u.mediaType === p.l.U)) {
                m = u.track;
                q = u.Zc;
                w = u.ZU;
                x = u.z4a;
                r = u.Wb;
                u = u.bitrate;
                c.jb.log((n = {},
                n.playgraphId = l,
                n.type = "STREAM_RENDER",
                n.mediaType = "VIDEO",
                n.bitrateKbps = u,
                n.codec = q,
                n.framerate = m.frameRate ? m.frameRate.Zy / m.frameRate.pw : -1,
                n.height = null !== w && undefined !== w ? w : -1,
                n.width = null !== x && undefined !== x ? x : -1,
                n.vmaf = null !== r && undefined !== r ? r : -1,
                n));
            } else
                u.mediaType === p.l.V && (m = u.track,
                q = u.Zc,
                u = u.bitrate,
                c.jb.log((w = {},
                w.playgraphId = l,
                w.type = "STREAM_RENDER",
                w.mediaType = "AUDIO",
                w.bitrateKbps = u,
                w.codec = q,
                w.channels = null !== (x = m.channels) && undefined !== x ? x : c.lo,
                w.language = c.lo,
                w)));
    }
    GM(l) {
        return ("").concat(l.stream.Oa, "@").concat(l.qa.ca());
    }
}
d.return k;
}
)(a(546).yla);
export const hma = t;

// Detected exports: hma
