/**
 * Netflix Cadmium Playercore - Module 88501
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 88501
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.n7 = void 0;
d = a(22970);
t = a(44191);
p = a(1084);
a = (function(c) {
    function g(f, e, h, k, l, m) {
        f = c.call(this, f, e, h, k, 16) || this;
        if ("AES-CBC" !== l.algorithm)
            throw Error("invalid AES-CBC key");
        if ("HMAC-SHA256" !== m.algorithm)
            throw Error("invalid HMAC-SHA256 key");
        f.lTa = l;
        f.jM = m;
        return f;
    }
    d.__extends(g, c);
    g.prototype.Qxb = function(f, e, h) {
        return d.__awaiter(this, void 0, void 0, function() {
            var k, l;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    return (m.ac.push([0, 2, , 3]),
                    [4, this.crypto.Abc(this.lTa, h, f)]);
                case 1:
                    return (k = m.T(),
                    [3, 3]);
                case 2:
                    throw (m.T(),
                    Error("Internal encrypt error: Cipher job failed"));
                case 3:
                    return [4, this.avb(e, h, k)];
                case 4:
                    return (l = m.T(),
                    [2, {
                        rH: k,
                        tag: l
                    }]);
                }
            });
        });
    }
    ;
    g.prototype.Pxb = function(f, e, h, k) {
        return d.__awaiter(this, void 0, void 0, function() {
            var l;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    return [4, this.avb(e, f, h)];
                case 1:
                    l = m.T();
                    if (!this.i2c(k, l))
                        throw Error("JWE is untrusted");
                    m.label = 2;
                case 2:
                    return (m.ac.push([2, 4, , 5]),
                    [4, this.crypto.zbc(this.lTa, f, h)]);
                case 3:
                    return [2, m.T()];
                case 4:
                    throw (m.T(),
                    Error("Internal decrypt error: Cipher job failed"));
                case 5:
                    return [2];
                }
            });
        });
    }
    ;
    g.prototype.avb = function(f, e, h) {
        return d.__awaiter(this, void 0, void 0, function() {
            var k, l;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    (k = this.yic(f, e, h),
                    m.label = 1);
                case 1:
                    return (m.ac.push([1, 3, , 4]),
                    [4, this.crypto.GBc(this.jM, k)]);
                case 2:
                    return (l = m.T(),
                    [3, 4]);
                case 3:
                    throw (m.T(),
                    Error(g.tka));
                case 4:
                    return [2, (0,
                    p.SY)(l, 0, 16)];
                }
            });
        });
    }
    ;
    g.prototype.yic = function(f, e, h) {
        var k;
        k = this.s1c((8 * f.byteLength).valueOf());
        return this.Etb([f, e, h, k]);
    }
    ;
    g.prototype.s1c = function(f) {
        var e;
        e = new ArrayBuffer(8);
        e = new DataView(e);
        e.setUint32(4, f);
        e.setUint32(0, 0);
        return new Uint8Array(e.buffer);
    }
    ;
    g.prototype.i2c = function(f, e) {
        var h;
        h = !0;
        f.length !== e.length && (h = !1);
        for (var k = 0; k < f.length; k++)
            f[k] !== e[k] && (h = !1);
        return h;
    }
    ;
    g.tka = "Internal hmac error: Cipher job failed";
    g.Ddb = "invalid HMAC key";
    return g;
}
)(t.eGa);
b.n7 = a;


// Detected exports: n7