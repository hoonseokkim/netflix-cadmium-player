/**
 * Netflix Cadmium Playercore - Module 77154
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: vfb
 */

// Webpack module 77154
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const vfb = undefined;
d = a(22970);  // import from Module_22970
p = a(65161);  // import from Module_65161
c = a(8149);  // import from Module_08149
t = (function() {
    function g(f, e) {
        this.console = f;
        this.config = e;
    }
    Object.defineProperties(g.prototype, {
        iRc: {
            get: function() {
                undefined === this.spb && (this.spb = Math.random());
                return this.spb;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Oh = function(f) {
        var e, h;
        if (!this.config.j5 || 0 === f.length)
            return f;
        e = this.wvc(f);
        h = f.filter(function(k) {
            return k.bitrate > e ? false : true;
        });
        return 0 < h.length ? h : [f[0]];
    }
    ;
    g.prototype.swc = function(f, e) {
        var h, m, n, q;
        if (e >= f[f.length - 1].bitrate)
            return e;
        try {
            for (var k = d.__values(f), l = k.next(); !l.done; l = k.next()) {
                m = l.value.bitrate;
                if (m === e)
                    return e;
                if (m < e)
                    n = m;
                else if (m > e) {
                    q = m;
                    break;
                }
            }
        } catch (u) {
            var r;
            r = {
                error: u
            };
        } finally {
            try {
                l && !l.done && (h = k.return) && h.call(k);
            } finally {
                if (r)
                    throw r.error;
            }
        }
        return undefined === n || undefined === q ? e : this.iRc < (q - e) / (q - n) ? n : q;
    }
    ;
    g.prototype.wvc = function(f) {
        var e;
        e = this.Qyc(f[0]);
        return undefined === e || 0 === e ? Infinity : this.config.m5 ? this.swc(f, e) : e;
    }
    ;
    g.prototype.Qyc = function(f) {
        if ((0,
        c.Gn)(f.track))
            return f.track.SM;
        if (this.config.k5 && f.track.L.mM && (f = f.track.L.pT))
            return (f = f.getTracks(p.l.U).filter(c.Gn).map(function(e) {
                return e.SM;
            }).filter(function(e) {
                return undefined !== e && 0 < e;
            }),
            0 < f.length ? Math.min.apply(Math, d.__spreadArray([], d.__read(f), false)) : undefined);
    }
    ;
    return g;
}
)();
b.vfb =

// Detected exports: vfb
