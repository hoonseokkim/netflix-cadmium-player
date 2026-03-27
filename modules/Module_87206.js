/**
 * Netflix Cadmium Playercore - Module 87206
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 87206
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(93334);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, n;
        this.Iic = this.N.ib(8);
        this.Euc = this.N.ib(2);
        this.Fuc = this.N.ib(1);
        this.Duc = this.N.ib(5);
        this.Cuc = this.N.ib(32);
        this.Auc = this.N.ib(48);
        this.Buc = this.N.ib(8);
        this.N.ib(4);
        this.MJc = this.N.ib(12);
        this.N.ib(6);
        this.fOc = this.N.ib(2);
        this.N.ib(6);
        this.phc = this.N.ib(2);
        this.N.ib(5);
        this.hec = this.N.ib(3);
        this.N.ib(5);
        this.gec = this.N.ib(3);
        this.Ldc = this.N.ib(16);
        this.Oic = this.N.ib(2);
        this.sLc = this.N.ib(3);
        this.R0c = this.N.ib(1);
        this.YFc = this.N.ib(2);
        if (null === f || void 0 === f ? 0 : f.yh) {
            for (var k = void 0, l = this.parent; l; ) {
                k = null === (h = null === (e = l.wn("tkhd")) || void 0 === e ? void 0 : e.Uc) || void 0 === h ? void 0 : h.trackId;
                if (void 0 !== k)
                    break;
                l = l.parent;
            }
            (0,
            p.assert)(void 0 !== k, "trackId is undefined");
            f = f.yh[k];
            f.By = {
                Hic: this.Iic,
                Hfd: this.Euc,
                Ifd: this.Fuc,
                Gfd: this.Duc,
                Ffd: this.Cuc,
                Dfd: this.Auc,
                Efd: this.Buc,
                pjd: this.MJc,
                dkd: this.fOc,
                Ycd: this.phc,
                ycd: this.hec,
                xcd: this.gec,
                rcd: this.Ldc,
                pdd: this.Oic,
                Njd: this.sLc,
                jmd: this.R0c,
                XFc: this.YFc
            };
            e = this.N.ib(8);
            for (h = 0; h < e; h++) {
                this.N.ib(1);
                this.N.ib(1);
                k = this.N.ib(6);
                l = this.N.ib(16);
                for (var m = 0; m < l; m++) {
                    n = this.N.ib(16);
                    n = this.N.KU(n);
                    switch (k) {
                    case 32:
                        f.By.AXb || (f.By.AXb = []);
                        f.By.AXb.push(n);
                        break;
                    case 33:
                        f.By.XRb || (f.By.XRb = []);
                        f.By.XRb.push(n);
                        break;
                    case 34:
                        f.By.ANb || (f.By.ANb = []);
                        f.By.ANb.push(n);
                        break;
                    case 39:
                    case 40:
                        (f.By.zUb || (f.By.zUb = []),
                        f.By.zUb.push(n));
                    }
                }
            }
        }
        return !0;
    }
    ;
    g.Ae = "hvcC";
    return g;
}
)(a(72905).Kf);
b["default"] = t;
