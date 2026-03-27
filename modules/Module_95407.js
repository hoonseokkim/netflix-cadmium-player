/**
 * Netflix Cadmium Playercore - Module 95407
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 95407
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
p = a(91176);
t = (function(c) {
    function g(f, e) {
        f = c.call(this, f) || this;
        f.QA = e;
        f.name = "PlaybackError";
        return f;
    }
    d.__extends(g, c);
    g.Yzc = function(f) {
        var e, h, k;
        if (g.PYa(f))
            return null !== (h = null === (e = f.QA.context) || undefined === e ? undefined : e.type) && undefined !== h ? h : null === (k = f.QA.context) || undefined === k ? undefined : k.type;
    }
    ;
    g.Sba = function(f) {
        var e, h, k, l, m;
        if (g.PYa(f))
            return (f = null !== (h = null === (e = f.QA.context) || undefined === e ? undefined : e.error) && undefined !== h ? h : null === (k = f.QA.context) || undefined === k ? undefined : k.error,
            null !== (m = null !== (l = null === f || undefined === f ? undefined : f.edgeCode) && undefined !== l ? l : null === f || undefined === f ? undefined : f.code) && undefined !== m ? m : null === f || undefined === f ? undefined : f.code);
    }
    ;
    g.PYa = function(f) {
        return f && f.message && f.stack && f.QA ? "PlaybackError" === (null === f || undefined === f ? undefined : f.name) : false;
    }
    ;
    g.prototype.wy = function() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
            errorInformation: {
                category: this.QA.Cd,
                subCategory: this.QA.KAa,
                errorCode: this.QA.errorCode,
                context: p.VC.wy(this.QA.context)
            }
        };
    }
    ;
    return g;
}
)(Error);
export const bD = t;

// Detected exports: bD