/**
 * @module Module_97154
 * @description Class module with ES module exports
 * @categories DRM, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 97154
 * Deobfuscated size: 16092 chars
 * Functions: 31
 * Prototype definitions: 22
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 97154
{
                        var p, c, g, f, e, h;
                        function d(k, l, m, n) {
                            this.BO = k;
                            this.Ira = l;
                            this.EH = {
                                position: "absolute",
                                left: "0",
                                top: "0",
                                right: "0",
                                bottom: "0",
                                display: "block"
                            };
                            this.element = (0,
                            p.createElement)("DIV", undefined, undefined, {
                                "class": "player-timedtext"
                            });
                            this.element.onselectstart = function() {
                                return false;
                            }
                            ;
                            this.lSb(m);
                            this.nUa = this.YBb(this.Ira);
                            this.lang = n;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Cmb = undefined;
                        p = a(52569);
                        c = a(33579);
                        g = a(15531);
                        f = a(29204);
                        e = a(22365);
                        h = a(3887);
                        d.prototype.Vq = function() {
                            return this.element;
                        }
                        ;
                        d.prototype.$Wc = function(k) {
                            this.zD = k;
                        }
                        ;
                        d.prototype.pXc = function(k) {
                            this.entry = k;
                            this.QU();
                        }
                        ;
                        d.prototype.AXc = function(k) {
                            this.lSb(k);
                            this.QU();
                        }
                        ;
                        d.prototype.BXc = function(k) {
                            this.lang = k;
                            this.QU();
                        }
                        ;
                        d.prototype.QU = function() {
                            var k, l, m, n, q, r, u, v, w, x, y, A, B, C, D;
                            k = this;
                            l = this.Vq();
                            m = l.parentElement;
                            n = m && m.clientWidth || 0;
                            q = m && m.clientHeight || 0;
                            r = m = 0;
                            u = 0;
                            v = {
                                width: n,
                                height: q
                            };
                            x = this.BO.DBb().characterSize;
                            this.lang && f.config.Dta && f.config.Dta.includes(this.lang) && "MEDIUM" === x && (u = 1.4);
                            this.lang && f.config.Fta && f.config.Fta.includes(this.lang) && "SMALL" === x && (u = 1.6);
                            if (0 < n && 0 < q && this.entry) {
                                this.zD && (v = (0,
                                p.Gra)(n, q, this.zD),
                                m = Math.round((n - v.width) / 2),
                                r = Math.round((q - v.height) / 2));
                                y = this.Sfc(v);
                                A = (0,
                                p.Gra)(y.width, y.height, this.zD);
                                (w = this.vZc(this.entry.blocks)) && (w = this.sVc(w));
                                y = w && w.map(function(E) {
                                    var G;
                                    G = null === E || undefined === E ? undefined : E.region;
                                    switch (G.horizontalAlignment) {
                                    case "start":
                                        G.horizontalAlignment = "rtl" === k.EH.direction ? "right" : "left";
                                        break;
                                    case "end":
                                        G.horizontalAlignment = "rtl" === k.EH.direction ? "left" : "right";
                                    }
                                    G = (0,
                                    g.Yyb)(E, A, k.Ira, k.nUa, u);
                                    E = (0,
                                    g.Lrc)(E) + ";position:absolute";
                                    return (0,
                                    p.createElement)("div", E, G, d.SDa);
                                });
                            }
                            Object.assign(this.EH, {
                                left: m + "px",
                                right: m + "px",
                                top: r + "px",
                                bottom: r + "px"
                            });
                            l.style.display = "none";
                            l.style.direction = this.EH.direction;
                            l.innerHTML = "";
                            if (y && y.length) {
                                n = v.width;
                                m = v.height;
                                x = v;
                                this.o$ && (x = this.Y$b(v, this.o$, q, r));
                                this.EH.margin = this.Ry ? this.cpa(v, "top") + "px " + this.cpa(v, "right") + "px " + this.cpa(v, "bottom") + "px " + this.cpa(v, "left") + "px " : undefined;
                                y.forEach(function(E) {
                                    return l.appendChild(E);
                                });
                                q = (0,
                                p.X$)(this.EH);
                                l.style.cssText = q + ";visibility:hidden;z-index:-1";
                                r = [];
                                for (var z = y.length - 1; 0 <= z; z--) {
                                    B = y[z];
                                    C = w[z];
                                    D = this.dLb(B, C, n, m);
                                    u = 0 < u ? n / D.width * u : n / D.width;
                                    D.width > n && (B.innerHTML = (0,
                                    g.Yyb)(C, v, this.Ira, this.nUa, u),
                                    D = this.dLb(B, C, n, m));
                                    r[z] = D;
                                }
                                r = (0,
                                c.l2c)(r, x);
                                if (z = w && w[0] && w[0].textNodes && w[0].textNodes[0] && w[0].textNodes[0].style)
                                    (x = z.windowColor,
                                    z = z.windowOpacity,
                                    x && 0 < z && (B = Math.round(m / 50),
                                    v = (0,
                                    g.Nrc)(w, r, B, x, v),
                                    v = (0,
                                    p.createElement)("div", "position:absolute;left:0;top:0;right:0;bottom:0;opacity:" + z, v, d.SDa),
                                    l.insertBefore(v, l.firstChild)));
                                l.style.display = "none";
                                for (v = r.length - 1; 0 <= v; v--)
                                    (z = r[v],
                                    x = y[v].style,
                                    B = w[v].region,
                                    z = (0,
                                    g.Mrc)(B, z, n, m, 0),
                                    Object.assign(x, z));
                                l.style.cssText = q;
                            }
                        }
                        ;
                        d.prototype.N5a = function(k) {
                            this.o$ = k;
                            this.QU();
                        }
                        ;
                        d.prototype.PWa = function() {
                            return this.o$;
                        }
                        ;
                        d.prototype.O5a = function(k) {
                            this.Ry = k;
                            this.QU();
                        }
                        ;
                        d.prototype.QWa = function() {
                            return this.Ry;
                        }
                        ;
                        d.prototype.RWa = function() {
                            return "block" === this.EH.display;
                        }
                        ;
                        d.prototype.P5a = function(k) {
                            var l;
                            l = k ? "block" : "none";
                            this.element.style.display = l;
                            this.EH.display = l;
                            k && this.QU();
                        }
                        ;
                        d.prototype.Q2c = function(k) {
                            this.Ira = k;
                            this.nUa = this.YBb(k);
                        }
                        ;
                        d.prototype.YBb = function(k) {
                            var l, m;
                            l = this;
                            m = {};
                            (0,
                            h.Qi)(k, function(n, q) {
                                m[n] = l.aJc(q);
                            });
                            return m;
                        }
                        ;
                        d.prototype.lSb = function(k) {
                            this.EH.direction = "boolean" === typeof k ? k ? "ltr" : "rtl" : "inherit";
                        }
                        ;
                        d.prototype.cpa = function(k, l) {
                            if (this.Ry) {
                                if ("left" === l || "right" === l)
                                    return k.width * (this.Ry[l] || 0);
                                if ("top" === l || "bottom" === l)
                                    return k.height * (this.Ry[l] || 0);
                            }
                            return 0;
                        }
                        ;
                        d.prototype.Sfc = function(k) {
                            return this.Ry ? {
                                height: k.height * (1 - (this.Ry.top || 0) - (this.Ry.bottom || 0)),
                                width: k.width * (1 - (this.Ry.left || 0) - (this.Ry.right || 0))
                            } : k;
                        }
                        ;
                        d.prototype.aJc = function(k) {
                            var l;
                            k = "display:block;position:fixed;z-index:-1;visibility:hidden;font-size:1000px;" + k + ";";
                            k = (0,
                            p.createElement)("DIV", k, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", d.SDa);
                            e.$i.body.appendChild(k);
                            l = {
                                fontSize: 1E3,
                                height: k.clientHeight,
                                width: k.clientWidth / 52,
                                lineHeight: k.clientHeight / 1E3
                            };
                            e.$i.body.removeChild(k);
                            return l;
                        }
                        ;
                        d.prototype.dLb = function(k, l, m, n) {
                            var q, r, u, v, w;
                            q = l.region;
                            r = (q.marginTop || 0) * n;
                            u = (q.marginBottom || 0) * n;
                            v = (q.marginLeft || 0) * m;
                            w = (q.marginRight || 0) * m;
                            l = k.clientWidth || 1;
                            k = k.clientHeight || 1;
                            switch (q.verticalAlignment) {
                            case "top":
                                n = r;
                                break;
                            case "center":
                                n = (r + n - u - k) / 2;
                                break;
                            default:
                                n = n - u - k;
                            }
                            switch (q.horizontalAlignment) {
                            case "left":
                                m = v;
                                break;
                            case "right":
                                m = m - w - l;
                                break;
                            default:
                                m = (v + m - w - l) / 2;
                            }
                            return {
                                top: n,
                                left: m,
                                width: l,
                                height: k
                            };
                        }
                        ;
                        d.prototype.Y$b = function(k, l, m, n) {
                            return {
                                height: m - Math.max(n, l.bottom || 0) - Math.max(n, l.top || 0),
                                width: k.width
                            };
                        }
                        ;
                        d.prototype.sVc = function(k) {
                            var l, q, r, u;
                            l = k && k.map(function(v, w) {
                                var x;
                                return "vertical-rl" === (null === (x = null === v || undefined === v ? undefined : v.region) || undefined === x ? undefined : x.writingMode) ? w : -1;
                            }).filter(function(v) {
                                return -1 !== v;
                            });
                            if (l && 0 !== l.length)
                                for (var m = 0, n = l.length - 1; m < n; (m++,
                                n--)) {
                                    q = l[m];
                                    r = l[n];
                                    u = Fa([k[r], k[q]]);
                                    k[q] = u.next().value;
                                    k[r] = u.next().value;
                                }
                            return k;
                        }
                        ;
                        d.prototype.vZc = function(k) {
                            var l, m;
                            if (!k || 0 === k.length)
                                return k;
                            m = k.filter(function(r) {
                                var u;
                                return "horizontal-tb" === (null === (u = r.region) || undefined === u ? undefined : u.writingMode);
                            }).sort(function(r, u) {
                                return r.region.marginTop - u.region.marginTop;
                            });
                            if (!m || 0 === m.length)
                                return k;
                            for (var n = 0, q = 0; n < m.length && q < k.length; q++)
                                "horizontal-tb" === (null === (l = k[q].region) || undefined === l ? undefined : l.writingMode) && (k[q] = m[n++]);
                            return k;
                        }
                        ;
                        b.Cmb = d;
                        d.SDa = {
                            "class": "player-timedtext-text-container"
                        };
                    }
