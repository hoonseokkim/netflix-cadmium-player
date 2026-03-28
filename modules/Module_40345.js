/**
 * Netflix Cadmium Playercore - Module 40345
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_40345
 * @description ASE Playgraph playback orchestration; Manifest/MPD parsing; Segment downloading/fetching; Content prefetching; Ad break management; Configuration management; Event system; Track switching; Stream selection; Live streaming support; Logging/telemetry
 * @size 54,817 chars (raw), 30,434 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (18 imports)
 *   c <- Module 22970 (simple)
 *   g <- Module 90745 (simple)
 *   f <- Module 79048 (simple)
 *   e <- Module 91176 (simple)
 *   h <- Module 66164 (simple)
 *   k <- Module 48170 (simple)
 *   l <- Module 52571 (simple)
 *   m <- Module 95650 (simple)
 *   n <- Module 61996 (simple)
 *   q <- Module 54366 (simple)
 *   r <- Module 94328 (simple)
 *   u <- Module 37564 (simple)
 *   v <- Module 79118 (simple)
 *   w <- Module 45991 (simple)
 *   x <- Module 8707 (simple)
 *   y <- Module 14314 (simple)
 *   A <- Module 14103 (simple)
 *   z <- Module 98589 (simple)
 *
 * @exports (1 exports)
 *   D9a
 */

// Webpack module 40345
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z;
function d(B, C, D) {
  return B && B.vuc === C && B.to.M === D.M && B.to.offset.G === D.offset.G;
}
function p(B) {
  return null === B || undefined === B ? undefined : B.map(function(C) {
      var D, E;
      E = (C.xa.yb || []).map(function(G) {
          return ("").concat(G.id);
      }).join(",");
      return ("[").concat(null !== (D = C.xa.hb) && undefined !== D ? D : "", ":").concat(C.xa.source, ":[").concat(E, "]");
  }).join(",");
}
// [__esModule declaration removed]
// b.D9a = undefined; [pre-declaration]
import * as c from "./Module_22970"; // a(22970)
import * as g from "./Module_90745"; // a(90745)
import * as f from "./Module_79048"; // a(79048)
import * as e from "./Module_91176"; // a(91176)
import * as h from "./Module_66164"; // a(66164)
import * as k from "./Module_48170"; // a(48170)
import * as l from "./Module_52571"; // a(52571)
import * as m from "./Module_95650"; // a(95650)
import * as n from "./Module_61996"; // a(61996)
import * as q from "./Module_54366"; // a(54366)
import * as r from "./Module_94328"; // a(94328)
import * as u from "./Module_37564"; // a(37564)
import * as v from "./Module_79118"; // a(79118)
import * as w from "./Module_45991"; // a(45991)
import * as x from "./Module_08707"; // a(8707)
import * as y from "./Module_14314"; // a(14314)
import * as A from "./Module_14103"; // a(14103)
import * as z from "./Module_98589"; // a(98589)
t = (function() {
    function B(C, D, E, G, F, H, J, M) {
      var K;
      K = this;
      this.config = C;
      this.console = D;
      this.za = E;
      this.rd = G;
      this.av = F;
      this.jE = H;
      this.uGb = J;
      this.Lz = M;
      this.Gv = {};
      this.coa = this.kna = false;
      this.wob = new WeakMap();
      this.events = new g.EventEmitter();
      this.console = (0,
        e.Nf)(h.platform, this.console, "ADCOMPOSER");
      this.tk = new n.Tm({
          Ej: this,
          source: "ad-composer",
          Ig: 10,
          console: D
      });
      this.hac = new y.y9a(this.console,this.config);
      this.za.jf.Xc(new q.ko(this.tk));
      this.za.CD.events.on("onDeciding", function(L) {
          k.u && K.console.trace("Handling branch decision event", {
              id: L.ga.id
          });
          (L = c.__read(K.za.bb.yn(L.ga.id).filter(function(O) {
                  return O.om;
              }), 1)[0]) && K.cJ(L.L);
      });
      this.za.events.on("branchEnqueued", function(L) {
          var O, I, N;
          k.u && K.console.trace("Handling branch enqueued event", {
              id: L.ma.K.id
          });
          O = K.Wi.WL(L.ma.K.id);
          if (null === O || undefined === O ? 0 : O.hb)
          (K.cn.fQa(O.hb),
            K.cJ(L.ma.L));
          else if (undefined !== (null === O || undefined === O ? undefined : O.Ub) && L.ma.L.Ab) {
            I = undefined;
            N = K.Eh.fu[L.ma.L.J];
            N && (I = N[O.Ub],
              I.hb && (K.cn.fQa(I.hb),
                K.cJ(L.ma.L)));
            k.u && K.console.log("Handled branch enqueued event for embedded ad break", {
                index: O.Ub,
                nia: null === I || undefined === I ? undefined : I.hb
            });
          }
      });
      this.za.CD.abc(function(L, O) {
          var I;
          I = L.ma;
          if (K.za.bb.$sa(I))
          return O(L);
          k.u && K.console.trace("Disallowing tracking due to no children", {
              K: I.K.id
          });
          return {
            result: false
          };
      });
      this.za.events.on("segmentNormalized", function(L) {
          var O;
          O = K.za.Ib.bJb(L.segmentId);
          k.u && K.console.trace("Handling segment normalized event", {
              id: L.segmentId
            }, ("mapped to ").concat(O));
          O && K.$Mc(O, L);
      });
      this.av.events.on("adsUpdated", function(L) {
          K.DMc(L.L, L.dwa);
      });
    }
    Object.defineProperties(B.prototype, {
        KFc: {
          get: function() {
            return this.kna;
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(B.prototype, {
        nOa: {
          get: function() {
            var C, D, F, H;
            D = {};
            try {
              for (var E = c.__values(Object.keys(this.Gv)), G = E.next(); !G.done; G = E.next()) {
                F = G.value;
                H = this.Gv[F];
                D[F] = H ? {
                  cc: H.map(u.IUa)
                } : undefined;
              }
            } catch (M) {
              var J;
              J = {
                error: M
              };
            } finally {
              try {
                G && !G.done && (C = E.return) && C.call(E);
              } finally {
                if (J)
                throw J.error;
              }
            }
            return D;
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: B.Vra() */ B.prototype.Vra = function() {
      var C;
      C = this;
      return Object.keys(this.Gv).filter(function(D) {
          return C.Gv[D];
      });
    }
    ;
    /* method: B.RUa(C) */ B.prototype.RUa = function(C) {
      return this.Gv[C];
    }
    ;
    /* method: B.DMc(C, D) */ B.prototype.DMc = function(C, D) {
      this.whc(C, D);
      this.cJ(C);
    }
    ;
    /* method: B.cJ(C, D) */ B.prototype.cJ = function(C, D) {
      undefined === D && (D = false);
      (this.b9(C) || D) && this.events.emit("adsUpdated", {
          type: "adsUpdated"
      });
    }
    ;
    /* method: B.whc(C, D) */ B.prototype.whc = function(C, D) {
      var E;
      E = this.jE(C);
      E && (C = C.cg) && C.model.cc.filter(function(G) {
          return D.some(function(F) {
              return F.equal(G.Ga);
          });
      }).forEach(function(G) {
          G.hb && E.uhc(G.hb, G);
      });
    }
    ;
    /* method: B.b9(C) */ B.prototype.b9 = function(C) {
      var D, E, G, F, H;
      E = this.QUc(C);
      G = E.kzb;
      F = E.nOa;
      H = (0,
        x.PY)(G, F);
      E = H.Lq;
      H = H.reason;
      if (E)
      (k.u && this.console.trace("Updating metadata", {
            L: C.R,
            reason: H,
            Dqb: p(F),
            nOa: F
        }),
        this.tk.Eg({
            c: E,
            ab: null === F || undefined === F ? undefined : F.length
        }),
        F && (this.Eh.Vza(C.R, F),
          this.HY.ySb(),
          C.Ip && this.Bfc(C),
          k.u && this.console.trace("Received ad metadata for", {
              L: C.R,
              Dqb: p(F)
      })));
      else if (F && G && (H = null === (D = this.wob.get(G)) || undefined === D ? undefined : D.map(function(J) {
              return J.ny || J.oy;
          }),
          C = this.qtb(C.J, F, C).map(function(J) {
              return J.ny || J.oy;
          }),
          undefined !== H && (D = (0,
              e.Urb)(H, C, function(J, M) {
                var K, L;
                K = Array.isArray(J);
                L = Array.isArray(M);
                return K && L ? 0 === (0,
                  e.Urb)(J, M).length : K || L ? false : J === M;
            }),
            k.u && this.console.trace("Dropped ads diff", {
                yKc: C,
                Qjd: H,
                qw: D
            }),
            0 !== D.length)))
      return (k.u && this.console.trace("Dropped ads changed", {
            kzb: G,
            yKc: C
        }),
        true);
      return E;
    }
    ;
    /* method: B.QUc(C) */ B.prototype.QUc = function(C) {
      var D, E;
      D = this.Yuc(C);
      E = this.Gv[C.R];
      this.Gv[C.R] = D;
      return {
        kzb: E,
        nOa: D
      };
    }
    ;
    Object.defineProperties(B.prototype, {
        Ota: {
          get: function() {
            return this.za.Z;
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(B.prototype, {
        cc: {
          get: function() {
            return this.Eh.fu;
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: B.Gb(C, D, E) */ B.prototype.Gb = function(C, D, E) {
      var G;
      G = this;
      this.Eh = C;
      this.Wi = D;
      this.cn = E;
      this.HY = new w.O9a(this.Eh,this.console,this.za,this.config,this.Lz,this.Kna);
      this.cn.events.on("adBreakHydrationSkipped", function(F) {
          return G.cJ(F.jn);
      });
      this.cn.events.on("adBreakHydrationFailed", function(F) {
          G.cJ(F.jn);
      });
      this.cn.events.on("adBreakHydrated", function(F) {
          return G.b9(F.jn);
      });
      this.za.events.on("branchDestroyed", function(F) {
          return G.ZLc(F);
      });
    }
    ;
    /* method: B.ZLc(C) */ B.prototype.ZLc = function(C) {
      var D, E, G, F, H, J, M, K, I, Q;
      E = this;
      F = C.segmentId;
      if ("pruned" === C.reason) {
        C = this.Wi.pS(F);
        if (!C) {
          H = this.za.Z.ba[F];
          if (H) {
            J = this.cc[H.J];
            M = (0,
              A.gVa)(F);
            M && J && M.PZ >= J.length && (C = J[M.PZ - 1],
              k.u && this.console.log("Inferring empty adbreak information for segment", {
                  M: F
              }),
              C = {
                xf: C,
                jd: H.J
            });
          } else
          k.u && this.console.log("Could not find segment in inner playgraph", {
              M: F
          });
        }
        if (C) {
          k.u && this.console.log("cleaning up ad metadata for adinfo", {
              index: null === C || undefined === C ? undefined : C.xf.Ub,
              nia: null === C || undefined === C ? undefined : C.xf.hb
          });
          J = C.jd;
          F = C.xf;
          H = this.Eh.fu[J];
          K = new Set();
          try {
            for (var L = c.__values(H), O = L.next(); !O.done; O = L.next()) {
              I = O.value;
              if (I.Ub < F.Ub)
              I.De && K.add(I);
              else
              break;
            }
          } catch (S) {
            var N;
            N = {
              error: S
            };
          } finally {
            try {
              O && !O.done && (D = L.return) && D.call(L);
            } finally {
              if (N)
              throw N.error;
            }
          }
          N = this.Lz.get(J);
          0 < K.size && (D = Array.from(K),
            L = this.jE(N),
            null === L || undefined === L ? undefined : L.Chc(D));
          if (!N.Ip && C) {
            D = Array.from(this.za.bb.values());
            L = Array.from(this.za.player.bb);
            D = (0,
              e.XY)(D, L);
            Q = (0,
              e.bPa)(D.map(function(S) {
                  var T;
                  return null === (T = E.Wi.pS(S.K.id)) || undefined === T ? undefined : T.xf;
              }).filter(e.gd));
            H.filter(function(S) {
                return -1 === Q.indexOf(S);
            }).forEach(function(S) {
                S.Fn && K.add(S);
            });
          }
          0 < K.size && (F.ah || K.delete(C.xf),
            D = Array.from(K),
            C = N.Ip && (null === (G = N.wd) || undefined === G ? undefined : G.Uj),
            this.cn.kxb(D, !!C),
            this.cJ(N));
        }
      }
    }
    ;
    /* method: B.Gw() */ B.prototype.Gw = function() {
      var C;
      C = this;
      return !!(0,
        e.kc)(Object.keys(this.cc), function(D) {
          return 0 < C.cc[D].length;
      });
    }
    ;
    /* method: B.G2(C, D) */ B.prototype.G2 = function(C, D) {
      var E, G, F, H, J;
      E = this.rd.yj;
      (0,
        l.assert)(E, "Could not get graph location service");
      G = this.rd.Z.ba[C.M].J;
      F = this.za.Ju().filter(function(M) {
          return M.J === G;
      })[0];
      if (null === F || undefined === F ? 0 : F.Ab) {
        H = this.iRb(F, C);
        !(0,
          r.fXa)(C, H) && D && (D = this.rd.Rs(H),
          (0,
            l.assert)(D, "Could not get initial content position from seek position"),
          (0,
            l.assert)(D.J === F.J, "Initial content position should be in the same viewable"),
          D = D.Ga);
        C = H;
      }
      if (0 < this.Eh.r8a || (null === F || undefined === F ? 0 : F.Ab)) {
        J = this.KA(this.rd.Ib);
        E = E.iW(J);
        this.Eh.reset();
      }
      F = null === J || undefined === J ? undefined : J.Z;
      H = this.HY.Nrb(C, E, J);
      E = H.Fm;
      C = H.PA;
      this.AHb = H.J2a;
      k.u && this.console.trace(("ads::seekStreaming: returning ").concat(JSON.stringify(E)));
      F = (F || this.za.Z).ba[E.M];
      this.kna = !!F.type && -1 < [f.ed.vc, f.ed.padding].indexOf(F.type);
      return {
        Fm: E,
        No: D,
        PA: C,
        pwa: J
      };
    }
    ;
    /* method: B.OI(C, D, E) */ B.prototype.OI = function(C, D, E) {
      var G, F, H;
      G = false;
      H = E;
      if (!D)
      return {
        PY: false,
        L2a: false,
        zia: H
      };
      this.av.OI(C);
      C.Ab && H && (H = this.iRb(C, H),
        (G = !(0,
            r.fXa)(H, E)) && (F = H));
      if ((D = this.b9(C)) && H && this.tEb(H)) {
        if (this.XSb(H, C))
        return c.__assign({
            PY: D,
            L2a: G,
            PA: F
          }, this.CWb(H, "viewableReceived"));
        k.u && this.console.trace(("ads::onViewableReceived: should NOT consider preroll on seek:\n                        seekPosition (unchanged): ").concat(H, ",\n                        didAppendData: ").concat(this.za.Baa(), ",\n                        enablePrerollForInitialSeek ").concat(this.za.config.J_));
      }
      return {
        PY: D,
        L2a: G,
        PA: F,
        zia: H
      };
    }
    ;
    /* method: B.nNc(C) */ B.prototype.nNc = function(C) {
      this.Gv[C] && (this.Gv[C] = undefined);
    }
    ;
    /* method: B.iRb(C, D) */ B.prototype.iRb = function(C, D) {
      var E, G, F, H;
      E = this.rd.Ib.get(D.M);
      if ((null === E || undefined === E ? undefined : E.J) === C.J) {
        G = C.Cn();
        F = G.da(E.nb);
        (0,
          l.assert)(0 <= F.G, "Seek segment should not begin after live edge");
        C = C.Ic.$aa;
        E = (null === C || undefined === C ? undefined : C.da(E.nb)) || e.I.uh;
        H = e.I.min(D.offset, F, E);
        k.u && this.console.trace(("ads::sanitizeLiveSeekPosition: ").concat(JSON.stringify(D), ", ") + ("live edge target ").concat(G.ca(), ", ") + ("live edge offset: ").concat(F.ca(), ", ") + ("event end ").concat(null === C || undefined === C ? undefined : C.ca(), ", event end offset: ").concat(E.ca()) + (" -> adjusted offset ").concat(H.ca()));
        return {
          M: D.M,
          offset: H
        };
      }
      return D;
    }
    ;
    /* method: B.Twa(C, D) */ B.prototype.Twa = function(C, D) {
      var E, G;
      this.b9(C);
      E = this.Gv[C.R];
      (0,
        l.assert)(E, ("adMetadata for viewable ").concat(C.J, " should exist if an adBreak hydration was requested"));
      k.u && this.console.trace("ads::onAdBreakHydrated: Resetting branch decisions");
      G = this.za.player;
      G.Ok && this.za.En && this.za.CD.YV(G.Ok, G.Rd, true);
      this.HY.ySb();
      k.u && this.console.trace("ads::onAdBreakHydrated: Received new ad metadata after adBreakHydration for", {
          L: C.R,
          Dqb: p(E)
      });
      if (D)
      return this.CWb(D, "adBreakHydration");
    }
    ;
    /* method: B.CWb(C, D) */ B.prototype.CWb = function(C, D) {
      var E, G, F, H, J;
      k.u && this.console.trace(("ads::updatePendingSeekPosition: ").concat(JSON.stringify(C)));
      E = this.rd.yj;
      (0,
        l.assert)(E, "Could not get graph location service");
      G = this.KA(this.rd.Ib);
      E = E.iW(G);
      F = G.Z;
      H = this.HY.Nrb(C, E, G);
      J = H.Fm;
      H = H.PA;
      this.kna = false;
      (F = F.ba[J.M]) || (F = this.za.Z.ba[J.M]);
      this.kna = !!F.type && -1 < [f.ed.vc, f.ed.padding].indexOf(F.type);
      E = null === E || undefined === E ? undefined : E.JJ(J);
      k.u && this.console.trace("ads::updatePendingSeekPosition: should consider preroll on seek", {
          Xjd: C,
          zia: E,
          PA: H,
          Baa: this.za.Baa(),
          J_: this.za.config.J_,
          reason: D
      });
      return {
        zia: E,
        PA: H,
        pwa: G
      };
    }
    ;
    /* method: B.qtb(C, D, E) */ B.prototype.qtb = function(C, D, E) {
      var G, F;
      G = this;
      F = D.map(function(H, J) {
          return G.HY.YH(G.cc[C][J], J, Number(C), G.uGb(), E);
      });
      k.u && this.console.debug("Calculated dropped ads", {
          context: {
            seeking: this.uGb()
          },
          result: F
      });
      this.wob.set(D, F);
      return F;
    }
    ;
    /* method: B.KA(C) */ B.prototype.KA = function(C) {
      var D, E, G, F;
      D = this;
      E = C;
      G = C.Z;
      F = Object.keys(G.ba).map(function(H) {
          return ("").concat(G.ba[H].J);
      });
      Object.keys(this.Gv).forEach(function(H) {
          var J, M, K, L;
          if (-1 !== F.indexOf(H)) {
            J = parseInt(H);
            M = D.Gv[H];
            if (M) {
              K = D.Lz.get(J);
              (0,
                l.assert)(K, "AdComposer::createInnerWorkingPlaygraph: viewable should exist");
              K = D.qtb(J, M, K);
              D.tk.Eg({
                  droppedAds: K.map(function(O, I) {
                      return {
                        Fia: O,
                        KXa: I
                      };
                  }).slice(-5),
                  viewableId: H
              });
              K = K.map(function(O) {
                  return O.ny || O.oy;
              });
              D.Eh.Vza(H, M);
              L = D.Eh.fu[H] || [];
              H = M.map(function(O, I) {
                  var N;
                  N = (0,
                    u.IUa)(O);
                  "dynamic" === N.type && (I = L[I],
                    N.ywa = (null === I || undefined === I ? undefined : I.duration) || e.I.ia,
                    "dynamic" === O.xa.type && (O.xa.ywa = N.ywa));
                  return N;
              });
              M = new Set();
              J = (0,
                f.Nkc)(J, H, M, K, D.config.uxa, false);
              H = f.fA.create(J);
              H = f.fA.Jn(C, H);
              k.u && D.console.trace("Creating new ads playgraph", {
                  Pbd: J,
                  vjd: H.d2.Z
              });
              E = H.d2;
            }
          }
      });
      E.OY(this.za.Ib);
      return E;
    }
    ;
    /* method: B.tEb(C) */ B.prototype.tEb = function(C) {
      return !!this.Gv[this.rd.Z.ba[C.M].J];
    }
    ;
    /* method: B.icc(C, D) */ B.prototype.icc = function(C, D) {
      var E;
      D = this.jE(D);
      E = null === D || undefined === D ? undefined : D.WH();
      return E && 0 !== E.size ? C.map(function(G) {
          var F, H, J;
          F = G.xa.hb;
          if (!F || !E.has(F))
          return G;
          H = E.get(F);
          switch (H.status) {
            case m.HDa.ngb:
            return (G.state.MB = true,
              G);
            case m.HDa.ai:
            H = H.Sa;
            J = H.yb ? H.yb.reduce(function(M, K) {
                return M.add(e.I.Ca(K.eb - K.Va));
              }, e.I.ia) : e.I.ia;
            return {
              xa: c.__assign(c.__assign({}, H), {
                  Ga: G.xa.Ga,
                  location: G.xa.location,
                  Xu: G.xa.Xu,
                  kj: G.xa.kj,
                  duration: H.yu ? G.xa.duration : J,
                  type: H.yu ? "embedded" : "dynamic",
                  Zp: G.xa.Zp,
                  Zk: G.xa.duration,
                  hb: F,
                  source: "daiPrefetch"
              }),
              state: c.__assign(c.__assign({}, G.state), {
                  Fn: true,
                  sj: true,
                  DM: false
              })
            };
            default:
            return G;
          }
      }) : C;
    }
    ;
    /* method: B.Yuc(C) */ B.prototype.Yuc = function(C) {
      var D, E, G, F;
      G = this.av.WH(C);
      if (G) {
        F = !(null === (E = null === (D = C.S) || undefined === D ? undefined : D.wd) || undefined === E || !E.Uj);
        D = G.map(function(H) {
            return {
              xa: H,
              state: (0,
                v.QZ)({
                  sj: F,
                  Fn: false,
                  DM: false
              })
            };
        });
        D = this.icc(D, C);
        C.wd && C.wd.cc.length && (D = this.mJc(C.wd, D, C));
      } else if (C.wd && C.wd.cc.length)
      D = C.wd.cc.map(function(H) {
          return {
            xa: H,
            state: (0,
              v.QZ)({
                Fn: !!H.yb || !!H.yu,
                sj: !!H.Pj && !H.yu
            })
          };
      });
      else
      return;
      D = this.cn.Taa(D);
      D = this.Kna.Taa(C, D);
      D = this.Erc(C, D);
      return D = this.hac.Taa(C, D);
    }
    ;
    /* method: B.Erc(C, D) */ B.prototype.Erc = function(C, D) {
      var E;
      E = this;
      D.forEach(function(G) {
          var F, H;
          G = G.xa;
          "dynamic" === G.type && C.Ip && G.yb && (null === (F = G.Zk) || undefined === F ? 0 : F.da(G.duration).greaterThan(e.I.Ca(E.config.EIc))) && (F = G.Ga.add(G.duration),
            F = (null === (H = E.za.TS.Bw({
                    Ga: F,
                    J: C.J
                  }, {
                    urb: true
              })) || undefined === H ? undefined : H.qa) || F,
            G.yb.push({
                id: C.J,
                Va: F.G,
                eb: G.Ga.add(G.Zk).G,
                c1: false,
                qo: true
            }),
            G.duration = G.Zk,
            k.u && E.console.trace("ads::getAdMetadata: adding additional embedded ad", {
                hb: G.hb,
                J: C.J,
                yb: G.yb.length
          }));
      });
      return D;
    }
    ;
    /* method: B.mJc(C, D, E) */ B.prototype.mJc = function(C, D, E) {
      var G, F, H, J, M, K, L;
      if (C.OQb)
      return D;
      J = {};
      C.cc.forEach(function(O) {
          J[O.location.G] = O;
      });
      M = {};
      D.forEach(function(O) {
          M[O.xa.location.G] = O;
      });
      k.u && this.console.trace("ads::mergeReplacedAds viewableRecords", {
          rnd: C.cc.map(function(O) {
              return O.location.G;
          }),
          Uid: D.map(function(O) {
              return O.xa.location.G;
          }),
          kld: null === (H = null === (F = null === (G = E.cg.model.NM) || undefined === G ? undefined : G.Yk) || undefined === F ? undefined : F.Ga) || undefined === H ? undefined : H.ca()
      });
      K = (0,
        e.dPa)(Object.keys(J), Object.keys(M));
      L = [];
      J["0"] && -1 === K.indexOf("0") && (C = J["0"],
        L.push({
            xa: C,
            state: (0,
              v.QZ)({
                Fn: !!C.yb || !!C.yu,
                sj: !!C.Pj && !C.yu
            })
      }));
      K.forEach(function(O) {
          var I, N;
          I = M[O];
          O = J[O];
          N = "embedded" === O.type;
          L.push({
              xa: c.__assign(c.__assign(c.__assign({}, O), {
                    Zk: I.xa.duration,
                    location: I.xa.location,
                    Ga: I.xa.Ga,
                    Xu: I.xa.Xu,
                    kj: I.xa.kj,
                    hb: I.xa.hb
                }), N ? {
                  duration: I.xa.duration
                } : {}),
              state: (0,
                v.QZ)({
                  sj: !N,
                  Fn: !!O.yb || N
              })
          });
      });
      this.coa || (C = Object.keys(J).filter(function(O) {
            return 0 !== Number(O) && -1 === K.indexOf(O);
        }).map(function(O) {
            return Number(O);
        }),
        D = Object.keys(M).filter(function(O) {
            return -1 === K.indexOf(O);
        }).map(function(O) {
            return Number(O);
        }),
        (C.length || D.length) && this.iUc(C, D),
        this.coa = true);
      return L;
    }
    ;
    /* method: B.OSa(C) */ B.prototype.OSa = function(C) {
      var D, E, G, F;
      D = this;
      k.u && this.console.log("ads::dropErroredAd", {
          Cqb: C
      });
      E = Array.from(this.Lz.keys()).filter(function(H) {
          var J;
          return null === (J = D.Eh.fu[H]) || undefined === J ? undefined : J.some(function(M) {
              var K;
              return null === (K = M.yb) || undefined === K ? undefined : K.some(function(L) {
                  return L.id === C;
              });
          });
      });
      this.Eh.OSa(C);
      G = this.za.player;
      G.Ok && this.za.En && this.za.CD.YV(G.Ok, G.Rd, true);
      E.length && this.events.emit("adSegmentDropped", {
          type: "adSegmentDropped",
          adId: C
      });
      E.map(function(H) {
          H = D.Lz.get(Number(H));
          F || (F = H);
          H && D.cJ(H);
      });
      F && this.cJ(F, true);
      k.u && this.console.log("ads::dropErroredAd", {
          Cqb: C,
          Ugd: E,
          pgd: !!F
      });
    }
    ;
    /* method: B.iUc(C, D) */ B.prototype.iUc = function(C, D) {
      this.coa || (this.events.emit("advertsMismatch", {
            type: "advertsMismatch",
            manifestUnmatchedAdBreakLocations: C,
            mediaEventsUnmatchedAdBreakLocations: D,
            sev: C.length ? "warn" : "info"
        }),
        this.coa = true);
    }
    ;
    /* method: B.X5a(C, D, E) */ B.prototype.X5a = function(C, D, E) {
      var G;
      return this.HY.X5a(C, D, E, null === (G = this.Ota) || undefined === G ? undefined : G.Ef);
    }
    ;
    /* method: B.XSb(C, D) */ B.prototype.XSb = function(C, D) {
      var E, G, F, H, J, M;
      F = this.za.config.J_;
      H = C.M;
      J = this.za.Z.ba[H] || this.rd.Z.ba[H];
      M = e.I.ia;
      J ? (D = D || this.za.Ju().filter(function(K) {
            return K.J === J.J;
        })[0],
        M = (null === D || undefined === D ? 0 : D.Ab) && (null === (E = D.Rh) || undefined === E ? 0 : E.startTime) ? D.Ic.rvb(e.I.ia) : e.I.ia,
        k.u && this.console.warn(("ads::shouldConsiderPrerollOnSeek Inferring offset ").concat(M.G, " as origin"))) : k.u && this.console.warn("ads::shouldConsiderPrerollOnSeek: segment not found", {
          M: H
      });
      E = C.offset.G === M.G;
      D = this.za.Baa();
      return E || (D ? d(this.AHb, null === (G = this.za.player.$L()) || undefined === G ? undefined : G.K.id, C) ? this.AHb.ZAc : true : F);
    }
    ;
    /* method: B.QUa(C, D) */ B.prototype.QUa = function(C, D) {
      var E, H;
      (0,
        l.assert)(undefined !== D.Ub || undefined !== D.hb, "adInfo must have adBreakIndex or adBreakTriggerId");
      C = this.Eh.fu[C];
      k.u && this.console.trace("Searching adBreak by index", {
          Ub: D.Ub
      });
      if (undefined !== D.Ub && C)
      return C[D.Ub];
      k.u && this.console.trace("Searching adBreak by triggerId", {
          hb: D.hb,
          cc: null === C || undefined === C ? undefined : C.map(function(M) {
              return M.hb;
          })
      });
      if (undefined !== D.hb && C)
      try {
        for (var G = c.__values(C), F = G.next(); !F.done; F = G.next()) {
          H = F.value;
          if (H.hb === D.hb)
          return H;
        }
      } catch (M) {
        var J;
        J = {
          error: M
        };
      } finally {
        try {
          F && !F.done && (E = G.return) && E.call(G);
        } finally {
          if (J)
          throw J.error;
        }
      }
      k.u && this.console.trace("Could not find ad-break");
    }
    ;
    B.prototype.$Mc = function(C, D) {
      var E, G, F;
      G = this.Wi.PUa({
          M: C,
          offset: e.I.ia
      });
      if (G && G.vc) {
        C = G.Sa;
        F = G.vc;
        G = G.WK;
        this.console.trace(("ads::onSegmentNormalized ").concat(D.segmentId, ": ").concat(D.normalizedStart.ca(), " - ").concat(D.normalizedEnd.ca()));
        F.normalize(D.normalizedStart, D.normalizedEnd);
        G === (null === (E = C.yb) || undefined === E ? NaN : E.length) - 1 && this.events.emit("adBreakNormalized", {
            type: "adBreakNormalized",
            Sa: C
        });
      }
    }
    ;
    /* method: B.Bfc(C) */ B.prototype.Bfc = function(C) {
      var D, E;
      D = this;
      E = {
        Lp: this.config.Lp,
        Wu: this.config.Wu
      };
      (C = this.Eh.fu[C.J]) && C.forEach(function(G, F) {
          var H, J;
          if (null === (H = G.yb) || undefined === H ? 0 : H.length) {
            H = G.yb.map(function(M) {
                return {
                  Va: M.startTime.G,
                  eb: M.endTime.G
                };
            });
            J = (0,
              z.ttb)(H, E);
            G.yb.forEach(function(M, K) {
                undefined === M.N1 && M.HXc(J[K].N1);
            });
            k.u && D.console.trace("Calculated manifest windows for ad break", {
                Ub: F,
                nia: G.hb,
                And: J.map(function(M) {
                    return M.N1;
                })
            });
          }
      });
    }
    ;
    /* method: B.RVa(C) */ B.prototype.RVa = function(C) {
      var D;
      C = this.Wi.PUa({
          M: C,
          offset: e.I.ia
      });
      return null === (D = null === C || undefined === C ? undefined : C.vc) || undefined === D ? undefined : D.N1;
    }
    ;
    c.__decorate([(0,
          n.kb)({
            methodName: "_refreshAds",
            df: true
      })], B.prototype, "b9", null);
    c.__decorate([(0,
          n.kb)({
            methodName: "onAdBreakHydrated"
      })], B.prototype, "Twa", null);
    c.__decorate([(0,
          n.kb)({
            methodName: "createInnerWorkingPlaygraph"
      })], B.prototype, "KA", null);
    return B;
  }
)();
export const D9a = t;

// Detected exports: D9a
