/**
 * @module Module_18797
 * @description Class/prototype module
 * @categories DRM, Network, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 18797
 * Deobfuscated size: 19186 chars
 * Functions: 39
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 18797
{
                        var r, u, v, w, x, y, A, z, B;
                        function d(C, D) {
                            var E, G;
                            E = this;
                            G = C.styles || ({});
                            return {
                                startTime: D.startTime,
                                id: D.id,
                                endTime: D.endTime,
                                displayTime: D.displayTime,
                                duration: D.duration,
                                blocks: D.blocks.map(function(F) {
                                    var H;
                                    H = x.hmc(C, F);
                                    return {
                                        textNodes: F.textNodes.map(q.bind(E, G)),
                                        region: H,
                                        id: F.id
                                    };
                                })
                            };
                        }
                        function p(C) {
                            if (!Array.isArray(C))
                                throw Error("last called on non-array: " + C);
                            return C[C.length - 1];
                        }
                        function c(C, D) {
                            var E, G, F, H, J, M;
                            E = v.We(true);
                            G = {};
                            F = [];
                            H = null;
                            J = [];
                            M = {};
                            E.onerror = function(K) {
                                D(K, null);
                            }
                            ;
                            E.onend = function() {
                                D(null, G);
                            }
                            ;
                            E.onclosetag = function() {
                                F.pop();
                            }
                            ;
                            E.onopentag = function(K) {
                                var L, O, I, N;
                                L = K.attributes;
                                O = K.name;
                                I = G.regions;
                                N = G.styles;
                                F.push(K);
                                if ("tt" === O)
                                    G = l(L);
                                else if ("body" === O)
                                    "undefined" !== typeof L.style && (G.defaultStyle = L.style,
                                    J.push(L.style));
                                else if ("initial" === O && n(F, "styling"))
                                    (M = m(L, y),
                                    G.initialStyle = M);
                                else if ("style" === O && n(F, "styling")) {
                                    I = L["xml:id"];
                                    K = M;
                                    L = m(L, y);
                                    if (Object.keys(K).length)
                                        for (var Q in K)
                                            "undefined" === typeof L[Q] && (L[Q] = K[Q]);
                                    N[I] = L;
                                } else
                                    "style" === O && n(F, "region") ? (N = Object.keys(L)[0],
                                    "string" === typeof N && (I[H][N.slice(4)] = L[N])) : "region" === O && n(F, "layout") && (H = L["xml:id"],
                                    I[H] = m(L, z));
                            }
                            ;
                            setTimeout(function() {
                                var K;
                                for (E.write(C); 0 < F.length && !E.error; ) {
                                    K = p(F).name;
                                    E.write("</" + K + ">");
                                }
                                E.close();
                            }, 10);
                        }
                        function g(C, D) {
                            var E;
                            E = C.filter(function(G) {
                                return G.startTime <= D && D <= G.endTime;
                            });
                            C = C.filter(function(G) {
                                return G.startTime > D;
                            });
                            return 0 < C.length ? E.concat([C[0]]) : E;
                        }
                        function f() {}
                        function e(C) {
                            var D, E;
                            D = C.yd;
                            E = C.va;
                            if (!C.xml && !C.request)
                                throw Error("FullTextStream requires either a 'request' function or the 'xml' data");
                            u.call(this);
                            this.Ei = this.Zma = null;
                            this.$l = "number" === typeof D ? C.yd : 0;
                            this.GQ = C.xml || "";
                            this.ya = "object" === typeof E ? C.va : B;
                            this.AQ = C.request;
                            this.Sg = C.url;
                            this.Tb = [];
                            this.oo = this.$l;
                            this.wf = null;
                            this.ns = this.ql = false;
                            this.cQ = C.Pfa || 0;
                            this.FQ = C.M6a;
                        }
                        function h() {
                            var C, D, E;
                            C = this;
                            D = C.GQ.indexOf("<p");
                            if (-1 < D) {
                                E = C.GQ.slice(0, D);
                                c(E, function(G, F) {
                                    null !== G ? (G.EEb = E,
                                    C.emit("error", G)) : (C.Zma = F,
                                    C.Ei = new w(C.GQ,F.tickRate),
                                    k.call(C, C.$l));
                                });
                            } else
                                C.emit("error", Error("paragraph tag not found when searching for '<p'; could not build index"));
                        }
                        function k(C) {
                            var D, E, G, F, H, J, M, K, L;
                            D = this;
                            E = D.Zma;
                            G = 0;
                            F = [];
                            H = E.defaultStyle ? [E.defaultStyle] : [];
                            J = E.lang ? [E.lang] : [];
                            M = D.Ei.MMa;
                            D.ya.info("parsing the next 5 entries...");
                            K = D.Ei.Yxc(C);
                            D.ya.debug(K);
                            L = v.We(true);
                            L.onerror = function(O) {
                                O.xml = K;
                                D.emit("error", O);
                            }
                            ;
                            L.onend = function() {
                                var O;
                                O = D.Tb.reduce(function(I, N) {
                                    N = N.blocks.reduce(function(Q, S) {
                                        return Q.concat([S.id]);
                                    }, []);
                                    return I.concat(N);
                                }, []);
                                F.forEach(function(I) {
                                    var N;
                                    if (-1 === O.indexOf(I.id)) {
                                        N = I && I.blocks && I.blocks.filter(function(Q) {
                                            return 0 < Q.textNodes.length;
                                        });
                                        N && 0 < N.length && (I.blocks = N,
                                        D.Tb.push(I));
                                    }
                                });
                                D.ns = false;
                                D.ql || (D.ql = true,
                                D.emit("ready"));
                            }
                            ;
                            L.ontext = function(O) {
                                var I, N, Q, S;
                                if ("" !== O.trim() || O.match(/ +/)) {
                                    I = p(p(F).blocks).textNodes;
                                    N = I.push;
                                    O = O.match(/ +/) || p(J) && "ja" === p(J).slice(0, 2) ? O : O.trim();
                                    Q = p(H);
                                    S = p(J);
                                    N.call(I, {
                                        text: O,
                                        style: Q,
                                        lang: S && 0 === S.indexOf("ja") ? "ja" : S,
                                        lineBreaks: G
                                    });
                                }
                                G = 0;
                            }
                            ;
                            L.onclosetag = function() {
                                var O;
                                O = L.tag;
                                "undefined" !== typeof O.attributes.style && H.pop();
                                "undefined" !== typeof O.attributes["xml:lang"] && J.pop();
                            }
                            ;
                            L.onopentag = function(O) {
                                var I, N, Q, S, T;
                                I = O.attributes;
                                N = O.name;
                                O = E.tickRate;
                                if ("p" === N) {
                                    G = 0;
                                    N = I["xml:id"];
                                    I.style && H.push(I.style);
                                    I["xml:lang"] && J.push(I["xml:lang"]);
                                    Q = M ? Math.floor(parseInt(I.begin) / O * 1E3) : Math.floor(r(I.begin));
                                    if (0 === F.length || p(F).displayTime !== Q) {
                                        Q = F.push;
                                        S = {};
                                        if (M) {
                                            T = parseInt(I.begin) / O * 1E3;
                                            O = parseInt(I.end) / O * 1E3;
                                        } else
                                            (T = r(I.begin),
                                            O = r(I.end));
                                        S.id = N;
                                        S.startTime = Math.floor(T);
                                        S.endTime = Math.floor(O);
                                        S.style = I.style;
                                        S.region = I.region;
                                        S.displayTime = S.startTime;
                                        S.duration = S.endTime - S.startTime;
                                        S.extent = I["tts:extent"] || null;
                                        S.origin = I["tts:origin"] || null;
                                        S.latestEndSoFar = 0 > S.endTime ? 0 : S.endTime;
                                        S.blocks = [{
                                            textNodes: [],
                                            region: S.region,
                                            id: N,
                                            extent: S.extent,
                                            origin: S.origin
                                        }];
                                        Q.call(F, S);
                                    } else
                                        p(F).blocks.push({
                                            textNodes: [],
                                            region: I.region,
                                            id: N,
                                            extent: I["tts:extent"] || null,
                                            origin: I["tts:origin"] || null
                                        });
                                } else
                                    "span" === N ? (H.push(I.style),
                                    I["xml:lang"] && J.push(I["xml:lang"]),
                                    O = E.styles[I.style],
                                    I.style && O && O.ruby && 0 <= ["container", "baseContainer", "textContainer"].indexOf(O.ruby) && p(p(F).blocks).textNodes.push({
                                        text: "",
                                        style: p(H),
                                        lang: p(J),
                                        lineBreaks: 0
                                    })) : "br" === N && G++;
                            }
                            ;
                            L.write("<entries>").write(K).write("</entries>").close();
                        }
                        function l(C) {
                            var D;
                            C = m(C, A);
                            if ("string" === typeof C.extent) {
                                D = C.extent.split(" ").map(function(E) {
                                    return parseInt(E, 10);
                                });
                                C.width = D[0];
                                C.height = D[1];
                            } else
                                (C.width = 1280,
                                C.height = 720);
                            C.aspectRatio = C.width / C.height;
                            "string" === typeof C.cellResolution ? (D = C.cellResolution.split(" ").map(function(E) {
                                return parseInt(E, 10);
                            }),
                            C.cellResolution = {},
                            C.cellResolution.x = D[0],
                            C.cellResolution.y = D[1]) : C.cellResolution = {
                                x: 52,
                                y: 19
                            };
                            return C;
                        }
                        function m(C, D) {
                            var E;
                            E = {};
                            D.forEach(function(G) {
                                "undefined" !== typeof C["tts:" + G] ? E[G] = C["tts:" + G] : "undefined" !== typeof C["ttp:" + G] ? E[G] = C["ttp:" + G] : "undefined" !== typeof C["ebutts:" + G] ? E[G] = C["ebutts:" + G] : "undefined" !== typeof C["xml:" + G] && (E[G] = C["xml:" + G]);
                            });
                            E.styles = {};
                            E.regions = {};
                            return E;
                        }
                        function n(C, D) {
                            var E;
                            for (E = C.length - 1; 0 <= E; E--)
                                if (C[E].name === D)
                                    return true;
                            return false;
                        }
                        function q(C, D) {
                            return {
                                lineBreaks: D.lineBreaks,
                                text: D.text,
                                lang: D.lang,
                                style: this.FQ.rmc(C[D.style] || ({}), this.Zma),
                                id: D.id
                            };
                        }
                        r = a(4574).wL;
                        u = a(22699).EventEmitter;
                        v = a(60514);
                        w = a(96379);
                        x = a(81668);
                        a(81824);
                        a(81824);
                        y = ("color fontSize fontWeight fontStyle textAlign fontFamily backgroundColor textDecoration textOutline textCombine multiRowAlign direction ruby rubyAlign rubyPosition rubyReserve textEmphasis shear lineHeight").split(" ");
                        A = ("cellResolution pixelAspectRatio tickRate timeBase extent lang").split(" ");
                        z = ("backgroundColor displayAlign extent origin position writingMode multiRowAlign textAlign direction").split(" ");
                        B = {
                            info: f,
                            debug: f
                        };
                        b = Object.create(u.prototype);
                        e.prototype = b;
                        b.start = function() {
                            var C;
                            C = this;
                            C.ya.info("incremental text stream created, starting at pts " + C.$l);
                            C.GQ ? h.call(C) : C.AQ({
                                url: C.Sg
                            }, function(D, E) {
                                C.GQ = E;
                                h.call(C);
                            });
                        }
                        ;
                        b.ZL = function(C) {
                            var D, E, G;
                            D = this;
                            C < D.oo - D.cQ && (D.Tb = []);
                            E = D.Tb;
                            G = E.length ? Math.max(E[E.length - 1].startTime, C) : C;
                            D.oo = C;
                            for (!D.wf && 5 > D.Tb.length && !D.ns && (D.ya.info("buffer size: " + D.Tb.length + "; minimum: 5"),
                            D.ns = true,
                            D.wf = setTimeout(function() {
                                D.wf = null;
                                k.call(D, G + 1);
                            }, 10)); 0 < E.length && E[0].endTime < C; )
                                E.shift();
                            E = g(E, C).map(d.bind(D, D.Zma));
                            C < D.Ei.Xzb() && 0 === E.length && (E = null);
                            return E;
                        }
                        ;
                        b.Zq = function(C, D) {
                            return this.Ei ? this.Ei.Zq(C, D) : 0;
                        }
                        ;
                        b.close = function() {}
                        ;
                        t.exports = {
                            TFa: e,
                            UMb: c,
                            Ud: p,
                            psa: g,
                            tqa: d
                        };
                    }
