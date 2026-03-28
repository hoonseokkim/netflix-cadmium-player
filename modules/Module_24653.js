/**
 * Netflix Cadmium Playercore - Module 24653
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: GRb
 */

// Webpack module 24653
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    var f, e, h, k, l, m, n, q, r;
    e = g.stream;
    h = g.index;
    k = g.config;
    l = g.player;
    g = g.Yec;
    m = e.id;
    n = e.bitrate;
    q = e.sb || 0;
    r = !!q;
    c && p.console.log("Checking feasibility of [" + h + "] " + m + " (" + n + " Kbps)");
    if (!e.er)
        return (c && !e.Fp && p.console.log("  Not available"),
        c && e.Go && p.console.log("  Failed"),
        false);
    e = null !== (f = k.$u) && undefined !== f ? f : Infinity;
    if (n > e)
        return (c && p.console.log("  Above maxInitAudioBitrate (" + e + " Kbps)"),
        false);
    if (!(n * k.i2 / 8 < (l.buffer.ru || Infinity)))
        return (c && p.console.log("  audio buffer too small to handle this stream"),
        false);
    if (r) {
        c && p.console.log(("  Have throughput history = ").concat(r, " : available throughput = ").concat(q, " Kbps"));
        if (n * l.playbackRate < q / g)
            return (c && p.console.log(" +FEASIBLE: bitrate less than available throughput"),
            true);
        c && p.console.log(" bitrate requires more than available throughput");
        return false;
    }
    if (n <= k.Ty)
        return (c && p.console.log("  Bitrate is less than max of minInitAudioBitrate (" + k.Ty + " Kbps) "),
        c && p.console.log("  +FEASIBLE: no throughput history and has minimum bitrate configured"),
        true);
    c && p.console.log("  No throughput history");
    return false;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function GRb(g) {
    var f, e, h, k, m;
    f = g.config;
    e = g.player;
    h = g.el;
    g = new p.ih();
    k = f.mPa || 1;
    h = h.first;
    for (var l = h.length - 1; 0 <= l; --l) {
        m = h[l];
        if (d({
            stream: m,
            index: l,
            config: f,
            player: e,
            Yec: k
        })) {
            g.Bd = m;
            break;
        }
        m.oI && (g.Bd = m);
    }
    return g;
}
;
p = a(13550);  // import from Module_13550
c =

// Detected exports: GRb
