/**
 * @module Module_61726
 * @description Class module with ES module exports
 * @categories Network, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 61726
 * Deobfuscated size: 20639 chars
 * Functions: 31
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 61726
{
                        var e, h, k, l, m, n, q, r, u, v, w, x, y, A;
                        function d() {
                            this.Cg = (0,
                            n.An)("Http");
                            this.Wm = new e.jl();
                            this.gQ = 0;
                            this.stats = {
                                ssl: 0,
                                "non-ssl": 0,
                                invalid: 0
                            };
                            this.Jla = {
                                Ea: 1,
                                j7b: 2,
                                Q$a: 3
                            };
                            this.addEventListener = this.Wm.addListener;
                            this.removeEventListener = this.Wm.removeListener;
                        }
                        function p(z) {
                            var B, C, D, E;
                            B = z.url.split("?");
                            C = "sc=" + z.dWc;
                            D = z.efc ? "random=" + (1E17 * (0,
                            u.Uka)()).toFixed(0) : "";
                            E = B[0];
                            E = B[1] ? E + ("?" + B[1] + "&" + C) : E + ("?" + C);
                            E += D ? "&" + D : "";
                            z.Yc && !(0,
                            k.BGb)(E) && (z = h.config && h.config.Gtb) && (E = z.replace("{URL}", E).replace("{EURL}", encodeURIComponent(E)));
                            return E;
                        }
                        function c(z, B) {
                            var C, D, E;
                            C = z.url.split("?");
                            D = g(z);
                            E = C[0];
                            D && (B.nF = D,
                            (undefined === z.Hz ? h.config.Hz : z.Hz) || z.ox !== x.N7 ? (z.headers = z.headers || ({}),
                            z.headers.Range = "bytes=" + D) : (B.nF = D,
                            E = "/" === E[E.length - 1] ? E + "range/" : E + "/range/",
                            E += D));
                            D = z.efc ? "random=" + (1E17 * (0,
                            u.Uka)()).toFixed(0) : "";
                            h.config.TR && z.rC && (D = "sc=" + z.rC + (D ? "&" + D : ""));
                            E = C[1] ? E + ("?" + C[1] + (D ? "&" + D : "")) : E + (D ? "?" + D : "");
                            z.Yc && !(0,
                            k.BGb)(E) && (z = h.config && h.config.Gtb) && (E = z.replace("{URL}", E).replace("{EURL}", encodeURIComponent(E)));
                            B.url = E;
                        }
                        function g(z) {
                            var B;
                            B = z.offset;
                            if (undefined !== B)
                                return ((0,
                                q.iaa)(B),
                                undefined !== z.length ? (z = B + z.length - 1,
                                (0,
                                q.iaa)(z),
                                B + "-" + z) : B + "-");
                        }
                        function f(z, B, C, D) {
                            var E, G;
                            E = D.gOb;
                            G = D.headers;
                            z.open(E ? "POST" : "GET", B, C);
                            switch (D.responseType) {
                            case b.Lca:
                                z.responseType = "arraybuffer";
                                break;
                            case b.EXa:
                                (0,
                                r.Zfc)(z, "overrideMimeType", undefined, "text/xml");
                            }
                            E && (B = {
                                "Content-Type": (0,
                                w.Ri)(E) ? "text/plain" : "application/x-octet-stream"
                            },
                            G = G ? (0,
                            r.Qf)(B, G) : B);
                            G && (0,
                            r.Qi)(G, function(F, H) {
                                z.setRequestHeader(F, H);
                            });
                            D.withCredentials && (z.withCredentials = true);
                            E ? z.send(E) : z.send();
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Lca = b.EXa = b.DXa = b.LBc = b.FXa = b.KBc = b.MEb = b.sta = b.Je = undefined;
                        b.Kgd = c;
                        b.Jgd = g;
                        e = a(94886);
                        h = a(29204);
                        t = a(33096);
                        k = a(52569);
                        l = a(24066);
                        m = a(36129);
                        n = a(31276);
                        q = a(45146);
                        r = a(3887);
                        u = a(22365);
                        v = a(32219);
                        w = a(32687);
                        x = a(32934);
                        y = a(57504);
                        d.prototype.XYc = function(z) {
                            var B;
                            B = new XMLHttpRequest();
                            z = p(z);
                            B.open("HEAD", z, true);
                            B.onreadystatechange = function() {
                                2 === B.readyState && 200 <= B.status && 299 >= B.status && false;
                            }
                            ;
                            B.send();
                            return function() {
                                return B.abort();
                            }
                            ;
                        }
                        ;
                        d.prototype.download = function(z, B) {
                            var M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba;
                            function C() {
                                var aa;
                                if (!Q) {
                                    Q = true;
                                    ba && (Da.clearTimeout(ba),
                                    ba = null);
                                    M.Wm.removeListener(b.FXa, G);
                                    M.uNa(X, Y);
                                    Y && (Y.onloadstart = null,
                                    Y.onreadystatechange = null,
                                    Y.onprogress = null,
                                    Y.onerror = null,
                                    Y.onload = null,
                                    Y = Y.onabort = null);
                                    X.success || (X.Ya != m.Y.xP ? L.warn("Download failed", N, (0,
                                    m.eG)(X)) : L.trace("Download aborted", N));
                                    aa = S;
                                    S = null;
                                    null === aa || undefined === aa ? undefined : aa.reduceRight(function(ca, ea) {
                                        (0,
                                        v.gi)(function() {
                                            return ea(X);
                                        });
                                    }, null);
                                    M.Wm.qd(b.MEb, X, true);
                                }
                            }
                            function D() {
                                ba && (Da.clearTimeout(ba),
                                ba = null);
                                ba = Da.setTimeout(F, da ? I : O);
                            }
                            function E(aa, ca, ea) {
                                var R, P;
                                X.success = false;
                                X.Ya = aa;
                                R = (0,
                                l.jy)();
                                P = X.gr;
                                P.Dm = P.Dm || R;
                                P.lx = P.lx || R;
                                ca && 0 < ca && (X.Rq = ca,
                                X.Yg = ca.toString());
                                ea && (X.Cf = ea);
                                aa !== m.Y.a7 && aa !== m.Y.yP && aa !== m.Y.e7 || !Y || (Y.onabort = null,
                                H());
                                C();
                            }
                            function G() {
                                A() || E(m.Y.a7);
                            }
                            function F() {
                                E(da ? m.Y.yP : m.Y.e7);
                            }
                            function H() {
                                try {
                                    null === Y || undefined === Y ? undefined : Y.abort();
                                } catch (aa) {}
                            }
                            function J() {
                                E(m.Y.xP);
                            }
                            M = this;
                            (0,
                            q.ta)(B);
                            L = (null === (K = null === z || undefined === z ? undefined : z.j) || undefined === K ? 0 : K.log) ? (0,
                            n.Fo)(z.j, "Http") : this.Cg;
                            O = z.Dpa || h.config.Dpa;
                            I = z.x0a || h.config.x0a;
                            N = {
                                Num: this.gQ++
                            };
                            Q = false;
                            S = [B];
                            T = {};
                            this.D$b(z);
                            X = new y.$db(z,H,F,T,function(aa) {
                                Q || ((0,
                                q.ta)(S, "Callback should be added before download starts."),
                                S && S.unshift(aa));
                            }
                            );
                            da = false;
                            (0,
                            v.gi)(function() {
                                var aa;
                                if ((0,
                                w.fZa)(z.url))
                                    try {
                                        if ((c(z, X),
                                        U = X.url,
                                        (0,
                                        q.jaa)(U),
                                        N.Url = U,
                                        A())) {
                                            false;
                                            Y = new XMLHttpRequest();
                                            Y.onreadystatechange = function() {
                                                2 === (null === Y || undefined === Y ? undefined : Y.readyState) && (da = true,
                                                T.Dm = (0,
                                                l.jy)(),
                                                Y.onreadystatechange = null,
                                                D(),
                                                false,
                                                M.uNa(X, Y),
                                                X.$T({
                                                    timestamp: T.Dm,
                                                    connect: true,
                                                    mediaRequest: z,
                                                    start: T.fJ,
                                                    rt: [T.Dm - T.fJ],
                                                    responseHeaders: X.headers,
                                                    httpCode: X.Mk
                                                }));
                                            }
                                            ;
                                            Y.onprogress = function(ca) {
                                                da = true;
                                                T.uo = ca.loaded;
                                                D();
                                                M.uNa(X, Y);
                                                ca = {
                                                    mediaRequest: z,
                                                    bytes: ca.loaded,
                                                    timestamp: (0,
                                                    l.jy)(),
                                                    bytesLoaded: ca.loaded,
                                                    responseHeaders: X.headers,
                                                    httpCode: X.Mk
                                                };
                                                X.$T(ca);
                                            }
                                            ;
                                            Y.onload = function(ca) {
                                                if (!Q && Y) {
                                                    (0,
                                                    q.ta)(undefined === T.lx);
                                                    T.lx = (0,
                                                    l.jy)();
                                                    T.Dm = T.Dm || T.lx;
                                                    T.uo = ca.loaded;
                                                    if (200 <= Y.status && 299 >= Y.status) {
                                                        a: switch ((ca = Y,
                                                        X.type)) {
                                                        case b.Lca:
                                                            ca = ca.response || new ArrayBuffer(0);
                                                            break a;
                                                        case b.EXa:
                                                            ca = ca.responseXML;
                                                            break a;
                                                        default:
                                                            ca = ca.responseText;
                                                        }
                                                        X.parsed = false;
                                                        X.content = ca;
                                                        X.success = true;
                                                    } else
                                                        420 === Y.status ? E(m.Y.c7, Y.status) : E(m.Y.b7, Y.status, Y.response);
                                                    C();
                                                }
                                            }
                                            ;
                                            Y.onabort = J;
                                            Y.onerror = function() {
                                                var ca, ea;
                                                if (Y) {
                                                    ca = Y.status;
                                                    "undefined" !== typeof h.config.OAb && (ca = h.config.OAb);
                                                    if (0 < ca) {
                                                        if (420 === ca)
                                                            E(m.Y.c7, ca);
                                                        else {
                                                            try {
                                                                ea = Y.responseText;
                                                            } catch (R) {}
                                                            E(m.Y.b7, ca, ea);
                                                        }
                                                    } else
                                                        E(m.Y.g7);
                                                }
                                            }
                                            ;
                                            aa = (0,
                                            l.jy)();
                                            f(Y, U, true, z);
                                            M.Wm.qd(b.sta, X, true);
                                            T.fJ = aa;
                                            X.C2({
                                                mediaRequest: z,
                                                timestamp: aa
                                            });
                                            D();
                                            M.Wm.addListener(b.FXa, G);
                                        } else
                                            (0,
                                            v.gi)(E.bind(undefined, m.Y.a7));
                                    } catch (ca) {
                                        L.error("Exception starting download", ca, N);
                                        E(m.Y.EFa, undefined, (0,
                                        r.Yj)(ca));
                                    }
                                else
                                    E(m.Y.Fdb);
                            });
                            return X;
                        }
                        ;
                        d.prototype.oRc = function(z) {
                            var B, C;
                            B = new XMLHttpRequest();
                            C = z.lRc;
                            B.open("HEAD", z.url, true);
                            B.timeout = h.config.wya;
                            B.onreadystatechange = function() {
                                2 === B.readyState && (false,
                                C && C.w2(B.status));
                            }
                            ;
                            B.ontimeout = B.onerror = function() {
                                false;
                                C && C.L0a(B.status);
                            }
                            ;
                            B.send();
                        }
                        ;
                        d.prototype.D$b = function(z) {
                            var B;
                            try {
                                B = z.url;
                                (0,
                                w.fZa)(B) ? 0 === B.indexOf("https") ? this.stats.ssl++ : 0 === B.indexOf("http") ? this.stats["non-ssl"]++ : this.stats.invalid++ : this.stats.invalid++;
                            } catch (C) {}
                        }
                        ;
                        d.prototype.uNa = function(z, B) {
                            var C;
                            if ((undefined === z.Mk || undefined === z.headers) && B) {
                                z.Mk = B.status;
                                C = {};
                                B.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(function(D) {
                                    var E;
                                    E = Fa(D.split(": "));
                                    D = E.next().value;
                                    E = tb(E).join(": ");
                                    D && (C[D.toLowerCase()] = E);
                                });
                                z.headers = C;
                            }
                        }
                        ;
                        A = t.vkb;
                        b.Je = new d();
                        b.sta = 1;
                        b.MEb = 2;
                        b.KBc = 3;
                        b.FXa = 4;
                        b.LBc = 5;
                        b.DXa = b.Je.Jla.Ea;
                        b.EXa = b.Je.Jla.j7b;
                        b.Lca = b.Je.Jla.Q$a;
                        Da._cad_global.http = b.Je;
                    }
