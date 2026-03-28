/**
 * Netflix Cadmium Playercore - Module 43124
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 43124
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;
b.$ic = function(n, q, r) {
    var w;
    function u() {
        return Promise.resolve().then(function() {
            return c.hh.generateKey(q, false, ["wrapKey", "unwrapKey"]  /* config: wrapKey = "unwrapKey" */);
        }).then(function(x) {
            return v(x.publicKey, x.privateKey);
        });
    }
    function v(x, y) {
        return Promise.all([new Promise(function(A, z) {
            new f.Cla(x,{
                result: A,
                error: function(B) {
                    z(new l.default(m.default.WC,"Unable to create keyx public key",B));
                }
            });
        }
        ), new Promise(function(A, z) {
            new e.kkb(y,{
                result: A,
                error: function(B) {
                    z(new l.default(m.default.WC,"Unable to create keyx private key",B));
                }
            });
        }
        )]).then(function(A) {
            return [new d.Ola("rsaKeypairId",r,A[0],A[1]), w ? {
                keyxPublicKey: x,
                keyxPrivateKey: y
            } : null];
        });
    }
    w = !n.systemKeyWrapFormat;
    return Promise.resolve().then(function() {
        var x, y;
        x = n.storeState;
        y = x && x.keyxPublicKey;
        x = x && x.keyxPrivateKey;
        return w && y && x ? v(y, x) : u();
    }).then(function(x) {
        var y, A, z;
        x = x[0];
        y = {};
        y[p.dG.NONE] = new h.gnb(new g.$Ha());
        A = new k.vLa(n.esn);
        z = [new d.D$a(new g.$Ha())];
        return {
            Krc: y,
            Jrc: A,
            rFc: z,
            DE: x,
            Blc: w ? u : undefined
        };
    });
}
;
d = a(93562);  // import from Module_93562
p = a(36332);  // import from Module_36332
c = a(50441);  // import from Module_50441
g = a(18461);  // import from Module_18461
f = a(42486);  // import from Module_42486
e = a(36911);  // import from Module_36911
h = a(28296);  // import from Module_28296
k = a(2479);  // import from Module_02479
l = a(1966);  // import from Module_01966
m = a(3611

