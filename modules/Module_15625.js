/**
 * Netflix Cadmium Playercore - Module 15625
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: snb
 */

// Webpack module 15625
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const snb = undefined;
d = a(22970);  // import from Module_22970
p = a(91562);  // import from Module_91562
c = a(52571);  // import from Module_52571
g = a(69575);  // import from Module_69575
f = a(45247);  // import from Module_45247
t = (function(e) {
    function h(k, l) {
        var m;
        m = e.call(this, k, f.l.U) || this;
        m.console = k;
        m.config = l;
        return m;
    }
    d.__extends(h, e);
    h.prototype.pa = function(k) {
        var l, m, n, q, r, u, v, w, x, y;
        (0,
        c.assert)(!k.yD, "AudioMediaFragmentEditor [${fragment.mediaType}]: Attempt to edit appended fragment");
        if (!k.pa)
            return {
                success: true
            };
        m = 0 < k.pa.start;
        n = null !== k.pa.end && k.pa.end < k.Df;
        if (!m && !n)
            return {
                success: true
            };
        (0,
        c.assert)(k.MS, "AudioMediaFragmentEditor: fragment has missing responses");
        if (0 >= k.Ob.$)
            return {
                success: false
            };
        q = k.kv;
        r = this.wzb(q, true);
        u = r.n0a;
        v = r.WIc;
        w = r.XIc;
        r = r.OU;
        if (!u || !v || !w)
            return {
                success: false
            };
        v = u.slice(0, v);
        q = false === k.Mqa && !q.every(function(A) {
            return A instanceof ArrayBuffer;
        });
        w = k.stream.Os();
        (0,
        c.assert)(w || "-1" === k.stream.Oa, "Should have a header for the stream that is being edited");
        if (m) {
            m = new p.Xz(this.jN,k.stream,u,{
                ce: null === w || undefined === w ? undefined : w.Lea
            });
            x = m.RPb({
                Jl: k.pa.start,
                O: k.O,
                Cqa: q
            });
        }
        if (n && false !== x) {
            m = new p.Xz(this.jN,k.stream,x ? (0,
            g.IA)(x.Na) : u,{
                ce: null === w || undefined === w ? undefined : w.Lea
            });
            y = m.$Pb({
                Jl: (null !== (l = k.pa.end) && undefined !== l ? l : k.Df) - k.pa.start,
                O: k.O,
                Cqa: q
            });
        }
        k = (k = n ? y : x) ? [(0,
        g.IA)(k.Na)] : [v];
        k.push.apply(k, d.__spreadArray([], d.__read(r), false));
        return {
            success: true,
            kv: k
        };
    }
    ;
    return h;
}
)(a(47267).sHa);
b.snb =

// Detected exports: snb
