/**
 * @module Module_52200
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 52200
 * Deobfuscated size: 19908 chars
 * Functions: 22
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 52200
{
                        var p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x;
                        function d(y, A, z, B, C, D) {
                            var E;
                            E = this;
                            this.j = y;
                            this.wp = A;
                            this.xia = z;
                            this.Ql = B;
                            this.uTb = C;
                            this.OA = D;
                            this.Lwb = {};
                            this.update = function() {
                                var G;
                                if (E.tv.selectionStart == E.tv.selectionEnd) {
                                    G = "";
                                    E.Uba().forEach(function(F) {
                                        G = G ? G + "\n" : "";
                                        Object.entries(F).forEach(function(H) {
                                            var J;
                                            J = Fa(H);
                                            H = J.next().value;
                                            J = J.next().value;
                                            G += H + ": " + J + "\n";
                                        });
                                    });
                                    E.tv.style.fontSize = (0,
                                    g.oG)((0,
                                    e.uX)(E.element.clientHeight / 60), 8, 18) + "px";
                                    E.tv.value = G;
                                }
                            }
                            ;
                            this.tMc = function() {
                                var G, F;
                                if (E.j.ae) {
                                    F = E.j.ae.vS();
                                    F && (E.SRa = F - (null !== (G = E.jVb) && undefined !== G ? G : 0),
                                    E.jVb = F,
                                    E.F2());
                                }
                            }
                            ;
                            this.F2 = function() {
                                E.xia.tg(E.update);
                            }
                            ;
                            this.onkeydown = function(G) {
                                G.ctrlKey && G.altKey && G.shiftKey && (G.keyCode == l.kX.t_b || G.keyCode == l.kX.Q) && E.toggle();
                            }
                            ;
                            this.NNb = [y.mediaTime, y.Yc[n.l.V], y.Yc[n.l.U], y.Yc[n.l.Ea], y.gf, y.Fe, y.qj, y.ig, y.sl, y.state, y.ju, y.bc, y.volume, y.muted];
                            this.element = this.Ql.createElement("div", "position:fixed;left:10px;top:10px;right:10px;bottom:10px;z-index:9999", undefined, {
                                "class": "player-info"
                            });
                            this.tv = this.Ql.createElement("textarea", "position:absolute;resize:none;box-sizing:border-box;width:100%;height:100%;padding:10px;background-color:rgba(0,0,0,0.4);color:#fff;font-size:12px;font-family:Arial;overflow:auto;", undefined, {
                                readonly: "readonly"
                            });
                            this.element.appendChild(this.tv);
                            this.controls = this.Ql.createElement("div", "position:absolute;top:2px;right:2px");
                            this.element.appendChild(this.controls);
                            A = this.Ql.createElement("button", undefined, "X");
                            A.addEventListener("click", function() {
                                return E.uE();
                            }, false);
                            this.controls.appendChild(A);
                            c.Ce.addListener(c.gM, this.onkeydown);
                            y.addEventListener(k.ja.Fh, function() {
                                c.Ce.removeListener(c.gM, E.onkeydown);
                                E.uE();
                            });
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.sjb = undefined;
                        p = a(13044);
                        c = a(37509);
                        g = a(8825);
                        f = a(77705);
                        e = a(22365);
                        h = a(32687);
                        k = a(85001);
                        l = a(43193);
                        m = a(5021);
                        n = a(26388);
                        q = a(45247);
                        r = a(75568);
                        t = {};
                        u = (t[k.Nc.zX] = "Not Loaded",
                        t[k.Nc.LOADING] = "Loading",
                        t[k.Nc.Lf] = "Normal",
                        t[k.Nc.CLOSING] = "Closing",
                        t[k.Nc.CLOSED] = "Closed",
                        t);
                        t = {};
                        v = (t[k.zh.Lf] = "Normal",
                        t[k.zh.Xf] = "Pre-buffering",
                        t[k.zh.dlb] = "Network stalled",
                        t);
                        t = {};
                        w = (t[k.Qb.Bh] = "Waiting for decoder",
                        t[k.Qb.Bg] = "Playing",
                        t[k.Qb.aj] = "Paused",
                        t[k.Qb.Ix] = "Media ended",
                        t);
                        x = [k.ja.sea];
                        d.prototype.mXc = function(y) {
                            this.Lwb.DFR = y;
                        }
                        ;
                        d.prototype.show = function() {
                            var y;
                            y = this;
                            this.visible || (this.ada = Da.setInterval(this.tMc, 1E3),
                            document.body.appendChild(this.element),
                            this.NNb.forEach(function(A) {
                                A.addListener(y.F2);
                            }),
                            x.forEach(function(A) {
                                y.j.addEventListener(A, y.F2);
                            }),
                            this.visible = true,
                            this.OA.Eha().then(function(A) {
                                y.tXa = A;
                                y.F2();
                            }));
                            this.update();
                        }
                        ;
                        d.prototype.uE = function() {
                            var y;
                            y = this;
                            this.visible && (clearInterval(this.ada),
                            this.jVb = this.SRa = undefined,
                            document.body.removeChild(this.element),
                            this.NNb.forEach(function(A) {
                                A.removeListener(y.F2);
                            }),
                            x.forEach(function(A) {
                                y.j.removeEventListener(A, y.F2);
                            }),
                            this.xia.tg(),
                            this.visible = false);
                        }
                        ;
                        d.prototype.toggle = function() {
                            this.visible ? this.uE() : this.show();
                        }
                        ;
                        d.prototype.Uba = function() {
                            var y, A, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa, ca, ea, R, P, V, Z, fa, la, ka, sa, qa, wa, na, oa, W, ia, ha, pa, va, Aa, ma, ra, ya, ua, xa, Ca, Ja, La, Na, Oa;
                            y = this;
                            T = [];
                            U = this.wp();
                            T.push({
                                Version: "6.0055.939.911",
                                Esn: U ? U.wj : "UNKNOWN",
                                PBCID: this.j.correlationId,
                                UserAgent: e.yX
                            });
                            try {
                                X = this.j.mediaTime.value;
                                Y = {
                                    MovieId: this.j.R,
                                    PackageId: null === (z = null === (A = this.j.S) || undefined === A ? undefined : A.Aa) || undefined === z ? undefined : z.jt,
                                    Xid: this.j.Ia + " (" + p.tq.map(function(Ka) {
                                        return Ka.Ia;
                                    }).join(", ") + ")",
                                    Position: (0,
                                    g.zk)(X),
                                    Duration: (0,
                                    g.zk)(this.j.vH.na(m.Ba)),
                                    PlayerDuration: (0,
                                    g.zk)(this.j.mt.na(m.Ba)),
                                    Volume: (0,
                                    e.Tt)(100 * this.j.volume.value) + "%" + (this.j.muted.value ? " (Muted)" : ""),
                                    Segment: this.j.nWa()
                                };
                                if (this.j.qb.bh || this.j.qb.AE)
                                    Y["Segment Position"] = (0,
                                    g.zk)(this.j.bM());
                                null === (B = this.j.lm()) || undefined === B || B.sCb();
                                if (this.j.Hc.Da) {
                                    Y["Is Live"] = "true";
                                    Y["Live Event Slate"] = this.j.Hc.aM();
                                    Y["Is At Live Edge"] = "" + this.j.Hc.Fy();
                                    Y["Adjusted Live Edge Target"] = (0,
                                    g.zk)(this.j.Hc.ZA());
                                    Y["Live Adjusted Duration"] = (0,
                                    g.zk)(this.j.Hc.LDb());
                                    Y["Live Adjusted Playback Position"] = (0,
                                    g.zk)(this.j.Hc.Tsa());
                                    Y["Live Event Time Playback Position"] = this.j.Hc.Xvc();
                                    Y["Live Segment Number"] = this.j.Hc.Yvc();
                                    da = [n.l.U, n.l.V, n.l.Ea].reduce(function(Ka, Pa) {
                                        var Sa, Ua, Ta;
                                        Ta = null === (Ua = null === (Sa = y.j.fb) || undefined === Sa ? undefined : Sa.EB) || undefined === Ua ? undefined : Ua[Pa];
                                        Ka[(0,
                                        q.FI)(Pa)] = Ta ? {
                                            encoderRegion: Ta.Ao,
                                            encoderTag: Ta.Bo
                                        } : undefined;
                                        return Ka;
                                    }, {});
                                    Y["Live Logging Info"] = JSON.stringify(da);
                                }
                                T.push(Y);
                            } catch (Ka) {}
                            try {
                                T.push({
                                    "Player state": u[this.j.state.value],
                                    "Buffering state": v[this.j.ju.value],
                                    "Rendering state": w[this.j.bc.value]
                                });
                            } catch (Ka) {}
                            try {
                                ba = this.j.N8a() + this.j.lPa();
                                aa = this.j.gf.value;
                                ca = null === aa || undefined === aa ? undefined : aa.stream;
                                ea = this.j.Fe.value;
                                R = null === ea || undefined === ea ? undefined : ea.stream;
                                P = null !== (C = null === ca || undefined === ca ? undefined : ca.bitrate) && undefined !== C ? C : "?";
                                V = R ? R.bitrate + " (" + R.width + "x" + R.height + ")" : "?";
                                Z = null !== (D = null === ca || undefined === ca ? undefined : ca.ob) && undefined !== D ? D : "?";
                                fa = null !== (E = null === R || undefined === R ? undefined : R.ob) && undefined !== E ? E : "?";
                                la = null !== (G = null === R || undefined === R ? undefined : R.Wb) && undefined !== G ? G : "?";
                                ka = null !== (H = null === (F = this.j.ig.value) || undefined === F ? undefined : F.Wb) && undefined !== H ? H : "?";
                                sa = null !== (M = null === (J = this.j.qj.value) || undefined === J ? undefined : J.bitrate) && undefined !== M ? M : "?";
                                qa = null !== (L = null === (K = this.j.ig.value) || undefined === K ? undefined : K.bitrate) && undefined !== L ? L : "?";
                                wa = this.j.Yc[n.l.V].value;
                                na = this.j.Yc[n.l.U].value;
                                oa = this.j.Yc[n.l.Ea].value;
                                T.push({
                                    "Playing bitrate (a/v)": P + " / " + V,
                                    "Playing/Buffering vmaf": la + "/" + ka,
                                    "Buffering bitrate (a/v)": sa + " / " + qa,
                                    "Buffer size in Bytes (a/v)": this.j.lPa() + " / " + this.j.N8a(),
                                    "Buffer size in Bytes": "" + ba,
                                    "Buffer size in Seconds (a/v)": (0,
                                    g.zk)(this.j.U9()) + " / " + (0,
                                    g.zk)(this.j.Iia()),
                                    "Downloadables (a/v)": Z + " / " + fa,
                                    "Current CDN (a/v/t)": (wa ? wa.name + ", Id: " + wa.id : "?") + " / " + (na ? na.name + ", Id: " + na.id : "?") + " / " + (oa ? oa.name + ", Id: " + oa.id : "?")
                                });
                            } catch (Ka) {}
                            try {
                                W = this.j.gf.value;
                                A = {};
                                if (W && W.stream) {
                                    ia = W.stream;
                                    ha = ia.track;
                                    pa = this.uTb.yvb(ha.streams);
                                    va = ia.Zc;
                                    if ((/xheaac/).test(va))
                                        Aa = "xhe-aac";
                                    else if ((/heaac/).test(va))
                                        Aa = "he-aac";
                                    else if ((/ddplus/).test(va))
                                        switch (va) {
                                        case r.Vc.lP:
                                            Aa = "ddplus51";
                                            break;
                                        case r.Vc.mP:
                                            Aa = "ddplus51hq";
                                            break;
                                        case r.Vc.nP:
                                            Aa = "ddplusatmos";
                                            break;
                                        default:
                                            Aa = "ddplus";
                                        }
                                    else
                                        Aa = "unknown";
                                    A["Audio Track"] = ha.oh + ", Id: " + ha.trackId + ", Channels: " + ha.channels + ", Codec: " + pa + " (" + Aa + ")";
                                    A["Audio Tags"] = null === (O = W.stream) || undefined === O ? undefined : O.gl.toString();
                                }
                                ma = this.j.Fe.value;
                                if (ma && ma.stream) {
                                    ra = ma.stream;
                                    ya = this.uTb.mwb(this.j.oa.Mc ? this.j.oa.Mc.streams : []);
                                    ua = ra.Zc;
                                    xa = (/hevc/).test(ua) ? "hevc" : (/h264hpl/).test(ua) ? "avchigh" : (/av1/).test(ua) ? "av1" : "avc";
                                    (/hdr/).test(ua) && (xa += ", hdr");
                                    (/dv/).test(ua) && (xa += ", dv");
                                    (/prk/).test(ua) && (xa += ", prk");
                                    A["Video Track"] = "Codec: " + ya + " (" + xa + ")";
                                    A["Video Tags"] = null === (I = ma.stream) || undefined === I ? undefined : I.gl.toString();
                                }
                                Ca = this.j.sl.value;
                                A["Timed Text Track"] = Ca ? Ca.oh + ", Profile: " + Ca.profile + ", Id: " + Ca.trackId + ", DownloadableId: " + Ca.ob : "none";
                                T.push(A);
                            } catch (Ka) {}
                            try {
                                Ja = this.j.ae;
                                La = this.j.ig.value ? this.j.ig.value.framerate : 0;
                                Na = a(99732).IIb;
                                T.push({
                                    Framerate: La.toFixed(3),
                                    "Current Dropped Frames": (0,
                                    h.wc)(this.SRa) ? this.SRa : "",
                                    "Total Frames": Ja.YA(),
                                    "Total Dropped Frames": Ja.vS(),
                                    "Total Corrupted Frames": Ja.Nba(),
                                    "Main Thread stall/sec": Na ? Na.rsa().join(" ") : "DISABLED",
                                    KeySystem: null === (N = this.j.hm) || undefined === N ? undefined : N.Wy.Oy,
                                    KeyStatus: null === (S = null === (Q = this.j.hm) || undefined === Q ? undefined : Q.kCb) || undefined === S ? undefined : S.call(Q),
                                    VideoDiag: (0,
                                    f.r_a)(this.j.Xsa()),
                                    "HDR support": this.tXa ? this.tXa.result + " (" + this.tXa.reason + ")" : "unknown"
                                });
                            } catch (Ka) {}
                            try {
                                T.push({
                                    Throughput: this.j.sb + " kbps"
                                });
                            } catch (Ka) {}
                            Oa = undefined;
                            try {
                                Object.entries(this.Lwb).forEach(function(Ka) {
                                    var Pa;
                                    Pa = Fa(Ka);
                                    Ka = Pa.next().value;
                                    Pa = Pa.next().value;
                                    Oa = Oa || ({});
                                    Oa[Ka] = JSON.stringify(Pa);
                                });
                                Oa && T.push(Oa);
                            } catch (Ka) {}
                            return T;
                        }
                        ;
                        b.sjb = d;
                    }
