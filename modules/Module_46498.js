/**
 * Netflix Cadmium Playercore - Module 46498
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: iab
 */

// Webpack module 46498
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.$tb = export const iab = undefined;
d = a(22970);  // import from Module_22970
t = (function() {
    function c(g) {
        var f;
        f = g.SHb;
        f = undefined === f ? p : f;
        this.ma = g.ma;
        this.SHb = f;
    }
    c.prototype.lH = function(g) {
        var f, k, l;
        try {
            for (var e = d.__values(this.SHb), h = e.next(); !h.done; h = e.next()) {
                k = h.value;
                l = k(this.ma, g);
                if (l)
                    return {
                        lU: false,
                        reason: l
                    };
            }
        } catch (n) {
            var m;
            m = {
                error: n
            };
        } finally {
            try {
                h && !h.done && (f = e.return) && f.call(e);
            } finally {
                if (m)
                    throw m.error;
            }
        }
        return {
            lU: true,
            reason: undefined
        };
    }
    ;
    return c;
}
)();
export const iab = t;
b.$tb = function(c, g) {
    g = c.zn(g);
    c = c.Psa();
    if (g >= c)
        return "targetBufferDurationLimit";
}
;
p = [b.$t

// Detected exports: iab
