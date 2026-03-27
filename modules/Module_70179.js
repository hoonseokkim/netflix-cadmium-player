/**
 * Netflix Cadmium Playercore - Module 70179
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 70179
// Parameters: t (module), b (exports), a (require)


var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.o8 = void 0;
d = a(22970);
p = a(81969);
c = a(93334);
g = a(66988);
t = (function(f) {
    function e(h, k, l, m, n) {
        h = f.call(this, h, k, l, m, n) || this;
        h.Nqa = !1;
        return h;
    }
    d.__extends(e, f);
    e.fRb = function(h) {
        return (h & 50331648) >>> 24;
    }
    ;
    e.gRb = function(h) {
        return !!((h & 65536) >>> 16);
    }
    ;
    Object.defineProperties(e.prototype, {
        Swb: {
            get: function() {
                return !!(this.flags & 1);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        qba: {
            get: function() {
                return !!(this.flags & 4);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        S3: {
            get: function() {
                return !!(this.flags & 256);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        T3: {
            get: function() {
                return !!(this.flags & 512);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        wza: {
            get: function() {
                return !!(this.flags & 1024);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        uza: {
            get: function() {
                return !!(this.flags & 2048);
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(e.prototype, {
        Ktc: {
            get: function() {
                return this.uza ? (this.N.offset = this.UA + this.dO - 4,
                0 === this.version ? this.N.dc() : this.N.Ufa()) : 0;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    e.prototype.parse = function(h) {
        var k, l, m;
        this.oi();
        this.EPa = this.N.offset;
        this.Vd = this.N.dc();
        this.zl = this.Swb ? this.N.Ufa() : 0;
        this.mUa = this.qba ? this.N.dc() : void 0;
        this.dO = (this.S3 ? 4 : 0) + (this.T3 ? 4 : 0) + (this.wza ? 4 : 0) + (this.uza ? 4 : 0);
        this.UA = this.N.offset;
        (0,
        c.assert)(this.Swb, "Expected data offset to be present in Track Run");
        (0,
        c.assert)(this.length - (this.N.offset - this.startOffset) === this.Vd * this.dO, "Expected remaining data in box to be sample information");
        if (h && h.Na) {
            h.Na.zl = this.zl;
            h.Na.Vd = this.Vd;
            this.Kl = [];
            m = null === (l = null === (k = this.parent) || void 0 === k ? void 0 : k.wn("tfhd")) || void 0 === l ? void 0 : l.Y4;
            for (k = 0; k < this.Vd; k++)
                (l = {},
                this.S3 ? l.R3 = this.N.dc() : h.Na.YD ? l.R3 = h.Na.YD : m && h.yh && h.yh[m] && (l.R3 = h.yh[m].YD),
                this.T3 ? l.iJ = this.N.dc() : h.Na ? l.iJ = h.Na.ZD : m && h.yh && h.yh[m] && (l.iJ = h.yh[m].ZD),
                this.wza ? l.vza = this.N.dc() : h.Na ? l.vza = h.Na.AH : m && h.yh && h.yh[m] && (l.vza = h.yh[m].AH),
                this.uza && (l.KVc = 0 === this.version ? this.N.dc() : this.N.Ufa()),
                0 === k && this.qba && (l.vza = this.mUa),
                this.Kl.push(l));
            h.Na.Kl = this.Kl;
            if (h.Na.eV)
                for (((0,
                c.assert)(h.Na.eV.length === h.Na.Kl.length, ("num fragment samples: ").concat(h.Na.Kl.length, ", ") + ("num samples in auxiliary info: ").concat(h.Na.eV.length)),
                m = 0); m < h.Na.Kl.length; m++)
                    (h.Na.Kl[m].QFa = h.Na.eV[m].QFa,
                    h.Na.Kl[m].O6a = h.Na.eV[m].O6a);
        }
        return !0;
    }
    ;
    e.prototype.wna = function(h, k, l) {
        var m, n, q;
        m = this.S3 ? this.N.dc() : h.YD;
        n = this.T3 ? this.N.dc() : h.ZD;
        h = this.wza ? this.N.dc() : h.AH;
        q = this.uza ? 0 === this.version ? this.N.dc() : this.N.Ufa() : 0;
        return {
            JVc: q,
            vza: h,
            iJ: n,
            R3: m,
            ykd: (l || 0) + q - (void 0 !== k ? k : q)
        };
    }
    ;
    e.prototype.ASc = function(h) {
        (0,
        c.assert)(void 0 !== this.zl);
        (0,
        c.assert)(void 0 !== this.UA);
        (0,
        c.assert)(void 0 !== this.Vd);
        (0,
        c.assert)(void 0 !== this.dO);
        if (!this.T3)
            return Array.from({
                length: this.Vd
            }, function() {
                return h.ZD;
            });
        for (var k = [], l = this.UA + (this.S3 ? 4 : 0), m = 0; m < this.Vd; (++m,
        l += this.dO))
            k.push(this.N.view.getUint32(l, !1));
        return k;
    }
    ;
    e.prototype.wSc = function() {
        var h, m;
        (0,
        c.assert)(void 0 !== this.zl);
        (0,
        c.assert)(void 0 !== this.UA);
        (0,
        c.assert)(void 0 !== this.Vd);
        (0,
        c.assert)(void 0 !== this.dO);
        h = [];
        if (this.wza)
            for (var k = this.UA + (this.S3 ? 4 : 0) + (this.T3 ? 4 : 0), l = 0; l < this.Vd; (++l,
            k += this.dO)) {
                m = this.N.view.getUint32(k, !1);
                2 !== e.fRb(m) && e.gRb(m) || h.push(l);
            }
        else
            !this.qba || 2 !== e.fRb(this.mUa) && e.gRb(this.mUa) || h.push(0);
        return h;
    }
    ;
    e.prototype.pa = function(h, k, l, m, n, q, r) {
        var u, v, w, x;
        (0,
        c.assert)(void 0 !== this.zl);
        (0,
        c.assert)(void 0 !== this.UA);
        (0,
        c.assert)(void 0 !== this.EPa);
        (0,
        c.assert)(void 0 !== this.Vd);
        (0,
        c.assert)(void 0 !== h.CA);
        u = 0;
        v = 0;
        this.Ec.offset = this.UA;
        for (m = 0; m < n; ++m) {
            w = this.wna(k, x, v);
            if (0 === m)
                x = w.JVc;
            u += w.iJ;
            v += w.R3;
        }
        m = n;
        n = this.N.offset;
        w = this.wna(k, x, v);
        this.X3a = r;
        this.l4 = m;
        this.qTb = v;
        if (r) {
            if ((this.bQb = this.zl + u,
            this.B3 = 0,
            m === this.Vd))
                return !0;
        } else if ((this.bQb = this.zl,
        this.B3 = u,
        0 === m))
            return !0;
        if (0 === m || m === this.Vd)
            return !1;
        this.Nqa = !0;
        if (r) {
            this.B3 += w.iJ;
            for (r = m + 1; r < this.Vd; ++r)
                (w = this.wna(k, x, v),
                this.B3 += w.iJ);
            this.Ec.offset = this.EPa;
            this.Vd = m;
            this.Ec.fo(this.Vd);
            this.Ec.d9a(q);
            this.qba && (this.N.offset += 4);
            this.xr(this.length - (n - this.startOffset), n);
        } else
            (k = n - this.UA,
            this.UA = n,
            this.Ec.offset = this.EPa,
            this.Vd -= m,
            this.Ec.fo(this.Vd),
            this.zl += u,
            this.Ec.d9a(q, this.zl),
            this.qba && (this.N.offset += 4),
            this.xr(k, this.Ec.offset));
        null === l || void 0 === l ? void 0 : l.xr(this.B3, h.CA + this.bQb);
        return !0;
    }
    ;
    e.prototype.WJc = function(h, k, l, m, n, q, r, u) {
        var v, x, y, A, z;
        void 0 === r && (r = !1);
        (0,
        c.assert)(void 0 !== this.zl);
        (0,
        c.assert)(void 0 !== this.UA);
        (0,
        c.assert)(void 0 !== this.Vd);
        (0,
        c.assert)(void 0 !== this.dO);
        (0,
        c.assert)(void 0 !== h.CA);
        for (var w = m.length; w < this.Vd; ++w)
            m[w] = m[w - 1];
        m.some(function(B) {
            return 0 >= B;
        }) && (x = null === (v = this.y8b(n, q)) || void 0 === v ? void 0 : v.iAa);
        this.N.offset = this.UA;
        h = h.CA + this.zl;
        n = -1 !== n.indexOf("xheaac") ? "xheaac" : -1 !== n.indexOf("heaac") ? "aac" : "ddp";
        q = new Uint8Array(this.N.view.buffer,this.N.view.byteOffset,this.N.view.byteLength);
        for (w = 0; w < this.Vd; ++w) {
            v = this.wna(k).iJ;
            if (-Infinity === m[w]) {
                if (x && this.T3) {
                    l.Yya(v, x, h);
                    y = this.dO - (this.S3 ? 4 : 0);
                    this.Ec.offset -= y;
                    this.Ec.fo(x.byteLength);
                    this.Ec.offset += y - 4;
                }
            } else if (0 > m[w])
                try {
                    A = q.subarray(h, h + v);
                    z = (0,
                    p.Bsc)({
                        Dd: n,
                        frame: A,
                        dH: m[w],
                        aV: r,
                        wT: u
                    }).ouc;
                    z !== v && this.N.console.error(("TrackRunBoxEditor: parse frame size error ").concat(z, " should be ").concat(v));
                } catch (B) {
                    this.N.console.error(("TrackRunBoxEditor: fadeFrame error: ").concat(B.message, " ").concat(B.stack));
                }
            h += v;
        }
    }
    ;
    e.prototype.y8b = function(h, k) {
        if ("string" === typeof k)
            return ((0,
            c.assert)("reset" !== k && "standard" !== k),
            g.VQ[k]);
        if (void 0 !== h)
            return k ? g.VQ.reset[h] || g.VQ.standard[h] : g.VQ.standard[h];
    }
    ;
    e.Ae = "trun";
    e.Fd = !1;
    return e;
}
)(a(72905).Kf);
b.o8 = t;


// Detected exports: o8