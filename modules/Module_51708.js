/**
 * Netflix Cadmium Playercore - Module 51708
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 51708
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.Ueb = void 0;
d = a(22970);
t = a(44191);
p = a(1084);
c = a(2802);
a = (function(g) {
    function f(e, h, k, l) {
        e = g.call(this, c.AleScheme.A128GCM, e, h, k, 12) || this;
        e.key = l;
        return e;
    }
    d.__extends(f, g);
    f.create = function(e, h, k, l) {
        if ("AES-GCM" !== l.algorithm)
            throw Error("invalid AES-GCM key");
        return new f(e,h,k,l);
    }
    ;
    f.prototype.Qxb = function(e, h, k) {
        return d.__awaiter(this, void 0, void 0, function() {
            var l, m, n, q;
            return d.__generator(this, function(r) {
                switch (r.label) {
                case 0:
                    return (r.ac.push([0, 2, , 3]),
                    [4, this.crypto.Cbc(this.key, k, h, e)]);
                case 1:
                    return (l = r.T(),
                    [3, 3]);
                case 2:
                    throw (r.T(),
                    Error("Internal encrypt error: Cipher job failed"));
                case 3:
                    return (m = l.byteLength - 16,
                    n = (0,
                    p.SY)(l, 0, m),
                    q = (0,
                    p.SY)(l, m),
                    [2, {
                        rH: n,
                        tag: q
                    }]);
                }
            });
        });
    }
    ;
    f.prototype.Pxb = function(e, h, k, l) {
        return d.__awaiter(this, void 0, void 0, function() {
            var m;
            return d.__generator(this, function(n) {
                switch (n.label) {
                case 0:
                    (m = this.Etb([k, l]),
                    n.label = 1);
                case 1:
                    return (n.ac.push([1, 3, , 4]),
                    [4, this.crypto.Bbc(this.key, e, h, m)]);
                case 2:
                    return [2, n.T()];
                case 3:
                    throw (n.T(),
                    Error("Internal decrypt error: Cipher job failed"));
                case 4:
                    return [2];
                }
            });
        });
    }
    ;
    return f;
}
)(t.eGa);
b.Ueb = a;


// Detected exports: Ueb