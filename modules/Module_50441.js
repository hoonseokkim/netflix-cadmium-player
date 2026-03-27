/**
 * Netflix Cadmium Playercore - Module 50441
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 50441
// Parameters: t (module), b (exports), a (require)


var g, f, e, h, k, l;
function d(m) {
    return "undefined" === typeof m ? !1 : m;
}
function p(m) {
    if (m && m.length) {
        if (k === b.Zb.hs || k === b.Zb.js)
            m = m.map(function(n) {
                return "wrap" == n ? "wrapKey" : "unwrap" == n ? "unwrapKey" : n;
            });
        return m;
    }
    return k === b.Zb.hs || k === b.Zb.js ? ("encrypt decrypt sign verify deriveKey wrapKey unwrapKey").split(" ") : ("encrypt decrypt sign verify deriveKey wrap unwrap").split(" ");
}
function c(m) {
    return m.then ? m : f.default.create(function(n, q) {
        m.oncomplete = function(r) {
            n(r.target.result);
        }
        ;
        m.onerror = function(r) {
            q(r);
        }
        ;
    });
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.hh = b.kXc = b.bXa = b.V5a = b.Zb = void 0;
t = a(22970);
g = a(11475);
f = t.__importDefault(a(90122));
e = a(69193);
h = t.__importDefault(a(69763));
b.Zb = {
    St: 1,
    Qx: 2,
    hs: 3,
    js: 4,
    Lx: 5,
    e2b: 3
};
k = b.Zb.e2b;
b.V5a = function(m) {
    k = m;
}
;
b.bXa = function() {
    return k;
}
;
if ("undefined" !== typeof Da)
    if (Da.msCrypto) {
        l = Da.msCrypto.subtle;
        k = b.Zb.St;
    } else if (Da.crypto)
        if (Da.crypto.L4c)
            (l = Da.crypto.L4c,
            k = b.Zb.js);
        else if (Da.crypto.subtle)
            l = Da.crypto.subtle;
        else
            throw new ReferenceError("Expected window.crypto.subtle but it was undefined. It may be unavailable if running in an insecure context.");
b.kXc = function(m) {
    l = m;
}
;
b.hh = {
    encrypt: function(m, n, q) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.encrypt(m, n, q),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    decrypt: function(m, n, q) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.decrypt(m, n, q),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    sign: function(m, n, q) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.sign(m, n, q),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    verify: function(m, n, q, r) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.verify(m, n, q, r),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    digest: function(m, n) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.digest(m, n),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    generateKey: function(m, n, q) {
        n = d(n);
        q = p(q);
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.generateKey(m, n, q),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    deriveKey: function(m, n, q, r, u) {
        r = d(r);
        u = p(u);
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.deriveKey(m, n, q, r, u),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    deriveBits: function(m, n, q) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            return (m = l.deriveBits(m, n, q),
            c(m));
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    importKey: function(m, n, q, r, u) {
        var v;
        r = d(r);
        u = p(u);
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.Lx:
            return (q = l.importKey(m, n, q, r, u),
            c(q));
        case b.Zb.js:
            if (m == g.kl.qK || m == g.kl.EX) {
                m = h.default.VXb(q);
                v = h.default.WXb(u);
                n = h.default.YQb(n, m, v, r);
                if (!n)
                    throw Error("Could not make valid JWK from DER input");
                n = JSON.stringify(n);
                q = l.importKey(g.kl.Eka, e.eD.Ed(n), q, r, u);
            } else
                q = l.importKey(m, n, q, r, u);
            return c(q);
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    exportKey: function(m, n) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.Lx:
            return (m = l.exportKey(m, n),
            c(m));
        case b.Zb.js:
            if (m == g.kl.qK || m == g.kl.EX)
                return (m = l.exportKey(g.kl.Eka, n),
                c(m).then(function(q) {
                    q = JSON.parse(e.eD.Be(new Uint8Array(q)));
                    q = h.default.XGb(q);
                    if (!q)
                        throw Error("Could not make valid DER from JWK input");
                    return q.xaa.buffer;
                }));
            m = l.exportKey(m, n);
            return c(m);
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
    },
    wrapKey: function(m, n, q, r) {
        switch (k) {
        case b.Zb.St:
        case b.Zb.Lx:
            m = l.wrapKey(n, q, r);
            break;
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
            m = l.wrapKey(m, n, q, r);
            break;
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
        return c(m);
    },
    unwrapKey: function(m, n, q, r, u, v, w) {
        switch (k) {
        case b.Zb.St:
            m = l.unwrapKey(n, u, q);
            break;
        case b.Zb.Qx:
        case b.Zb.hs:
        case b.Zb.js:
        case b.Zb.Lx:
            v = d(v);
            w = p(w);
            m = l.unwrapKey(m, n, q, r, u, v, w);
            break;
        default:
            throw Error("Unsupported Web Crypto version " + k + ".");
        }
        return c(m);
    }
};


// Detected exports: hh, kXc, bXa, V5a, Zb