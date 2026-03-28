/**
 * Netflix Cadmium Playercore - Module 55891
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: Y3
 */

// Webpack module 55891
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Y3(f, e, h, k, l, m) {
    var n, r, u, v, w, x;
    n = new p.ih();
    e = k.RUb * Math.pow(e, k.QUb);
    n.Bd = f[0];
    for (var q = f.length - 1; -1 < q; --q) {
        r = f[q];
        if (r.Db && r.Db.sb) {
            u = r.Db.sb.Fa;
            v = (0,
            c.rBb)(k.cXb, r, m);
            w = k.Mda ? (0,
            g.Exc)(k, r, r.Db, h) : undefined;
            x = v * l < (k.Mda ? w || u : u) * e;
            k.Zua && r.bitrate <= k.Kda && (d.u && p.console.log(("liveLowQualityAvoidance: feasible=").concat(x, ", ") + ("nominalBitrate=").concat(r.bitrate, ", ") + ("segmentBitrate=").concat(v, ", ") + ("throughput=").concat(u, ", ") + ("liveLowQualityThreshold=").concat(k.Kda, ", ") + ("liveLowQualityMultiplier=").concat(k.E1, ", ") + ("requiredThroughput=").concat(v * l * k.E1)),
            u > v * l * k.E1 && (x = true),
            d.u && p.console.log(("Stream ").concat(q, ": throughput=").concat(u, ", ") + ("bitrate=").concat(v, ", ") + ("nominalBitrate=").concat(r.bitrate, ", ") + ("playbackRate=").concat(l, ", ") + ("feasible=").concat(x, ", ") + ("live segment ID=").concat(m)));
            d.u && p.console.log(("Stream ").concat(q, ": throughput=").concat(u, ", ") + ("throughput discount=").concat(e, ", ") + ("maxAchievableBitrateWithLatency=").concat(w, ", ") + ("bitrate=").concat(v, ", ") + ("nominalBitrate=").concat(r.bitrate, ", ") + ("playbackRate=").concat(l, ", ") + ("feasible=").concat(x, ", ") + ("live segment ID=").concat(m));
            if (x) {
                d.u && p.console.log(("Threshold policy selected stream ").concat(q));
                n.Bd = r;
                break;
            }
        } else
            p.console.warn("Stream has no throughput statistics");
    }
    return n;
}
;
d = a(48170);  // import from Module_48170
p = a(13550);  // import from Module_13550
c = a(10592);  // import from Module_10592
g = a(6134

// Detected exports: Y3
