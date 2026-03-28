/**
 * Netflix Cadmium Playercore - Module 12346
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: afb, Zja
 */

// Webpack module 12346
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
export const afb = b.Zja = undefined;
d = a(22970);  // import from Module_22970
p = a(2802);  // import from Module_02802
t = a(56707);  // import from Module_56707
c = a(1101);  // import from Module_01101
(function(f) {
    f[f.PSK = 0] = "PSK";
    f[f.MGK = 1] = "MGK";
}
)(g = b.Zja || (export const Zja = {}));
a = (function(f) {
    function e(h, k, l, m) {
        h = f.call(this, p.AleKeyxScheme.AUTH_DH, h, k, p.AleScheme.A128CBC_HS256_NRD) || this;
        h.voc = l;
        h.zSa = m;
        return h;
    }
    d.__extends(e, f);
    e.prototype.LVa = function() {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    return (h = this,
                    [4, this.crypto.Iuc()]);
                case 1:
                    return (h.IM = m.T(),
                    [4, this.crypto.qzb(this.IM)]);
                case 2:
                    return (k = m.T(),
                    this.bSc = this.wg.mZ(k),
                    l = {
                        scheme: p.AleKeyxScheme.AUTH_DH,
                        data: {
                            bjd: this.voc,
                            TOb: this.bSc
                        }
                    },
                    this.WBa ? (l.data.eN = p.K5.MLa,
                    l.data.WBa = this.WBa) : l.data.eN = this.zSa === g.zib ? p.K5.zib : p.K5.j9c,
                    [2, l]);
                }
            });
        });
    }
    ;
    e.prototype.f3a = function(h) {
        return d.__awaiter(this, undefined, undefined, function() {
            var k, l, m, n, q;
            return d.__generator(this, function(r) {
                switch (r.label) {
                case 0:
                    if (!this.IM)
                        throw Error("no key pair, did not call getKeyxRequestData()");
                    if (h.scheme !== p.AleKeyxScheme.AUTH_DH)
                        throw Error("incompatible key response scheme");
                    k = h.kid;
                    if (!e.kDc(h.data))
                        throw Error("invalid key response data");
                    l = h.data;
                    m = l.WBa;
                    n = l.TOb;
                    this.wg.$Q(n);
                    return [4, this.crypto.foc()];
                case 1:
                    return (q = r.T(),
                    this.WBa = m,
                    [2, c.Teb.create(this.crypto, this.wg, k, q.lTa, q.jM)]);
                }
            });
        });
    }
    ;
    e.kDc = function(h) {
        return "object" === typeof h && ("wrapdata"in h) && "string" === typeof h.wrapdata && ("pubkey"in h) && "string" === typeof h.pubkey;
    }
    ;
    return e;
}
)(t.Gka);
b.afb =

// Detected exports: afb, Zja
