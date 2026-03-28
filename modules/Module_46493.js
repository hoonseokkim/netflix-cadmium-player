/**
 * @module Module_46493
 * @description ES module
 * @categories DRM, Crypto, Network, ABR, MSL, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 46493
 * Deobfuscated size: 20178 chars
 * Functions: 39
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 46493
{
                        var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        d = a(22970);
                        p = a(62807);
                        c = a(80824);
                        g = a(50040);
                        f = a(1481);
                        e = a(29204);
                        h = a(33096);
                        k = a(36129);
                        l = a(45146);
                        m = a(31276);
                        n = a(77134);
                        q = a(63156);
                        r = a(17892);
                        u = a(3887);
                        v = a(22365);
                        w = a(52569);
                        x = a(45842);
                        y = a(5021);
                        t = a(11479);
                        A = a(50681);
                        z = a(59219);
                        B = a(32934);
                        C = a(71501);
                        D = a(65799);
                        E = a(8129);
                        G = {};
                        F = m.Za.get(t.vk);
                        F.register(k.ea.leb, function(H) {
                            var L, O, I, N, Q, S, T, U, X, Y, da;
                            function J(ba) {
                                var aa;
                                ba && ba.userList && e.config.BYc && (ba.userList = []);
                                aa = new p.Jnb();
                                c.NHa.ef(aa);
                                ba = {
                                    esn: f.wp.wj,
                                    esnPrefix: f.wp.zu,
                                    authenticationKeyNames: e.config.Ddc,
                                    systemKeyWrapFormat: e.config.E0c,
                                    serverIdentityId: "MSL_TRUSTED_NETWORK_SERVER_KEY",
                                    serverIdentityKeyData: Y,
                                    storeState: ba,
                                    notifyMilestone: F.qg.bind(F),
                                    log: I,
                                    ErrorSubCodes: {
                                        MSL_REQUEST_TIMEOUT: k.Y.rgb,
                                        MSL_READ_TIMEOUT: k.Y.qgb
                                    }
                                };
                                (0,
                                D.Ulc)(ba, {
                                    result: function(ca) {
                                        M(ca);
                                    },
                                    timeout: function() {
                                        H({
                                            Ya: k.Y.pgb
                                        });
                                    },
                                    error: function(ca) {
                                        H(K(k.Y.pgb, undefined, ca));
                                    }
                                });
                            }
                            function M(ba) {
                                var ca, ea, R;
                                function aa() {
                                    X && m.Za.get(r.PJ).create().then(function(P) {
                                        return P.save(S, R, false);
                                    }).catch(function(P) {
                                        I.error("Error persisting msl store", (0,
                                        k.eG)(P));
                                    });
                                }
                                ca = this;
                                ea = m.Za.get(x.uK)((0,
                                y.pc)(100));
                                Q && ba.xac(function(P) {
                                    R = P.w_c;
                                    ea.tg(aa);
                                });
                                (0,
                                u.Qf)(G, {
                                    Vgd: function() {
                                        U = true;
                                    },
                                    send: function(P) {
                                        function V() {
                                            var Z, fa;
                                            Z = P.kN;
                                            fa = {
                                                method: P.method,
                                                nonReplayable: P.z0a,
                                                encrypted: P.ry,
                                                userId: P.F8a,
                                                body: P.body,
                                                timeout: 2 * P.timeout,
                                                url: new E.Xdb(P),
                                                allowTokenRefresh: X,
                                                sendUserAuthIfRequired: da,
                                                shouldSendUserAuthData: e.config.MYc
                                            };
                                            Z.email ? (fa.email = Z.email,
                                            fa.password = Z.password || "") : U && (fa.useNetflixUserAuthData = true);
                                            return fa;
                                        }
                                        return new Promise(function(Z, fa) {
                                            var la;
                                            la = V();
                                            ba.send(la).then(function(ka) {
                                                U && (U = false);
                                                Z({
                                                    body: ka.body,
                                                    headers: ka.headers
                                                });
                                            }).catch(function(ka) {
                                                ka.error ? fa(K(ka.error.cadmiumResponse && ka.error.cadmiumResponse.Ya ? ka.error.cadmiumResponse.Ya : ba.NDc(ka.error) ? k.Y.ogb : ba.MDc(ka.error) ? k.Y.T2b : k.Y.S2b, ba.Sba(ka.error), ka.error)) : (I.error("Unknown MSL error", ka),
                                                ka.subCode = ka.subCode,
                                                fa({
                                                    Ya: ka.subCode ? ka.subCode : k.Y.Y2b
                                                }));
                                            });
                                        }
                                        );
                                    },
                                    KT: ba
                                });
                                z.fD.UQ.mslFetch = function(P, V) {
                                    return d.__awaiter(ca, undefined, undefined, function fa() {
                                        var la, ka, sa;
                                        return Va(fa, function(qa) {
                                            if (1 == qa.et)
                                                return (la = m.Za.get(C.SP),
                                                fb(qa, G.send({
                                                    kN: {
                                                        Je: m.Za.get(B.Sz),
                                                        profile: la
                                                    },
                                                    timeout: 8E3,
                                                    url: P.toString(),
                                                    body: null === V || undefined === V ? undefined : V.body,
                                                    headers: {
                                                        "Content-Encoding": "msl_v1",
                                                        "Content-Type": "application/json"
                                                    },
                                                    F8a: la,
                                                    fQb: false,
                                                    z0a: true,
                                                    ry: true
                                                }), 2));
                                            ka = qa.tW;
                                            sa = {
                                                get body() {
                                                    this.bodyUsed = true;
                                                    return ka.body;
                                                }
                                            };
                                            return qa.return((sa.bodyUsed = false,
                                            sa.ok = true,
                                            sa.status = 200,
                                            sa.statusText = "OK",
                                            sa.type = "basic",
                                            sa.url = P.toString(),
                                            sa.headers = new Headers(ka.headers),
                                            sa.text = function() {
                                                return Promise.resolve(this.body);
                                            }
                                            ,
                                            sa.json = function() {
                                                return Promise.resolve(JSON.parse(this.body));
                                            }
                                            ,
                                            sa.arrayBuffer = function() {
                                                return Promise.resolve(new Uint8Array(this.body));
                                            }
                                            ,
                                            sa.clone = function() {
                                                return Object.assign({}, this);
                                            }
                                            ,
                                            sa.blob = function() {
                                                return this.arrayBuffer().then(function(wa) {
                                                    return new Blob([wa]);
                                                });
                                            }
                                            ,
                                            sa.formData = function() {
                                                throw Error("Not implemented");
                                            }
                                            ,
                                            sa.redirected = false,
                                            sa));
                                        });
                                    });
                                }
                                ;
                                z.fD.UQ.sendSecure = function(P) {
                                    var V;
                                    V = m.Za.get(C.SP);
                                    return G.send({
                                        kN: {
                                            Je: m.Za.get(B.Sz),
                                            profile: V
                                        },
                                        timeout: P.timeout || 8E3,
                                        url: P.url,
                                        body: P.body,
                                        headers: Object.assign(Object.assign({}, P.headers), {
                                            "Content-Encoding": "msl_v1",
                                            "Content-Type": "application/json"
                                        }),
                                        F8a: V,
                                        fQb: false,
                                        z0a: true,
                                        ry: true
                                    }).then(function(Z) {
                                        return {
                                            ok: true,
                                            status: 200,
                                            code: 200,
                                            statusText: "OK",
                                            headers: new Headers(Z.headers),
                                            body: Z.body
                                        };
                                    }).catch(function(Z) {
                                        var fa, la, ka;
                                        fa = Z.Rq;
                                        la = Z.statusText;
                                        ka = Object.assign(Object.assign({}, Z.error), {
                                            content: Z.Urc
                                        });
                                        Z = new Headers(Z.headers);
                                        return {
                                            ok: false,
                                            status: fa,
                                            code: fa,
                                            statusText: la,
                                            headers: Z,
                                            body: JSON.stringify(ka)
                                        };
                                    });
                                }
                                ;
                                H(h.ai);
                                m.Za.get(A.MHa).nKc(G);
                            }
                            function K(ba, aa, ca) {
                                var ea, R, P, V;
                                P = {
                                    Ya: ba,
                                    hra: aa
                                };
                                if (ca) {
                                    V = function(Z) {
                                        var fa;
                                        Z = Z || "" + ca;
                                        if (ca.stack) {
                                            fa = "" + ca.stack;
                                            Z = 0 <= fa.indexOf(Z) ? fa : Z + fa;
                                        }
                                        return Z;
                                    }
                                    ;
                                    if (R = ca.cadmiumResponse) {
                                        if (ea = R.Yg && R.Yg.toString())
                                            R.Yg = ea;
                                        R.Ya = ba;
                                        R.hra = aa;
                                        R.Urc = R.Cf;
                                        R.Cf = V(ca.message);
                                        R.error = {
                                            subCode: ba,
                                            extCode: ea,
                                            JI: aa,
                                            data: ca.cause,
                                            message: ca.message
                                        };
                                        return R;
                                    }
                                    V = V(ca.errorMessage);
                                    ea = (0,
                                    u.wm)(ca.$ca) || (0,
                                    u.wm)(ca.error && ca.error.$ca);
                                    R = undefined !== ca.Zaa ? (0,
                                    w.DLb)(ca.Zaa) : undefined;
                                }
                                V && (P.Cf = V);
                                ea && (P.Yg = ea);
                                P.error = {
                                    subCode: ba,
                                    extCode: ea.toString(),
                                    JI: aa,
                                    data: R,
                                    message: V
                                };
                                return P;
                            }
                            (0,
                            l.ta)(e.config);
                            if (v.jK && v.vo && v.vo.unwrapKey) {
                                L = m.Za.get(n.ZX);
                                O = q.zv.jo;
                                I = (0,
                                m.An)("Msl");
                                N = e.config.jKc;
                                Q = e.config.lKc;
                                S = e.config.bE ? "mslstoretest" : "mslstore";
                                T = g.BV.bSb;
                                U = true;
                                X = !T || T.success;
                                Y = (0,
                                m.eH)(e.config.bE ? "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm84o+RfF7KdJgbE6lggYAdUxOArfgCsGCq33+kwAK/Jmf3VnNo1NOGlRpLQUFAqYRqG29u4wl8fH0YCn0v8JNjrxPWP83Hf5Xdnh7dHHwHSMc0LxA2MyYlGzn3jOF5dG/3EUmUKPEjK/SKnxeKfNRKBWnm0K1rzCmMUpiZz1pxgEB/cIJow6FrDAt2Djt4L1u6sJ/FOy/zA1Hf4mZhytgabDfapxAzsks+HF9rMr3wXW5lSP6y2lM+gjjX/bjqMLJQ6iqDi6++7ScBh0oNHmgUxsSFE3aBRBaCL1kz0HOYJe26UqJqMLQ71SwvjgM+KnxZvKa1ZHzQ+7vFTwE7+yxwIDAQAB" : "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlibeiUhffUDs6QqZiB+jXH/MNgITf7OOcMzuSv4G3JysWkc0aPbT3vkCVaxdjNtw50zo2Si8I24z3/ggS3wZaF//lJ/jgA70siIL6J8kBt8zy3x+tup4Dc0QZH0k1oxzQxM90FB5x+UP0hORqQEUYZCGZ9RbZ/WNV70TAmFkjmckutWN9DtR6WUdAQWr0HxsxI9R05nz5qU2530AfQ95h+WGZqnRoG0W6xO1X05scyscNQg0PNCy3nfKBG+E6uIl5JB4dpc9cgSNgkfAIeuPURhpD0jHkJ/+4ytpdsXAGmwYmoJcCSE1TJyYYoExuoaE8gLFeM01xXK5VINU7/eWjQIDAQAB");
                                da = !!e.config.l5a;
                                m.Za.get(r.PJ).create().then(function(ba) {
                                    N ? ba.remove(S).then(function() {
                                        J();
                                    }).catch(function(aa) {
                                        I.error("Unable to delete MSL store", (0,
                                        k.eG)(aa));
                                        J();
                                    }) : Q ? ba.load(S).then(function(aa) {
                                        L.mark(O.V2b);
                                        J(aa.value);
                                    }).catch(function(aa) {
                                        aa.Ya == k.Y.tG ? (L.mark(O.X2b),
                                        J()) : (I.error("Error loading msl store", (0,
                                        k.eG)(aa)),
                                        L.mark(O.W2b),
                                        ba.remove(S).then(function() {
                                            J();
                                        }).catch(function(ca) {
                                            H(ca);
                                        }));
                                    }) : J();
                                }).catch(function(ba) {
                                    I.error("Error creating app storage while loading msl store", (0,
                                    k.eG)(ba));
                                    H(ba);
                                });
                            } else
                                H({
                                    Ya: k.Y.U2b
                                });
                        });
                    }
