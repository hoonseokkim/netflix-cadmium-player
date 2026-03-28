/**
 * @module Module_45991
 * @description Class module with ES module exports
 * @categories Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 45991
 * Deobfuscated size: 19628 chars
 * Functions: 21
 * Prototype definitions: 9
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 45991
{
                        var p, c, g, f, e, h, k, l, m, n, q, r;
                        function d(u, v) {
                            var w;
                            w = v && u.ba[v];
                            if (w)
                                return w.type !== c.ed.content ? d(u, w.Oc) : v;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.O9a = undefined;
                        p = a(91176);
                        c = a(79048);
                        g = a(48170);
                        f = a(52571);
                        e = a(14103);
                        h = a(3758);
                        k = a(88700);
                        l = a(15905);
                        m = a(73803);
                        n = a(70778);
                        q = a(45496);
                        r = a(77184);
                        t = (function() {
                            function u(v, w, x, y, A, z) {
                                this.Eh = v;
                                this.console = w;
                                this.za = x;
                                this.config = y;
                                this.Lz = A;
                                this.jpc = [new r.hkb(w), new h.gkb(w), new q.ikb(), new k.wfb(y,w), new l.Tbb(), new m.Sbb(z), new n.Ohb()].filter(p.gd);
                            }
                            u.prototype.ySb = function() {
                                this.vna = undefined;
                            }
                            ;
                            u.prototype.YH = function(v, w, x, y, A) {
                                var z, B, C;
                                B = (null === A || undefined === A ? undefined : A.J) === x ? A : this.za.Ju().filter(function(D) {
                                    return D.J === x;
                                })[0];
                                A = Array.from(this.za.player.bb).map(function(D) {
                                    return D.K;
                                });
                                C = null === (z = this.za.Dc) || undefined === z ? undefined : z.Wi;
                                z = this.za.player.$L();
                                v = {
                                    GIb: B,
                                    Sa: v,
                                    spc: y,
                                    Ub: w,
                                    cL: A.map(function(D) {
                                        return null === C || undefined === C ? undefined : C.pS(D.id);
                                    }).filter(p.gd),
                                    GFc: z && (null === C || undefined === C ? undefined : C.pS(z.K.id))
                                };
                                y = this.jpc.map(function(D) {
                                    return D.YH.bind(D);
                                });
                                v = p.$F.vM(v, y);
                                g.u && this.console.info("Evaluated ad-break drop", {
                                    Ub: w,
                                    Xbd: A.map(function(D) {
                                        return D.id;
                                    }),
                                    result: v
                                });
                                return v;
                            }
                            ;
                            u.prototype.DEc = function(v, w) {
                                var x;
                                return v.offset.equal(p.I.ia) ? true : w.Ab && (null === (x = w.Rh) || undefined === x ? 0 : x.startTime) ? (w = w.Ic.rvb(p.I.ia),
                                this.console.trace(("Checking ").concat(v.offset.G, " against ").concat(w.G, " for live seek")),
                                v.offset.G === w.G) : false;
                            }
                            ;
                            u.prototype.Nrb = function(v, w, x) {
                                var y, A, z, B, C, D, E, G, F, H, J, M, K, L;
                                undefined === x && (x = this.za.Ib);
                                B = x.Z;
                                C = null === (y = x.QI.get(v.M)) || undefined === y ? undefined : y.J;
                                (0,
                                f.assert)(undefined !== C, "AdPolicies::applyAdPoliciesToSeekPosition: viewableId must exist in outermost playgraph for segment: " + v.M);
                                D = this.Eh.fu[C];
                                E = y = w.CH(v);
                                G = B.ba[y.M];
                                F = (0,
                                e.WL)(y.M);
                                D && undefined !== (null === F || undefined === F ? undefined : F.Ub) ? H = D[F.Ub] : D && (null === F || undefined === F ? 0 : F.hb) && (H = D.filter(function(O) {
                                    return O.hb === F.hb;
                                })[0]);
                                g.u && this.console.debug("AdPolicies::applyAdPoliciesToSeekPosition", {
                                    Fm: v,
                                    ISa: y
                                });
                                J = this.Lz.get(C);
                                (0,
                                f.assert)(J, "AdPolicies::applyAdPoliciesToSeekPosition: viewable must exist: " + C);
                                if (this.DEc(y, J))
                                    M = this.qWa(B, D, y);
                                else {
                                    G.type === c.ed.padding && (y = {
                                        M: G.Oc,
                                        offset: p.I.ia
                                    });
                                    if (C = null === (A = this.za.player.$L()) || undefined === A ? undefined : A.K.id)
                                        K = C;
                                    else
                                        (A = d(B, B.Ef),
                                        this.za.En && this.za.player.Hw || this.za.Baa() || A !== y.M || !this.config.J_ ? K = A : M = this.qWa(B, D, w.CH({
                                            M: v.M,
                                            offset: p.I.ia
                                        })));
                                    !M && K && (g.u && this.console.trace(("ads::seekStreaming: seek from segment ").concat(K)),
                                    M = this.Eyc(K, y, x));
                                }
                                v = !(null === (z = J.wd) || undefined === z || !z.Uj);
                                z = null === M || undefined === M ? undefined : M.Sa.bya.pz;
                                H = null === H || undefined === H ? undefined : H.bya.pz;
                                z = v || z || H;
                                if (M && !z)
                                    if (M.M) {
                                        E = {
                                            M: M.M,
                                            offset: p.I.ia
                                        };
                                        g.u && this.console.debug("AdPolicies::applyAdPoliciesToSeekPosition adjusting entrypoint", {
                                            ISa: y
                                        });
                                        G.type === c.ed.vc && (y = {
                                            M: y.M,
                                            offset: p.I.ia
                                        },
                                        g.u && this.console.debug("AdPolicies::applyAdPoliciesToSeekPosition snapping entrypoint to beginning of ad", {
                                            ISa: y
                                        }));
                                        L = y;
                                    } else
                                        G.type !== c.ed.vc && (this.vna = M.Sa);
                                K = {
                                    ZAc: z ? G.type === c.ed.vc : !!M,
                                    vuc: K,
                                    to: y
                                };
                                L || G.type !== c.ed.vc || H || (g.u && this.console.debug("AdPolicies::applyAdPoliciesToSeekPosition seeking to an ad, defaulting entryPoint", {
                                    PA: L,
                                    ISa: y
                                }),
                                y.offset.greaterThan(p.I.ia) && (g.u && this.console.debug("AdPolicies::resetting seek position to beginning of ad"),
                                y = {
                                    M: y.M,
                                    offset: p.I.ia
                                }),
                                E = L = y);
                                g.u && this.console.debug("AdPolicies::applyAdPoliciesToSeekPosition returning: ", ("{ seekPosition: ").concat(E, ", entryPoint: ").concat(L, ", policy: ").concat(K));
                                return {
                                    Fm: E,
                                    PA: L,
                                    J2a: K
                                };
                            }
                            ;
                            u.prototype.X5a = function(v, w, x, y) {
                                if (this.vna)
                                    return (w = this.vna,
                                    this.vna = undefined,
                                    w);
                                if ((v = this.Eh.fu[v]) && v.length)
                                    if (x && w.M === y && w.offset.equal(p.I.ia)) {
                                        if ((w = v[0],
                                        0 === w.location.G && w.empty && !w.ah && !w.S0))
                                            return w;
                                    } else if (!x)
                                        return this.nVa(w.M, v);
                            }
                            ;
                            u.prototype.Eyc = function(v, w, x) {
                                var y, A, z, B, C, D, E;
                                g.u && this.console.trace("AdPoliciesManager: getPrerollAdOnSeek: " + ("from ").concat(v, " to ").concat(JSON.stringify(w)));
                                if (x) {
                                    A = x.$M(w.M);
                                    (0,
                                    f.assert)(A, "inner WorkingPlaygraph segmentId should map correctly to outermost");
                                    z = this.Eh.fu[x.QI.Z.ba[A].J];
                                    B = x.Z.ba;
                                    C = null === (y = B[v]) || undefined === y ? undefined : y.Oc;
                                    B[v] || (C = this.za.Z.ba[v].Oc);
                                    D = undefined;
                                    E = undefined;
                                    v = function() {
                                        var F, H, J;
                                        F = B[C];
                                        if (!F)
                                            return (G.console.warn(("AdPoliciesManager: getPrerollOnSeek: segment ").concat(C, " not found")),
                                            "break");
                                        if (F.type === c.ed.content && (D === c.ed.content || undefined === D) && z) {
                                            H = G.nVa(C, z);
                                            H && (E = {
                                                Sa: H
                                            });
                                        }
                                        if (C === w.M)
                                            return (H = (F = E && !E.M) || D && D !== c.ed.content ? E : undefined,
                                            g.u && G.console.trace("AdPoliciesManager: getPrerollOnSeek: returning", {
                                                result: H,
                                                Mhd: E,
                                                pfd: F
                                            }),
                                            {
                                                value: H
                                            });
                                        if (F.type === c.ed.vc && D !== c.ed.vc) {
                                            g.u && G.console.trace(("AdPoliciesManager: getPrerollOnSeek: found start of ad break: ").concat(C));
                                            J = (0,
                                            e.WL)(C);
                                            (0,
                                            f.assert)(J, "AdPoliciesManager: getPrerollOnSeek: Unable to find ad from ad segmentId");
                                            (H = undefined !== J.Ub ? z[J.Ub] : (0,
                                            p.kc)(z, function(M) {
                                                return M.hb === J.hb;
                                            })) && (E = {
                                                M: C,
                                                Sa: H
                                            });
                                        }
                                        D = F.type;
                                        C = F.Oc;
                                    }
                                    ;
                                    for (var G = this; C; ) {
                                        x = v();
                                        if ("object" === typeof x)
                                            return x.value;
                                        if ("break" === x)
                                            break;
                                    }
                                }
                                g.u && this.console.trace("AdPoliciesManager: getPrerollOnSeek: returning undefined");
                            }
                            ;
                            u.prototype.qWa = function(v, w, x) {
                                var y, A, z;
                                y = v.ba;
                                x = x.M;
                                A = y[x];
                                if (A) {
                                    A = A.type;
                                    if (A === c.ed.padding)
                                        return this.qWa(v, w, {
                                            M: y[x].Oc,
                                            offset: p.I.ia
                                        });
                                    g.u && this.console.trace("AdPoliciesManager: getPrerollAdBreakForPlaygraph", x);
                                    if (A === c.ed.vc) {
                                        z = (0,
                                        e.WL)(x);
                                        (0,
                                        f.assert)(z, "getPrerollAdBreakForPlaygraph: getPrerollSegmentId: Unable to find ad from ad segmentId");
                                        w = undefined !== z.Ub ? w[z.Ub] : (0,
                                        p.kc)(w, function(B) {
                                            return B.hb === z.hb;
                                        });
                                        (0,
                                        f.assert)(w, "getPrerollAdBreakForPlaygraph: Unable to find ad break");
                                        return {
                                            M: x,
                                            Sa: w
                                        };
                                    }
                                    if (A === c.ed.content) {
                                        if (v = this.nVa(x, w))
                                            return {
                                                Sa: v
                                            };
                                        w = this.ayc(x, w);
                                        if ("dynamic" === (null === w || undefined === w ? undefined : w.type))
                                            return {
                                                M: x,
                                                Sa: w
                                            };
                                    } else
                                        g.u && (0,
                                        f.assert)(true, "Can't get preroll; initial segment was padding and it had no default next segment");
                                } else
                                    g.u && this.console.warn(("AdPoliciesManager: getPrerollAdBreakForPlaygraph: segment ").concat(x, " not found"));
                            }
                            ;
                            u.prototype.nVa = function(v, w) {
                                v = (0,
                                e.gVa)(v);
                                (0,
                                f.assert)(v, "Should have contentInfo from segment name");
                                if (0 < v.PZ)
                                    if ((w = w[v.PZ - 1],
                                    g.u && this.console.trace("getEmptyAdForSegment", {
                                        ogd: !!w,
                                        Sa: w && ({
                                            index: w.Ub,
                                            empty: w.empty,
                                            ah: w.ah,
                                            S0: w.S0,
                                            source: w.source
                                        })
                                    }),
                                    !w))
                                        g.u && this.console.warn("AdPoliciesManager: getNonEmptyAdForSegment: adBreak not found");
                                    else if (w.empty && !w.ah && !w.S0)
                                        return w;
                            }
                            ;
                            u.prototype.ayc = function(v, w) {
                                v = (0,
                                e.gVa)(v);
                                (0,
                                f.assert)(v, "Should have contentInfo from segment name");
                                if (0 < v.PZ)
                                    if ((w = w[v.PZ - 1],
                                    !w))
                                        g.u && this.console.warn("AdPoliciesManager: getNonEmptyAdForSegment: adBreak not found");
                                    else if (!w.empty && !w.ah && !w.S0)
                                        return w;
                            }
                            ;
                            return u;
                        }
                        )();
                        b.O9a = t;
                    }
