/**
 * Netflix Cadmium Playercore - Module 42433
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 1481, 11479, 22365, 22816, 24066, 31276, 32687, 33096, 36129, 45146, 52569, 59219, 65630, 70834, 71501, 97996
 * Purpose: MSL protocol, Encryption/Decryption, Logging, Error handling
 */

// import dep_1481 from './Module_1481.js';
// import dep_11479 from './Module_11479.js';
// import dep_22365 from './Module_22365.js';
// import dep_22816 from './Module_22816.js';
// import dep_24066 from './Module_24066.js';
// import dep_31276 from './Module_31276.js';
// import dep_32687 from './Module_32687.js';
// import dep_33096 from './Module_33096.js';
// import dep_36129 from './Module_36129.js';
// import dep_45146 from './Module_45146.js';
// import dep_52569 from './Module_52569.js';
// import dep_59219 from './Module_59219.js';
// import dep_65630 from './Module_65630.js';
// import dep_70834 from './Module_70834.js';
// import dep_71501 from './Module_71501.js';
// import dep_97996 from './Module_97996.js';

// Webpack module 42433
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u;
d = a(59219);
p = a(1481);
c = a(33096);
g = a(52569);
t = a(36129);
f = a(31276);
e = a(70834);
h = a(45146);
k = a(32687);
l = a(22365);
b = a(11479);
m = a(24066);
n = a(71501);
q = a(97996);
r = a(22816);
u = a(65630);
f.Za.get(b.vk).register(t.ea.reb, function(v) {
    var B;
    function w() {
        return p.wp.wj;
    }
    function x(C) {
        var D;
        D = f.Za.get(n.SP);
        f.Za.get(q.J7)().then(function(E) {
            var F, H, J, M;
            function G(K) {
                var L;
                L = {
                    tokendata: "",
                    signature: ""
                };
                L.tokendata = (0,
                f.AD)(K.Ir);
                L.signature = (0,
                f.AD)(K.cl);
                return L;
            }
            F = E.KT.xzc(D);
            H = F.qp;
            J = F.mc;
            F = F.vg;
            M = E.KT.kN.Og;
            J && F && H ? ((0,
            h.ta)(H),
            E = ["1", (0,
            f.AD)(JSON.stringify(G(J))), (0,
            f.AD)(JSON.stringify(G(F)))].join(),
            C({
                success: true,
                cryptoContext: {
                    cTicket: E,
                    encrypt: function(K, L) {
                        K = (0,
                        k.Ri)(K) ? (0,
                        f.n5)(K) : K;
                        H.encrypt(K, M, u.YC.JSON, {
                            result: function(O) {
                                O = (0,
                                f.AD)(O);
                                L({
                                    success: true,
                                    mslEncryptionEnvelopeBase64: O
                                });
                            },
                            error: function(O) {
                                (0,
                                h.ta)(false, "Encrypt error: " + O);
                                L({
                                    success: false
                                });
                            }
                        });
                    },
                    decrypt: function(K, L) {
                        K = (0,
                        f.eH)(K);
                        H.decrypt(K, M, {
                            result: function(O) {
                                L({
                                    success: true,
                                    text: (0,
                                    f.Eia)(O)
                                });
                            },
                            error: function(O) {
                                (0,
                                h.ta)(false, "Decrypt error: " + O);
                                L({
                                    success: false
                                });
                            }
                        });
                    },
                    hmac: function(K, L) {
                        K = (0,
                        k.Ri)(K) ? (0,
                        f.n5)(K) : K;
                        H.sign(K, M, u.YC.JSON, {
                            result: function(O) {
                                L({
                                    success: true,
                                    hmacBase64: (0,
                                    f.AD)(O)
                                });
                            },
                            error: function(O) {
                                (0,
                                h.ta)(false, "Hmac error: " + O);
                                L({
                                    success: false
                                });
                            }
                        });
                    }
                }
            })) : ((0,
            h.ta)(false, "Must login first"),
            C({
                success: false
            }));
        });
    }
    function y(C, D) {
        var E;
        E = (0,
        f.eH)(C);
        C = E.subarray(32, 48);
        E = E.subarray(0, 32);
        if (16 != C.length || 32 != E.length)
            throw Error("Bad shared secret");
        Promise.all([(0,
        g.N2)(l.vo.importKey("raw", C, {
            name: "AES-CBC"
        }, false, ["encrypt", "decrypt"] /* encrypt */)), (0,
        g.N2)(l.vo.importKey("raw", E, {
            name: "HMAC",
            hash: {
                name: "SHA-256"
            }
        }, false, ["sign", "verify"] /* sign */))]).then(function(G) {
            D({
                success: true,
                cryptoContext: A(G[0], G[1])
            });
        }, function() {
            D({
                success: false
            });
        });
    }
    function A(C, D) {
        function E(G) {
            G = new e.Tja((0,
            f.eH)(G));
            G.hv();
            return {
                iv: G.hPb(),
                qrc: G.hPb()
            };
        }
        return {
            encrypt: function(G, F) {
                var H;
                G = (0,
                k.Ri)(G) ? (0,
                f.n5)(G) : G;
                H = l.jK.getRandomValues(new Uint8Array(16));
                (0,
                g.N2)(l.vo.encrypt({
                    name: "AES-CBC",
                    iv: H
                }, C, G)).then(function(J) {
                    var M, K;
                    J = new Uint8Array(J);
                    M = [];
                    K = new e.Tja(M);
                    K.Nz(2);
                    K.kYb(H);
                    K.kYb(J);
                    J = (0,
                    f.AD)(M);
                    F({
                        success: true,
                        encryptedDataAsn1Base64: J
                    });
                }, function(J) {
                    (0,
                    h.ta)(false, "Encrypt error: " + J);
                    F({
                        success: false
                    });
                });
            },
            decrypt: function(G, F) {
                var H;
                H = E(G);
                G = H.iv;
                H = H.qrc;
                (0,
                g.N2)(l.vo.decrypt({
                    name: "AES-CBC",
                    iv: G
                }, C, H)).then(function(J) {
                    J = new Uint8Array(J);
                    F({
                        success: true,
                        text: (0,
                        f.Eia)(J)
                    });
                }, function(J) {
                    (0,
                    h.ta)(false, "Decrypt error: " + J);
                    F({
                        success: false
                    });
                });
            },
            hmac: function(G, F) {
                G = (0,
                k.Ri)(G) ? (0,
                f.n5)(G) : G;
                (0,
                g.N2)(l.vo.sign({
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, D, G)).then(function(H) {
                    H = new Uint8Array(H);
                    F({
                        success: true,
                        hmacBase64: (0,
                        f.AD)(H)
                    });
                }, function(H) {
                    (0,
                    h.ta)(false, "Hmac error: " + H);
                    F({
                        success: false
                    });
                });
            }
        };
    }
    function z() {
        return (0,
        m.Thc)();
    }
    B = f.Za.get(r.AW);
    if (B.VFb || B.bua)
        d.fD.UQ.mdx = {
            getEsn: w,
            createCryptoContext: x,
            createCryptoContextFromSharedSecret: y,
            getServerEpoch: z
        };
    v(c.ai);
});

