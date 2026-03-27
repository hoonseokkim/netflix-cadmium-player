/**
 * Netflix Cadmium Playercore - Module 96837
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 96837
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperty(b, "__esModule", {
    value: !0
});
b.GDc = b.wEc = b.XDc = b.af = void 0;
b.af = {
    bja: {
        name: "AES-KW"
    },
    XO: {
        name: "AES-CBC"
    },
    r0b: {
        name: "ECDH"
    },
    D_b: {
        name: "DH"
    },
    fX: {
        name: "HMAC",
        hash: {
            name: "SHA-256"
        }
    },
    rG: {
        name: "RSA-OAEP",
        hash: {
            name: "SHA-1"
        }
    },
    Kla: {
        name: "RSAES-PKCS1-v1_5"
    },
    F5b: {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
            name: "SHA-1"
        }
    },
    l9a: {
        name: "AES-CMAC"
    },
    s0b: {
        name: "ECDSA",
        hash: {
            name: "SHA-256"
        }
    },
    G5b: {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
            name: "SHA-1"
        }
    },
    X7: {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
            name: "SHA-256"
        }
    },
    R5c: {
        name: "NFLX-DH"
    },
    ead: {
        name: "SHA-256"
    },
    fad: {
        name: "SHA-384"
    }
};
b.XDc = function(a) {
    return "HMAC" == a.name;
}
;
b.wEc = function(a) {
    switch (a.name) {
    case b.af.rG.name:
    case b.af.Kla.name:
    case b.af.F5b.name:
    case b.af.G5b.name:
    case b.af.X7.name:
        return !0;
    default:
        return !1;
    }
}
;
b.GDc = function(a) {
    switch (a.name) {
    case b.af.r0b.name:
    case b.af.s0b.name:
        return !0;
    default:
        return !1;
    }
}
;


// Detected exports: GDc, wEc, XDc, af