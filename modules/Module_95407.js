/**
 * Netflix Cadmium Playercore - Module 95407
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 95407
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.bD = void 0;
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
            return null !== (h = null === (e = f.QA.context) || void 0 === e ? void 0 : e.type) && void 0 !== h ? h : null === (k = f.QA.context) || void 0 === k ? void 0 : k.type;
    }
    ;
    g.Sba = function(f) {
        var e, h, k, l, m;
        if (g.PYa(f))
            return (f = null !== (h = null === (e = f.QA.context) || void 0 === e ? void 0 : e.error) && void 0 !== h ? h : null === (k = f.QA.context) || void 0 === k ? void 0 : k.error,
            null !== (m = null !== (l = null === f || void 0 === f ? void 0 : f.edgeCode) && void 0 !== l ? l : null === f || void 0 === f ? void 0 : f.code) && void 0 !== m ? m : null === f || void 0 === f ? void 0 : f.code);
    }
    ;
    g.PYa = function(f) {
        return f && f.message && f.stack && f.QA ? "PlaybackError" === (null === f || void 0 === f ? void 0 : f.name) : !1;
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
b.bD = t;


// Detected exports: bD