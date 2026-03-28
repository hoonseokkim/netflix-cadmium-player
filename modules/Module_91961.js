/**
 * Netflix Cadmium Playercore - Module 91961
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_91961
 * @description ASE Playgraph playback orchestration; Media buffer management; Segment downloading/fetching; Content prefetching; Timeline/timestamp management; Event system; Track switching; Stream selection; Live streaming support
 * @size 43,726 chars (raw), 25,488 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (20 imports)
 *   d <- Module 22970 (simple)
 *   p <- Module 90745 (simple)
 *   c <- Module 91176 (simple)
 *   g <- Module 66164 (simple)
 *   f <- Module 65161 (simple)
 *   e <- Module 51308 (simple)
 *   h <- Module 69575 (simple)
 *   k <- Module 52571 (simple)
 *   l <- Module 70764 (simple)
 *   m <- Module 48170 (simple)
 *   n <- Module 61996 (simple)
 *   q <- Module 63576 (simple)
 *   r <- Module 30285 (simple)
 *   u <- Module 7520 (simple)
 *   v <- Module 68766 (simple)
 *   w <- Module 81307 (simple)
 *   x <- Module 43071 (simple)
 *   y <- Module 28871 (simple)
 *   A <- Module 34297 (simple)
 *   z <- Module 2948 (simple)
 *
 * @exports (1 exports)
 *   Yjb
 */

// Webpack module 91961
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z;
// [__esModule declaration removed]
// b.Yjb = undefined; [pre-declaration]
import * as d from "./Module_22970"; // a(22970)
import * as p from "./Module_90745"; // a(90745)
import * as c from "./Module_91176"; // a(91176)
import * as g from "./Module_66164"; // a(66164)
import * as f from "./Module_65161"; // a(65161)
import * as e from "./Module_51308"; // a(51308)
import * as h from "./Module_69575"; // a(69575)
import * as k from "./Module_52571"; // a(52571)
import * as l from "./Module_70764"; // a(70764)
import * as m from "./Module_48170"; // a(48170)
import * as n from "./Module_61996"; // a(61996)
import * as q from "./Module_63576"; // a(63576)
import * as r from "./Module_30285"; // a(30285)
import * as u from "./Module_07520"; // a(7520)
import * as v from "./Module_68766"; // a(68766)
import * as w from "./Module_81307"; // a(81307)
import * as x from "./Module_43071"; // a(43071)
import * as y from "./Module_28871"; // a(28871)
import * as A from "./Module_34297"; // a(34297)
import * as z from "./Module_02948"; // a(2948)
t = (function() {
    function B(C, D, E, G, F) {
      undefined === G && (G = new w.Abb());
      undefined === F && (F = new v.zbb());
      this.Vyb = C;
      this.config = D;
      this.BPb = G;
      this.Up = [];
      this.oOb = [];
      this.uA = [];
      this.KOb = new c.Y7();
      this.stats = {
        MGb: 0,
        NGb: 0,
        JGb: 0,
        SPa: 0,
        KGb: 0,
        LGb: 0,
        TPa: 0
      };
      this.events = new p.EventEmitter();
      this.console = (0,
        h.Nf)(g.platform, E, "PREFETCH");
      this.ve = new n.Tm({
          Ig: 10,
          Ej: this,
          source: "Prefetcher"
      });
      this.GOa(new x.hbb(E,D));
      this.GOa(new z.ylb(D));
      this.eSb({
          hI: D.kQc
      });
      this.D5a(F);
      this.ICc();
    }
    Object.defineProperties(B.prototype, {
        lQc: {
          get: function() {
            return this.Up.map(function(C) {
                return C.context;
            });
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(B.prototype, {
        Q4c: {
          get: function() {
            return this.uA;
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: B.BSb(C) */ B.prototype.BSb = function(C) {
      m.u && (0,
        k.assert)(C, "Reconciliation strategy is undefined");
      this.BPb = C;
      return this;
    }
    ;
    /* method: B.GOa(C) */ B.prototype.GOa = function(C) {
      this.oOb.unshift(C);
      return this;
    }
    ;
    /* method: B.W5a(C) */ B.prototype.W5a = function(C) {
      var D;
      m.u && this.console.debug("Wish list changed", {
          Ijd: C.length
      });
      D = (0,
        c.np)(this.Q4c, C);
      this.ve.Eg({
          dropped: D.map(function(E) {
              return (0,
                y.Zf)(E.key);
          }),
          wishlist: C.map(function(E) {
              return (0,
                y.Zf)(E.key);
          })
      });
      D.forEach(function(E) {
          var G;
          return null === (G = E.La) || undefined === G ? undefined : G.call(E);
      });
      this.uA = C;
      this.Aya();
    }
    ;
    /* method: B.reset(C) */ B.prototype.reset = function(C) {
      var D;
      D = this;
      undefined === C && (C = this.config);
      C.wQc ? this.Up.forEach(function(E) {
          return D.Hpb(E);
      }) : this.W5a([]);
    }
    ;
    /* method: B.Hpb(C, D) */ B.prototype.Hpb = function(C, D) {
      var E, G, F;
      E = C.Z;
      G = C.Ada;
      F = C.context;
      undefined === D && (D = false);
      E && (C = undefined,
        D && (C = E.MVa()),
        E.Tg(D ? e.iP.mQc : e.iP.xqa),
        G.ega(function(H) {
            return "segmentNormalized" !== H.yw;
        }),
        D = (0,
          y.Jsa)(F.Nd, E.Z),
        E.gO(D),
        null === C || undefined === C ? undefined : C.release());
    }
    ;
    /* method: B.eSb(C) */ B.prototype.eSb = function(C) {
      m.u && this.console.debug("Budget changed", {
          Rwa: this.q$,
          owa: C
      });
      this.q$ = C;
      this.Aya();
    }
    ;
    /* method: B.yhc(C, D) */ B.prototype.yhc = function(C, D) {
      var E, G, F, H;
      m.u && this.console.debug("Looking for playgraph to claim");
      if (C = this.BPb.jAb(this.Up, {
            Z: C,
            Hl: D
      })) {
        G = this.uA.indexOf(C.context.Nd);
        m.u && this.console.debug(("Claiming item: ").concat((0,
              y.Zf)(C.context.Nd.key)), {
            QY: g.platform.time.fa() - C.o7a,
            buffer: null === (E = C.Z) || undefined === E ? undefined : E.zn(c.I.ia)
        });
        this.GL(C.context, {
            xua: !!C.Z,
            iub: !!C.Z
        });
        C.Da && this.Hpb(C, true);
        if (C.Z) {
          E = C.Z;
          F = C.TU;
          H = E.Fm;
          A.Wjb.aUc(E, H, C.Ada, this.console);
          E.Dc && (E.Dc.Pwb = true);
          F.PVc(E.eB(H) || c.I.ia, G);
          E.qWb({
              hI: this.config.AT || Infinity
          });
          this.events.emit("itemClaimed", {
              type: "itemClaimed",
              wishListItem: C.context.Nd,
              videoBytesBuffered: C.Z.XL().PO,
              audioBytesBuffered: C.Z.XL().TK
          });
        }
      }
      D.Jbc || this.reset(D);
      return null === C || undefined === C ? undefined : C.Z;
    }
    ;
    /* method: B.vhc() */ B.prototype.vhc = function() {}
    ;
    /* method: B.getStats() */ B.prototype.getStats = function() {
      var C;
      C = g.platform.time.fa();
      return {
        wishListLength: this.uA.length,
        prefetchList: this.lQc.length,
        contents: this.Up.map(function(D) {
            var E, G, F, H, J;
            if (D.Z) {
              J = (0,
                y.Jsa)(D.context.Nd, D.Z.Z);
              J = D.Z.eB(J);
              J = D.Z.zn(J || c.I.ia);
            }
            return {
              id: (0,
                y.Zf)(D.context.Nd.key),
              buffer: J,
              pId: null === (E = D.Z) || undefined === E ? undefined : E.id,
              budget: {
                inMemoryBytes: D.context.IGb.hI
              },
              weight: D.context.fya,
              age: C - D.o7a,
              timeOpened: C - (null !== (G = D.h1c) && undefined !== G ? G : 0),
              state: f.Yd[null !== (H = null === (F = D.Z) || undefined === F ? undefined : F.se.value) && undefined !== H ? H : f.Yd.Wt]
            };
        }),
        aggregated: {
          itemsRequested: this.stats.MGb,
          itemsStarted: this.stats.NGb,
          itemsClaimed: this.stats.JGb,
          bytesClaimed: this.stats.SPa,
          itemsCompleted: this.stats.KGb,
          itemsDiscarded: this.stats.LGb,
          bytesDiscarded: this.stats.TPa
        }
      };
    }
    ;
    /* method: B.GL(C) */ B.prototype.GL = function(C) {
      d.__awaiter(this, arguments, undefined, function(D, E) {
          var G, F, H, J, M, K, L, O, I, N;
          undefined === E && (E = {});
          return d.__generator(this, function(Q) {
              switch (Q.label) {
                case 0:
                G = d.__assign({
                    xua: false,
                    ZGb: false,
                    iub: false
                  }, E);
                F = G.xua;
                H = G.ZGb;
                J = G.iub;
                M = (0,
                  c.kc)(this.Up, function(S) {
                    return S.context === D;
                });
                H || J || (null === (I = (O = D.Nd).La) || undefined === I ? undefined : I.call(O));
                if (!M)
                return [3, 3];
                this.ve.Eg({
                    prefetchItem: (0,
                      y.Zf)(D.Nd.key)
                });
                this.Up.splice(this.Up.indexOf(M), 1);
                H || (K = this.uA.length,
                  this.uA = this.uA.filter(function(S) {
                      return S !== D.Nd;
                  }),
                  m.u && this.console.info("Dropping items from wishlist", K - this.uA.length),
                  this.uA.length >= K && m.u && this.console.warn("Unable to filter out wishlist item", this.uA.map(function(S) {
                        return S.key;
                    }), D.Nd.key));
                m.u && this.console.debug("Dropping playgraph", {
                    QY: g.platform.time.fa() - M.o7a,
                    buffer: null === (N = M.Z) || undefined === N ? undefined : N.zn(c.I.ia),
                    J: (0,
                      y.Zf)(D.Nd.key),
                    Okd: !F,
                    Ted: !H
                });
                M.Xj.clear();
                if (F)
                return [3, 2];
                L = this.tF(M);
                return M.Z ? [4, L] : [3, 2];
                case 1:
                (Q.T(),
                  Q.label = 2);
                case 2:
                (this.Aya(),
                  Q.label = 3);
                case 3:
                return [2];
              }
          });
      });
    }
    ;
    /* method: B.D5a(C) */ B.prototype.D5a = function(C) {
      (0,
        k.assert)(C, "Playgraph resolver is undefined");
      this.H2a = C;
      return this;
    }
    ;
    /* method: B.ICc() */ B.prototype.ICc = function() {
      var C;
      C = this;
      this.events.on("prefetchComplete", function() {
          return C.stats.KGb++;
      });
      this.events.on("prefetchStarted", function() {
          return C.stats.NGb++;
      });
      this.events.on("itemQueued", function() {
          return C.stats.MGb++;
      });
      this.events.on("itemClaimed", function(D) {
          var E, G;
          C.stats.JGb++;
          C.stats.SPa += (null !== (E = D.g4c) && undefined !== E ? E : 0) + (null !== (G = D.idc) && undefined !== G ? G : 0);
      });
      this.events.on("itemDropped", function(D) {
          var E, G;
          C.stats.LGb++;
          C.stats.TPa += (null !== (E = D.g4c) && undefined !== E ? E : 0) + (null !== (G = D.idc) && undefined !== G ? G : 0);
      });
    }
    ;
    /* method: B.Aya() */ B.prototype.Aya = function() {
      var C;
      C = this;
      this.KOb.ioa ? Promise.resolve() : this.KOb.W4c(function() {
          var D, E, G, F, H;
          D = c.$F.vM({
              R4c: C.uA,
              cXa: C.q$
            }, C.oOb.map(function(J) {
                return J.aQa.bind(J);
          })).Up;
          E = (0,
            c.np)(D, C.Up, function(J, M) {
              return (0,
                y.isEqual)(J.Nd.key, M.context.Nd.key);
          });
          G = (0,
            c.np)(C.Up, D, function(J, M) {
              return (0,
                y.isEqual)(J.context.Nd.key, M.Nd.key);
          });
          F = (0,
            c.np)(C.Up, G);
          m.u && C.console.debug(("Re-evaluated prefetch items. new:").concat(E.length, ", evict: ").concat(G.length, ", update: ").concat(E.length));
          C.ve.Eg({
              toKeep: F.map(function(J) {
                  return (0,
                    y.Zf)(J.context.Nd.key);
              }),
              toEvict: G.map(function(J) {
                  return (0,
                    y.Zf)(J.context.Nd.key);
              }),
              newContexts: E.map(function(J) {
                  return (0,
                    y.Zf)(J.Nd.key);
              })
          });
          G = G.map(function(J) {
              return d.__awaiter(C, undefined, undefined, function() {
                  var M, K, L;
                  return d.__generator(this, function(O) {
                      switch (O.label) {
                        case 0:
                        (M = J.context.Nd.key,
                          m.u && this.console.debug("Releasing playgraph", (0,
                              y.Zf)(M)),
                          O.label = 1);
                        case 1:
                        return (O.ac.push([1, , 3, 4]),
                          [4, this.tF(J)]);
                        case 2:
                        return (O.T(),
                          [3, 4]);
                        case 3:
                        return (this.events.emit("itemEvicted", {
                              type: "itemEvicted",
                              wishListItem: J.context.Nd
                          }),
                          null === (L = (K = J.context.Nd.He).La) || undefined === L ? undefined : L.call(K),
                          [7]);
                        case 4:
                        return [2];
                      }
                  });
              });
          });
          H = F.map(function(J) {
              return d.__awaiter(C, undefined, undefined, function() {
                  var M, K;
                  return d.__generator(this, function(L) {
                      switch (L.label) {
                        case 0:
                        (M = (0,
                            c.kc)(D, function(O) {
                              return (0,
                                y.isEqual)(O.Nd.key, J.context.Nd.key);
                          }),
                          (0,
                            k.assert)(M, "Couldn't find the requested item context"),
                          J.context = M,
                          L.label = 1);
                        case 1:
                        return (L.ac.push([1, 3, , 4]),
                          [4, J.dya]);
                        case 2:
                        return (K = L.T(),
                          [3, 4]);
                        case 3:
                        return (L.T(),
                          [2]);
                        case 4:
                        return ((0,
                            c.kc)(this.Up, function(O) {
                              return O === J;
                          }) && (this.Srb(J.context, K),
                            this.events.emit("itemReevaluated", {
                                type: "itemReevaluated",
                                wishListItem: J.context.Nd
                          })),
                          [2]);
                      }
                  });
              });
          });
          E = E.map(function(J) {
              var M;
              M = C.emc(J);
              C.events.emit("itemQueued", {
                  type: "itemQueued",
                  wishListItem: J.Nd
              });
              return M;
          });
          C.Up = d.__spreadArray(d.__spreadArray([], d.__read(F), false), d.__read(E), false);
          F = E.map(function(J) {
              return J.dya.catch(function() {});
          });
          F = G.concat(H).concat(F);
          return Promise.all(F);
      });
    }
    ;
    /* method: B.tF(C) */ B.prototype.tF = function(C) {
      return d.__awaiter(this, undefined, undefined, function() {
          var D, E, G;
          return d.__generator(this, function(F) {
              switch (F.label) {
                case 0:
                return (F.ac.push([0, 3, , 4]),
                  [4, C.dya]);
                case 1:
                return (D = F.T(),
                  m.u && this.console.debug("Removing prefetch playgraph", {
                      size: D.zn(c.I.ia)
                  }),
                  C.Xj.clear(),
                  [4, this.Vyb()]);
                case 2:
                return (E = F.T(),
                  E.tF(D),
                  this.events.emit("itemDropped", {
                      type: "itemDropped",
                      wishListItem: C.context.Nd,
                      videoBytesBuffered: D.XL().PO,
                      audioBytesBuffered: D.XL().TK
                  }),
                  [3, 4]);
                case 3:
                return (G = F.T(),
                  m.u && this.console.trace("Non fatal error in removing playgraph", G),
                  [3, 4]);
                case 4:
                return [2];
              }
          });
      });
    }
    ;
    /* method: B.ERa(C) */ B.prototype.ERa = function(C) {
      return d.__awaiter(this, undefined, undefined, function() {
          var D, E, G, F, H, J, M, K, L, O, I, N, Q, S, T, U;
          S = this;
          return d.__generator(this, function(X) {
              switch (X.label) {
                case 0:
                return (D = C.context,
                  E = (0,
                    y.Zf)(D.Nd.key),
                  m.u && this.console.debug("Creating playgraph", E),
                  [4, this.H2a.$Ib(D)]);
                case 1:
                return (G = X.T(),
                  [4, D.Nd.He.Ns(E).vv]);
                case 2:
                F = X.T();
                H = F.S;
                if (H.RD)
                return (this.GL(D, {
                      xua: true
                  }),
                  [2, Promise.reject(("contentPlaygraph viewable:").concat(E) + " is not supported with prefetching")]);
                if ((0,
                    c.qB)(H.rf))
                if ((J = this.config.bva,
                    M = !(null === (U = null === (T = H.EF) || undefined === T ? undefined : T.tO) || undefined === U || !U.tB),
                    J || (J = M && this.config.cva),
                    J))
                C.Da = true;
                else
                return (this.GL(D, {
                      xua: true
                  }),
                  [2, Promise.reject(("live title encountered viewable:").concat(E) + " disabling header fetch / normalization")]);
                K = D.Hl;
                L = K.$D && (H.Bs ? K.nqc : true);
                O = K.qy || "LINEAR" === H.rf && K.F_;
                I = Object.create(K, {
                    $D: {
                      value: L
                    },
                    qy: {
                      value: O
                    }
                });
                return [4, this.Vyb()];
                case 3:
                return (N = X.T(),
                  Q = N.G9(G, D.fya, I, D.Nd.He, false),
                  C.Xj.addListener(Q.events, "error", function(Y) {
                      m.u && S.console.debug("Prefetch playgraph resulted in error", Y.ej);
                      S.GL(D);
                  }),
                  [2, Q]);
              }
          });
      });
    }
    ;
    /* method: B.sNc(C, D) */ B.prototype.sNc = function(C, D) {
      return d.__awaiter(this, undefined, undefined, function() {
          var E, G, F, H;
          return d.__generator(this, function(J) {
              switch (J.label) {
                case 0:
                return (E = C.context,
                  G = (0,
                    y.Zf)(E.Nd.key),
                  F = E.Nd.He.Ns(G),
                  [4, F.vv]);
                case 1:
                return (H = J.T(),
                  this.Srb(E, D),
                  this.ncc(E, D, !!H.Aw),
                  D.Dc && (D.Dc.Pwb = false),
                  D.open(),
                  D.zt({
                      kV: function(M, K) {
                        var L, O;
                        L = M.recommendedMedia;
                        O = L ? (0,
                          c.hn)(K, function(I) {
                            return I.new_track_id === L.ew;
                        }) : (0,
                          c.hn)(K, function(I) {
                            return I.track_id === M.defaultTrackOrderList[0].audioTrackId;
                        });
                        return 0 <= O && O < K.length ? O : undefined;
                      }
                    }, {
                      kV: function(M, K) {
                        var L, O;
                        L = M.recommendedMedia;
                        O = L ? (0,
                          c.hn)(K, function(I) {
                            return I.new_track_id === L.eo;
                        }) : (0,
                          c.hn)(K, function(I) {
                            return I.track_id === M.defaultTrackOrderList[0].videoTrackId;
                        });
                        return 0 <= O && O < K.length ? O : undefined;
                      }
                  }),
                  m.u && this.console.trace("Open Playgraph/seekstreaming", {
                      J: (0,
                        y.Zf)(C.context.Nd.key)
                  }),
                  D.gO((0,
                      y.Jsa)(E.Nd, D.Z)),
                  this.zTc(C, F),
                  F.ty && (m.u && this.console.warn("Viewable churn encountered during prefetcher (expired on initialization)", G),
                    this.GL(C.context)),
                  [2]);
              }
          });
      });
    }
    ;
    /* method: B.zTc(C, D) */ B.prototype.zTc = function(C, D) {
      var G;
      function E(F) {
        m.u && G.console.debug(("Viewable ").concat(F ? "superseded" : "expired"), (0,
            y.Zf)(C.context.Nd.key));
        C.yid = true;
        G.GL(C.context, {
            ZGb: !F && G.config.qFc
        });
      }
      G = this;
      D.events && (C.Xj.addListener(D.events, "viewableEvicted", function() {
            E(true);
        }),
        C.Xj.addListener(D.events, "viewableExpired", function() {
            E(false);
      }));
      this.events.emit("prefetchStarted", {
          type: "prefetchStarted",
          wishListItem: C.context.Nd
      });
    }
    ;
    /* method: B.Srb(C, D) */ B.prototype.Srb = function(C, D) {
      D.q8a(C.fya);
      D.qWb(C.IGb);
    }
    ;
    /* method: B.ncc(C, D, E) */ B.prototype.ncc = function(C, D, E) {
      var G;
      G = C.fUb;
      C = G.audio;
      G = G.video;
      E && G.push(new u.C7(this.console,D.config));
      D.L5a(new q.bA(C,true), new q.bA(G,true));
    }
    ;
    /* method: B.emc(C) */ B.prototype.emc = function(C) {
      var D, E, G;
      D = this;
      E = new l.Xjb();
      G = {
        context: C,
        o7a: g.platform.time.fa(),
        Xj: new p.sf(),
        TU: E
      };
      G.dya = this.ERa(G).then(function(F) {
          return d.__awaiter(D, undefined, undefined, function() {
              var H, J;
              J = this;
              return d.__generator(this, function(M) {
                  switch (M.label) {
                    case 0:
                    for (H = F; H.za; )
                    H = H.za;
                    F.Xc(E);
                    E.cdc(F);
                    G.Ada = new r.Icb(H.events,{
                        JYc: function(K) {
                          var L, O;
                          L = K.yw;
                          switch (L) {
                            case "buffering":
                            return false;
                            case "segmentStarting":
                            O = K.gn[0];
                            G.Ada.ega(function(I) {
                                if ("segmentStarting" === I.yw)
                                return I.gn[0].M === O.M;
                                if (O.initial && "initialAudioTrack" === I.yw)
                                return true;
                            });
                            return true;
                            case "bufferingStarted":
                            G.Ada.ega(function(I) {
                                return "bufferingComplete" === I.yw || "updateStreamingPts" === I.yw;
                            });
                            case "openComplete":
                            case "updateStreamingPts":
                            case "bufferingComplete":
                            G.Ada.ega(function(I) {
                                return I.yw === L;
                            });
                            default:
                            return true;
                          }
                        }
                    });
                    H.events.on("bufferingComplete", function() {
                        J.events.emit("prefetchComplete", {
                            type: "prefetchComplete",
                            wishListItem: C.Nd
                        });
                    });
                    return [4, this.sNc(G, F)];
                    case 1:
                    return (M.T(),
                      G.h1c = g.platform.time.fa(),
                      G.Z = F,
                      [2, F]);
                  }
              });
          });
      });
      G.dya.catch(function(F) {
          var H;
          H = (0,
            y.Zf)(G.context.Nd.key);
          m.u && D.console.error(("Exception occurred creating playgraph ").concat(H), F);
          D.GL(G.context);
      });
      return G;
    }
    ;
    d.__decorate([(0,
          n.kb)({
            methodName: "setWishList",
            df: true
      })], B.prototype, "W5a", null);
    d.__decorate([(0,
          n.kb)({
            methodName: "reset",
            df: true
      })], B.prototype, "reset", null);
    d.__decorate([(0,
          n.kb)({
            methodName: "dropPrefetchItem",
            df: true
      })], B.prototype, "GL", null);
    d.__decorate([(0,
          n.kb)({
            methodName: "processWishList",
            df: true
      })], B.prototype, "Aya", null);
    return B;
  }
)();
export const Yjb = t;

// Detected exports: Yjb
