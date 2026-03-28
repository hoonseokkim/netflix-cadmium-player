/**
 * Netflix Cadmium Playercore - Module 58487
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: yfb
 */

// Webpack module 58487
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const yfb = undefined;
d = a(91176);  // import from Module_91176
p = a(66164);  // import from Module_66164
c = a(71077);  // import from Module_71077
t = (function() {
    function g(f, e) {
        this.VGc = f;
        this.nwa = e;
    }
    g.prototype.CM = function(f, e) {
        var h, k;
        k = this.qCb(f);
        f = e(f);
        switch (k) {
        case c.ds.UJa:
        case c.ds.oKa:
            return {
                WN: false,
                At: false
            };
        case c.ds.d8:
            return {
                WN: false,
                At: false,
                LDc: true
            };
        case c.ds.Vla:
        case c.ds.LX:
            return {
                WN: false,
                At: null !== (h = f.At) && undefined !== h ? h : true
            };
        default:
            return f;
        }
    }
    ;
    g.prototype.qCb = function(f) {
        var e;
        e = f.Bm;
        return this.VGc.cz({
            wa: e.wa,
            qa: e.qa,
            status: f.response.status
        }, d.I.uh, false);
    }
    ;
    g.prototype.sZ = function(f, e) {
        var h, k;
        e = e(f);
        h = this.qCb(f);
        if (h === c.ds.LX || h === c.ds.Vla) {
            h = f.response;
            k = f.AFc;
            if (404 === h.status || 500 <= h.status)
                (h = k ? p.platform.time.fa() - k : 0,
                e.vaa = Math.max(0, this.nwa - h));
        }
        h = f.Bm.wa;
        f = f.Bm.stream.L.Al(true);
        h.G > f && (e.vaa = Math.max(e.vaa, h.G - f));
        return e;
    }
    ;
    return g;
}
)();
b.yfb =

// Detected exports: yfb
