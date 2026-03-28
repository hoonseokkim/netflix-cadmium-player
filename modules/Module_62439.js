/**
 * @module Module_62439
 * @description Class module with ES module exports
 * @categories DRM, Media, ABR, Text, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 62439
 * Deobfuscated size: 12465 chars
 * Functions: 32
 * Prototype definitions: 12
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 62439
{
                        var p, c, g, f, e, h, k;
                        function d(l) {
                            var m, n, q, r;
                            m = this;
                            this.j = l;
                            this.aaa = undefined;
                            this.sMa = (0,
                            c.createElement)("DIV", "position:fixed;left:0;top:50%;right:0;bottom:0;text-align:center;color:#040;font-size:11px;font-family:monospace;z-index:9999", undefined, {
                                "class": "player-streams"
                            });
                            this.iMa = (0,
                            c.createElement)("DIV", "display:inline-block;background-color:rgba(255,255,255,0.86);border:3px solid #fff;padding:5px;margin-top:-90px");
                            this.bMa = (0,
                            c.createElement)("DIV", "width:100%;text-align:center");
                            this.x7b = this.kMa("Audio Bitrate");
                            this.TNa = this.kMa("Video Bitrate / VMAF");
                            this.cMa = this.kMa("CDN");
                            this.T8 = {};
                            this.vca = g.Za.get(f.Rt);
                            this.sMa.appendChild(this.iMa);
                            this.iMa.appendChild(this.bMa);
                            n = (0,
                            c.createElement)("BUTTON", undefined, "Override");
                            n.addEventListener("click", this.w7b.bind(this), false);
                            this.bMa.appendChild(n);
                            n = (0,
                            c.createElement)("BUTTON", undefined, "Reset");
                            n.addEventListener("click", this.g$b.bind(this), false);
                            this.bMa.appendChild(n);
                            q = this.L9b.bind(this);
                            p.Ce.addListener(p.gM, q);
                            l.addEventListener(h.ja.ZM, function() {
                                m.T8 = {};
                            });
                            l.addEventListener(h.ja.Fh, function() {
                                p.Ce.removeListener(p.gM, q);
                            });
                            r = this.d$b.bind(this);
                            l.Yc.forEach(function(u) {
                                u.addListener(r);
                            });
                            l.oa.addListener([k.l.V, k.l.U], r);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.wjb = undefined;
                        p = a(37509);
                        c = a(52569);
                        g = a(31276);
                        f = a(34231);
                        e = a(43193);
                        h = a(85001);
                        k = a(26388);
                        d.prototype.show = function() {
                            this.s9 || (this.Epb(),
                            document.body.appendChild(this.sMa),
                            this.s9 = true);
                        }
                        ;
                        d.prototype.uE = function() {
                            this.s9 && (document.body.removeChild(this.sMa),
                            this.s9 = false);
                        }
                        ;
                        d.prototype.toggle = function() {
                            this.s9 ? this.uE() : this.show();
                        }
                        ;
                        d.prototype.mWb = function() {
                            var n, q, r, u;
                            function l(v, w, x) {
                                var y, A, z;
                                A = [];
                                w.filter(function(B) {
                                    return B.Zc === v;
                                }).forEach(function(B) {
                                    0 <= x.indexOf(B) ? (undefined === z ? z = B.bitrate : y = B.bitrate,
                                    undefined === y && (y = B.bitrate)) : undefined !== z && undefined !== y && (A.push({
                                        min: z,
                                        max: y
                                    }),
                                    z = y = undefined);
                                });
                                if (undefined !== z && undefined !== y) {
                                    A.push({
                                        min: z,
                                        max: y
                                    });
                                    z = y = undefined;
                                }
                                return A;
                            }
                            function m(v, w, x) {
                                var y;
                                y = [];
                                w.filter(function(A) {
                                    return A.Zc === v;
                                }).forEach(function(A) {
                                    -1 === x.indexOf(A) && y.push({
                                        stream: {
                                            bitrate: A.bitrate
                                        },
                                        disallowedBy: ["manual"]
                                    });
                                });
                                return y;
                            }
                            q = this.j.SD();
                            r = this.j.fM().sort(function(v, w) {
                                return v.bitrate - w.bitrate;
                            });
                            u = r.reduce(function(v, w) {
                                0 > v.indexOf(w.Zc) && v.push(w.Zc);
                                return v;
                            }, []).map(function(v) {
                                return {
                                    profile: v,
                                    ranges: l(v, r, q),
                                    disallowed: m(v, r, q)
                                };
                            });
                            false;
                            null === (n = this.j.fb) || undefined === n ? undefined : n.fAa(u, this.j.R);
                        }
                        ;
                        d.prototype.w7b = function() {
                            var n, q;
                            this.T8 = {};
                            for (var l = this.TNa.options, m = l.length; m--; ) {
                                n = l[m];
                                n.selected && (this.T8[n.value] = 1);
                            }
                            this.aaa = this.O7b.bind(this);
                            this.mWb();
                            this.j.lza();
                            if (l = this.j.di) {
                                q = this.cMa.value;
                                l = l.filter(function(r) {
                                    return r.id == q;
                                })[0];
                                m = this.j.Yc[k.l.U].value;
                                l && l != m && (l.Itb = {
                                    testreason: "streammanager",
                                    selreason: "userselection"
                                },
                                this.j.Yc[k.l.U].set(l));
                            }
                            this.uE();
                        }
                        ;
                        d.prototype.g$b = function() {
                            this.aaa = undefined;
                            this.j.KSb(this.j.R);
                            this.j.lza();
                            this.uE();
                        }
                        ;
                        d.prototype.O7b = function() {
                            var l;
                            l = this;
                            return this.j.fM().filter(function(m) {
                                return l.T8[m.bitrate];
                            });
                        }
                        ;
                        d.prototype.Epb = function() {
                            var l, m, n, q;
                            l = this;
                            m = this.j.oa.Cc;
                            n = this.j.oa.Mc;
                            q = this.j.di;
                            m && (q = q.slice(),
                            q.sort(function(r, u) {
                                return r.Gc - u.Gc;
                            }),
                            this.KNa(this.x7b, m.streams.map(function(r) {
                                return {
                                    value: r.bitrate,
                                    caption: r.bitrate,
                                    selected: r == l.j.qj.value
                                };
                            })));
                            n && (this.KNa(this.TNa, n.streams.map(function(r) {
                                var u, v, w;
                                u = l.j.c2.nJ(r);
                                v = r.bitrate;
                                r = r.Wb;
                                w = "" + v;
                                r && (w += " / " + r);
                                u && (w += " (" + u.join("|") + ")");
                                return {
                                    value: v,
                                    caption: w,
                                    selected: l.aaa ? l.T8[v] : !u
                                };
                            })),
                            this.TNa.removeAttribute("disabled"));
                            q && (this.KNa(this.cMa, q.map(function(r) {
                                return {
                                    value: r.id,
                                    caption: "[" + r.id + "] " + r.name,
                                    selected: r == l.j.Yc[k.l.U].value
                                };
                            })),
                            this.cMa.removeAttribute("disabled"));
                        }
                        ;
                        d.prototype.d$b = function() {
                            this.s9 && this.Epb();
                        }
                        ;
                        d.prototype.kMa = function(l) {
                            var m, n;
                            m = (0,
                            c.createElement)("DIV", "display:inline-block;vertical-align:top;margin:5px;");
                            l = (0,
                            c.createElement)("DIV", undefined, l);
                            n = (0,
                            c.createElement)("select", "width:120px;height:180px", undefined, {
                                disabled: "disabled",
                                multiple: "multiple"
                            });
                            m.appendChild(l);
                            m.appendChild(n);
                            this.iMa.appendChild(m);
                            return n;
                        }
                        ;
                        d.prototype.KNa = function(l, m) {
                            l.innerHTML = "";
                            m.forEach(function(n) {
                                var q;
                                q = {
                                    title: n.caption
                                };
                                n.selected && (q.selected = "selected");
                                q = (0,
                                c.createElement)("option", undefined, n.caption, q);
                                q.value = n.value;
                                l.appendChild(q);
                            });
                        }
                        ;
                        d.prototype.L9b = function(l) {
                            l.ctrlKey && l.altKey && l.shiftKey && l.keyCode == e.kX.qja && this.vca.dZa && this.toggle();
                        }
                        ;
                        b.wjb = d;
                    }
