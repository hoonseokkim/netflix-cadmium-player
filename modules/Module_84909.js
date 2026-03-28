/**
 * Netflix Cadmium Playercore - Module 84909
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 84909
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.u$a = undefined;
d = a(91176);  // import from Module_91176
t = (function() {
    function p(c) {
        this.config = c;
    }
    p.prototype.wYc = function(c) {
        return c % 100 + 1 <= this.config.pfa;
    }
    ;
    p.prototype.Oh = function(c) {
        var g, f, e, h, k, l, m, n, q, r, u;
        m = Number(null === (g = c[0]) || undefined === g ? undefined : g.R);
        if (!(this.config.K_ && this.wYc(m) && 0 < this.config.K3.length))
            return c;
        g = c.length;
        n = null !== (f = c[g - 1].ZU) && undefined !== f ? f : 0;
        if (f = (0,
        d.kc)(this.config.K3, function(v) {
            return v.Ykd >= n && v.DQb <= n;
        })) {
            for (m = 0; m < g; m++) {
                q = c[Math.max(m - 1, 0)];
                r = c[m];
                if (!((null !== (e = r.ZU) && undefined !== e ? e : 0) < f.DQb || (null !== (h = q.ZU) && undefined !== h ? h : 0) < f.DQb)) {
                    u = null !== (k = r.Wb) && undefined !== k ? k : Infinity;
                    q = null !== (l = q.Wb) && undefined !== l ? l : Infinity;
                    if (!(q < f.njd || q < f.mjd && r.bitrate < f.maxBitrate || !u && r.bitrate < f.Gid))
                        break;
                }
            }
            return c.slice(0, m);
        }
        return c;
    }
    ;
    return p;
}
)();
b.u$a =

