/**
 * Netflix Cadmium Playercore - Module 29480
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: Ihd
 */

// Webpack module 29480
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Ihd(c) {
    var g, f, e, h, k, l, m, n, q, r, u, v, w, x, y;
    if (d.jb.isEnabled) {
        x = c.Le;
        if (c.mediaType === p.l.V) {
            y = c.track.rm;
            d.jb.log((g = {},
            g.playgraphId = x,
            g.type = "STREAM_SELECTION",
            g.bitrateKbps = c.bitrate,
            g.mediaType = "AUDIO",
            g.codec = y.E$,
            g.language = y.language,
            g.channels = y.channels,
            g.reason = "",
            g.stats = (f = {},
            f.throughputKbps = null !== (m = c.sb) && undefined !== m ? m : -1,
            f.throughputShare = 1,
            f),
            g));
        } else
            c.mediaType === p.l.U ? (y = c.track.rm,
            d.jb.log((e = {},
            e.playgraphId = x,
            e.type = "STREAM_SELECTION",
            e.mediaType = "VIDEO",
            e.bitrateKbps = c.bitrate,
            e.codec = c.profile,
            e.height = null !== (n = c.ZU) && undefined !== n ? n : -1,
            e.width = null !== (q = c.z4a) && undefined !== q ? q : -1,
            e.vmaf = null !== (r = c.Wb) && undefined !== r ? r : -1,
            e.framerate = y.qea / y.pea,
            e.reason = "",
            e.stats = (h = {},
            h.throughputKbps = null !== (u = c.sb) && undefined !== u ? u : -1,
            h.throughputShare = 1,
            h),
            e))) : c.mediaType === p.l.Ea && (y = c.track.rm,
            d.jb.log((k = {},
            k.playgraphId = x,
            k.type = "STREAM_SELECTION",
            k.mediaType = "TEXT",
            k.bitrateKbps = c.bitrate,
            k.codec = c.profile,
            k.language = null !== (v = y.language) && undefined !== v ? v : d.lo,
            k.reason = "",
            k.stats = (l = {},
            l.throughputKbps = null !== (w = c.sb) && undefined !== w ? w : -1,
            l.throughputShare = 1,
            l),
            k)));
    }
}
;
d = a(97685);  // import from Module_97685
p = a(619

// Detected exports: Ihd
