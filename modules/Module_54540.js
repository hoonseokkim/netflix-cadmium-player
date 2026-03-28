/**
 * Netflix Cadmium Playercore - Module 54540
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: Mfb
 */

// Webpack module 54540
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Mfb = undefined;
d = a(22970);  // import from Module_22970
p = a(91562);  // import from Module_91562
c = a(91176);  // import from Module_91176
g = a(8149);  // import from Module_08149
t = (function() {
    function f(e) {
        this.console = e;
    }
    Object.defineProperties(f.prototype, {
        name: {
            get: function() {
                return "LiveRequestLogger";
            },
            enumerable: false,
            configurable: true
        }
    });
    f.prototype.process = function(e) {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l, m, n, q, r, u, v, w, x, y, A, z;
            return d.__generator(this, function() {
                e.done || (h = e.value.value,
                (0,
                g.dk)(h.stream) && (k = h.nca(0),
                k instanceof ArrayBuffer && (l = new p.Om(this.console,h.stream,k,["moof"],true,{
                    b2a: true
                }),
                m = l.parse(),
                m.TB && (n = l.wn("moof"),
                q = n.wn("traf"),
                r = q.wn("trun"),
                u = q.wn("tfdt"),
                v = h.stream.Wk,
                w = r.Vd,
                x = u.fH,
                y = m.Ta.O,
                A = new c.I(x,y),
                z = this.nt ? A.da(this.nt.Ydc) : undefined,
                this.console.trace(("Live Request Logger: processing request [").concat(h.mediaType, "]"), {
                    baseMediaDecodeTime: x,
                    timescale: y,
                    baseMediaDecodeMs: A.G,
                    ptsOffsetMs: v.G,
                    mediaTimestampMs: A.da(v).G,
                    offsetFromPriorMs: null === z || undefined === z ? undefined : z.G,
                    sampleCount: w,
                    url: h.url
                }),
                this.nt = {
                    Ydc: A
                }))));
                return [2, e];
            });
        });
    }
    ;
    f.prototype.reset = function() {
        this.nt = undefined;
    }
    ;
    return f;
}
)();
b.Mfb =

// Detected exports: Mfb
