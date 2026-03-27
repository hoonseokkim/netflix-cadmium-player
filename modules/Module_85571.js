/**
 * Netflix Cadmium Playercore - Module 85571
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 85571
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function(g) {
        var f;
        this.oi();
        f = 1 === this.version ? [{
            creationTime: "int64"
        }, {
            modificationTime: "int64"
        }, {
            trackId: "int32"
        }, {
            offset: 32,
            type: "offset"
        }, {
            duration: "int64"
        }] : [{
            creationTime: "int32"
        }, {
            modificationTime: "int32"
        }, {
            trackId: "int32"
        }, {
            offset: 32,
            type: "offset"
        }, {
            duration: "int32"
        }];
        f = f.concat({
            offset: 64,
            type: "offset"
        }, {
            Ohd: "int16"
        }, {
            Sbd: "int16"
        }, {
            volume: "int16"
        }, {
            offset: 16,
            type: "offset"
        }, {
            offset: 288,
            type: "offset"
        }, {
            width: "int32"
        }, {
            height: "int32"
        });
        this.Uc = this.qF(f);
        this.Uc.Gmd = !!(this.flags & 1);
        this.Uc.Hmd = !!(this.flags & 2);
        this.Uc.Imd = !!(this.flags & 4);
        this.Uc.Jmd = !!(this.flags & 8);
        if (null === g || void 0 === g ? 0 : g.ce)
            (g.ce.width = this.Uc.width / 65536,
            g.ce.height = this.Uc.height / 65536);
        g && g.yh && (g.yh[this.Uc.trackId] = {});
        return !0;
    }
    ;
    c.Ae = "tkhd";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
