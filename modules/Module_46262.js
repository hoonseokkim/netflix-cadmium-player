/**
 * Netflix Cadmium Playercore - Module 46262
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 46262
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Rjb = void 0;
t = (function() {
    function a(d, p, c, g, f, e, h, k) {
        var l, m;
        this.Z = d;
        this.Fl = p;
        this.groupId = c;
        this.WI = g;
        this.FU = f;
        this.gv = e;
        this.vp = h;
        c = null !== (m = null === (l = this.Fl.ma.Vb) || void 0 === l ? void 0 : l.G) && void 0 !== m ? m : p.ma.lI.G;
        this.nx = d.fi.get(p.M) ? 1 : this.Fl.ma.K.nx;
        this.GU = k.offset.G;
        this.x4 = Math.max(this.So - c, 0);
    }
    Object.defineProperties(a.prototype, {
        identifier: {
            get: function() {
                return this.Fl.M;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        mediaType: {
            get: function() {
                return this.Fl.mediaType;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        xh: {
            get: function() {
                return this.Fl.xh;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        se: {
            get: function() {
                return this.Z.se.value;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        So: {
            get: function() {
                return this.Fl.tJ.G;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        g0: {
            get: function() {
                return this.Fl.f0.G;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        th: {
            get: function() {
                return this.Fl.ma.Ob.G;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        Ly: {
            get: function() {
                return this.Fl.Ly();
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        Gp: {
            get: function() {
                return this.Fl.Gp();
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        Pk: {
            get: function() {
                return this.Fl.Pk;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        Vw: {
            get: function() {
                return this.Fl.Vw;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(a.prototype, {
        AA: {
            get: function() {
                return this.Fl.AA;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    a.prototype.lH = function(d, p) {
        var c;
        c = this.Fl.ma.lH(this.mediaType);
        return c.lU ? this.Z.bFc(this, d, p) : c;
    }
    ;
    a.prototype.FM = function() {
        return this.Z.FM(this);
    }
    ;
    a.prototype.toJSON = function() {
        return {
            mediaType: this.mediaType,
            dB: this.dB,
            xh: this.xh,
            se: this.se,
            gv: this.gv,
            So: this.So,
            vp: this.vp,
            g0: this.g0,
            GU: this.GU,
            WI: this.WI,
            FU: this.FU,
            nx: this.nx,
            th: this.th,
            x4: this.x4,
            groupId: this.groupId,
            Ly: this.Ly,
            Gp: this.Gp,
            Pk: this.Pk,
            identifier: this.identifier,
            Z: "playgraph Object",
            Fl: this.Fl
        };
    }
    ;
    return a;
}
)();
b.Rjb = t;


// Detected exports: Rjb