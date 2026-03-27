/**
 * Netflix Cadmium Playercore - Module 91056
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 91056
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(75589);
t = a(72905);
c = p.RHa;
t = (function(g) {
    function f() {
        return null !== g && g.apply(this, arguments) || this;
    }
    d.__extends(f, g);
    f.prototype.parse = function() {
        this.oi();
        this.fileSize = this.N.Am();
        this.O = this.N.Am();
        this.duration = this.N.Am(!1, !0);
        this.NLc = this.N.Am();
        this.N.Am();
        this.RLc = this.N.Am();
        this.RKc = this.N.dc();
        this.OLc = this.N.Am();
        this.Otc = this.N.dc();
        this.N.Mya();
        this.Tp = {
            moof: {
                offset: this.NLc
            },
            sidx: {
                offset: this.OLc,
                size: this.Otc
            }
        };
        this.Tp[p.qhb] = {
            offset: this.RLc,
            size: this.RKc
        };
        this.N.offset - this.startOffset <= this.length - 24 && (this.QLc = this.N.Am(),
        this.tKc = this.N.dc(),
        this.PLc = this.N.Am(),
        this.sKc = this.N.dc(),
        this.Tp[p.ala] = {
            offset: this.QLc,
            size: this.tKc
        },
        this.Tp[p.$ka] = {
            offset: this.PLc,
            size: this.sKc
        });
        return !0;
    }
    ;
    f.Ae = c;
    f.Fd = !1;
    return f;
}
)(t.Kf);
b["default"] = t;
