/**
 * Netflix Cadmium Playercore - Module 5180
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Mab
 * Dependencies: 5021, 17612, 22210, 46286, 56800
 * Purpose: Video handling, Encryption/Decryption, Logging, Configuration
 */

// import dep_5021 from './Module_5021.js';
// import dep_17612 from './Module_17612.js';
// import dep_22210 from './Module_22210.js';
// import dep_46286 from './Module_46286.js';
// import dep_56800 from './Module_56800.js';

// Webpack module 5180
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
class d extends p.oP {
    constructor(h, k, l, m, n, q, r) {
    h = p.oP.call(this, h, k, l, r) || this;
    h.bv = m;
    h.Qw = n;
    h.Qa = q;
    h.DI = r;
    h.type = c.ks.PW;
    h.log = h.Qw.zb("ChromeVideoCapabilityDetector");
    return h;
}
    FV(h) {
    switch (h) {
    case c.Jx.FP:
        return this.q0c;
    default:
        return Promise.resolve(false);
    }
}
    hca() {
    var h;
    h = this;
    return this.FV(c.Jx.FP).then(function(k) {
        return k ? c.Jx.FP : undefined;
    }).then(function(k) {
        return h.Ppa(k);
    });
}
    wOa(h) {
    this.VB = h;
}
    EWb() {
    var h;
    if (this.VB) {
        h = this.BEb && this.CEb && this.BEb.da(this.CEb).na(g.Ba);
        this.VB.itshdcp = JSON.stringify({
            hdcp2: this.hB,
            time2: h
        });
    }
}
    VYa(h) {
    var k;
    k = this;
    return this.bv.ZH().then(function(l) {
        l = e.wb.g1(l.Oy);
        return [f.xe.Jf, f.xe.fja].some(function(m) {
            return m.test(h);
        }) && k.config().rJc && l || f.xe.SYb.test(h) && !f.xe.pGa.test(h) && !k.config().qqc && l || f.xe.c1b.test(h) && !f.xe.pGa.test(h) && !k.config().Iqc && l ? {
            supported: false,
            reason: "mcclearen-restricted"
        } : !l && f.xe.wFa.test(h) || f.xe.N0b.test(h) && !(k.config().Eqc || k.config().Dqc && l) || f.xe.Vmb.test(h) && !l ? {
            supported: false,
            reason: "robustness-restricted"
        } : {
            supported: true
        };
    });
}
}
p = a(46286);
c = a(56800);
g = a(5021);
f = a(22210);
e = a(17612);
Ha.Object.defineProperties(d.prototype, {
    q0c: {
        configurable: true,
        enumerable: true,
        get: function() {
            var h;
            h = this;
            this.Y6a || (this.config().Hqc ? this.Y6a = this.bv.ZH().then(function(k) {
                if (!e.wb.g1(k.Oy))
                    return (h.hB = "not HW_SECURE_ALL",
                    h.log.trace("hdcpStatus: " + h.hB),
                    false);
                h.CEb = h.Qa.Hg;
                return k.createMediaKeys().then(function(l) {
                    if (l.getStatusForPolicy)
                        return l.getStatusForPolicy({
                            minHdcpVersion: "2.2"
                        }).then(function(m) {
                            h.BEb = h.Qa.Hg;
                            h.hB = m;
                            h.log.trace("hdcpStatus: " + h.hB);
                            return "usable" === h.hB;
                        });
                    h.hB = "not available";
                    h.log.trace("hdcpStatus: " + h.hB);
                    return false;
                });
            }).catch(function(k) {
                h.hB = "exception";
                h.log.error("Exception in supportsHdcpLevel", {
                    hdcpStatus: h.hB
                }, k);
                return false;
            }).then(function(k) {
                h.EWb();
                return k;
            }) : (this.hB = "not enabled",
            this.log.trace("hdcpStatus: " + this.hB),
            this.EWb(),
            this.Y6a = Promise.resolve(false)));
            return this.Y6a;
        }
    }
});
export const Mab = d;

// Detected exports: Mab
