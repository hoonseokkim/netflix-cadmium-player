/**
 * Netflix Cadmium Playercore - Module 31300
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_31300
 * @description Playback lifecycle management; Ad break management; Event system; Live streaming support; Logging/telemetry
 * @size 43,307 chars (raw), 24,876 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (16 imports)
 *   d <- Module 22970 (simple)
 *   p <- Module 90745 (simple)
 *   c <- Module 91176 (simple)
 *   g <- Module 91176 (simple)
 *   f <- Module 91176 (simple)
 *   e <- Module 66164 (simple)
 *   h <- Module 91176 (simple)
 *   _ <- Module 51308 (side-effect)
 *   k <- Module 65161 (simple)
 *   l <- Module 95407 (simple)
 *   m <- Module 6783 (simple)
 *   n <- Module 40666 (simple)
 *   q <- Module 48170 (simple)
 *   r <- Module 69575 (simple)
 *   u <- Module 61996 (simple)
 *   v <- Module 54366 (simple)
 *
 * @exports (2 exports)
 *   tqb
 *   B9a
 */

// Webpack module 31300
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w;
// [__esModule declaration removed]
// b.B9a = b.tqb = undefined; [pre-declaration]
import * as d from "./Module_22970"; // a(22970)
import * as p from "./Module_90745"; // a(90745)
import * as c from "./Module_91176"; // a(91176)
import * as g from "./Module_91176"; // a(91176)
import * as f from "./Module_91176"; // a(91176)
import * as e from "./Module_66164"; // a(66164)
import * as h from "./Module_91176"; // a(91176)
import "./Module_51308"; // a(51308) [side-effect]
import * as k from "./Module_65161"; // a(65161)
import * as l from "./Module_95407"; // a(95407)
import * as m from "./Module_06783"; // a(6783)
import * as n from "./Module_40666"; // a(40666)
import * as q from "./Module_48170"; // a(48170)
import * as r from "./Module_69575"; // a(69575)
import * as u from "./Module_61996"; // a(61996)
import * as v from "./Module_54366"; // a(54366)
export const tqb = ["AD_BREAK_UNAVAILABLE"];
w = (function() {
    function x(y, A) {
      this.J = y;
      this.Sa = A;
      this.vGb = this.cza = this.pga = false;
      this.Br = -1;
      this.mh = new c.AbortController();
      this.opb = new c.Zo();
    }
    x.isEqual = function(y, A) {
      return A.J === y.J && A.Sa === y.Sa;
    }
    ;
    Object.defineProperties(x.prototype, {
        Vv: {
          get: function() {
            return this.mh.signal;
          },
          enumerable: false,
          configurable: true
        }
    });
    x.prototype.S$b = function() {
      this.abort();
      this.mh = new c.AbortController();
    }
    ;
    /* method: x.abort() */ x.prototype.abort = function() {
      this.mh.abort();
    }
    ;
    /* method: x.qIc() */ x.prototype.qIc = function() {
      this.opb.resolve();
    }
    ;
    return x;
  }
)();
t = (function() {
    function x(y, A, z, B, C) {
      var D;
      this.Tv = y;
      this.ka = A;
      this.pW = z;
      this.config = B;
      this.console = C;
      this.items = [];
      this.gI = new Map();
      this.eOa = 1;
      this.bgc = false;
      this.events = new p.EventEmitter();
      D = this;
      this.ka.sd.Fs(function() {
          return d.__generator(this, function(E) {
              switch (E.label) {
                case 0:
                return [4, n.ie.QBa];
                case 1:
                return (E.T(),
                  D.bgc = true,
                  [2]);
              }
          });
        }, "playerStartedHydrator");
      this.console = (0,
        r.Nf)(e.platform, C, "ADBREAKHYDRATOR");
      this.tk = new u.Tm({
          Ej: this,
          source: "AdBreakHydrator",
          console: this.console
      });
      this.ka.jf.Xc(new v.ko(this.tk));
      this.g1c = this.pW.Qa.currentTime;
    }
    /* method: x.Tra(y, A) */ x.prototype.Tra = function(y, A) {
      var z, B;
      return undefined !== (null === y || undefined === y ? undefined : y.Cu) ? ("").concat(y.Ub, ":").concat(null !== (z = y.Cu()) && undefined !== z ? z : "") : ("").concat(A, ":").concat(null !== (B = y.xa.hb) && undefined !== B ? B : "");
    }
    ;
    /* method: x.eha(y, A) */ x.prototype.eha = function(y, A) {
      y = this.Tra(y);
      this.tk.Eg({
          id: y,
          Sed: A.type
      });
      q.u && this.console.log("Setting hydration event", {
          id: y,
          event: d.__assign(d.__assign({}, A), {
              jn: undefined
          })
      });
      this.gI.set(y, A);
    }
    ;
    /* method: x.Jhc() */ x.prototype.Jhc = function() {
      var y;
      y = this;
      this.tk.Eg({
          Pgd: Array.from(this.gI.values()).map(function(A) {
              return y.Tra(A.IO);
          })
      });
      this.console.log("Clearing adBreak hydrator events on seek");
      this.gI.clear();
    }
    ;
    /* method: x.fQa(y) */ x.prototype.fQa = function(y) {
      var A;
      A = this;
      this.items = this.items.filter(function(z) {
          return y.length && z.Sa.Cu() === y && !z.cza ? (q.u && A.console.log("Cancelling adBreak hydrations for", {
                J: z.J,
                Ub: z.Sa.Ub,
                hb: y
            }),
            z.vGb = true,
            z.abort(),
            A.eha(z.Sa, {
                type: "tooLate",
                L: undefined,
                Br: -1,
                IO: z.Sa
            }),
            false) : true;
      });
    }
    ;
    /* method: x.Taa(y) */ x.prototype.Taa = function(y) {
      var A;
      A = this;
      return this.gI.size ? y.map(function(z, B) {
          var C, D, E, G, F, H, J, M, K, L, O;
          if ((B = A.Tra(z, B)) && A.gI.has(B)) {
            B = A.gI.get(B);
            if ("tooLate" === (null === B || undefined === B ? undefined : B.type))
            return (z.state.sj = false,
              z.state.MB = true,
              z);
            if ("dehydration" === (null === B || undefined === B ? undefined : B.type))
            return {
              xa: d.__assign(d.__assign({}, z.xa), {
                  yb: B.cQa ? undefined : [],
                  VK: {},
                  source: "hydration"
              }),
              state: d.__assign(d.__assign({}, z.state), {
                  Fn: !B.cQa,
                  Pu: null === B || undefined === B ? undefined : B.Br,
                  sj: B.cQa,
                  ah: B.ah
              })
            };
            E = B.jn;
            E = E.Ab && !(null === (C = E.S.wd) || undefined === C || !C.Uj);
            if ("adBreakHydrated" === B.type) {
              C = B.B9;
              E = B.Pj;
              G = B.hb;
              F = z.xa;
              H = F.Xu;
              J = F.kj;
              M = F.location;
              K = F.Ga;
              L = F.Zk;
              F = F.duration;
              O = "dynamic" === z.xa.type ? z.xa.Ub : undefined;
              return {
                xa: d.__assign(d.__assign({}, C), {
                    kj: J,
                    Xu: H,
                    location: M,
                    duration: C.yu ? L || F : (null === (D = C.yb) || undefined === D ? 0 : D.length) ? C.yb.reduce(function(I, N) {
                        return I.add(g.I.Ca(N.eb - N.Va));
                      }, g.I.ia) : g.I.ia,
                    Zk: L || g.I.ia,
                    Ga: K,
                    Pj: E,
                    hb: G,
                    Ub: O,
                    source: "hydration",
                    type: C.yu ? "embedded" : "dynamic"
                }),
                state: d.__assign(d.__assign({}, z.state), {
                    Fn: true,
                    sj: false,
                    Pu: null === B || undefined === B ? undefined : B.Br,
                    DM: false
                })
              };
            }
            E ? (z.state.Fn = true,
              z.state.Pu = null === B || undefined === B ? undefined : B.Br) : "adBreakHydrationSkipped" === B.type && (z.state.Fn = false,
              z.state.sj = false,
              z.state.DM = true,
              z.state.Pu = null === B || undefined === B ? undefined : B.Br);
          }
          return z;
      }) : y;
    }
    ;
    /* method: x.kxb(y, A) */ x.prototype.kxb = function(y, A) {
      var z;
      z = this;
      y = y.map(function(B) {
          return [z.Unc(B, A), {
              index: B.Ub,
              Omd: B.hb
          }];
      }).filter(function(B) {
          return (0,
            c.gd)(B[0]);
      });
      this.tk.Eg({
          dehydrated: y
      });
    }
    ;
    /* method: x.Unc(y, A) */ x.prototype.Unc = function(y, A) {
      var z, B, C, D, E;
      if (y.De) {
        B = this.Tra(y);
        this.gI.has(B) && (C = null === (z = this.gI.get(B)) || undefined === z ? undefined : z.type);
        if (y.Cu() || y.Ura()) {
          D = y.Ura();
          E = y.Cu();
          this.gI.set(B, {
              type: "dehydration",
              L: undefined,
              Br: this.eOa++,
              cQa: A || !y.ah,
              ah: A ? false : y.ah,
              IO: {
                Ub: y.Ub,
                Ura: function() {
                  return D;
                },
                Cu: function() {
                  return E;
                },
                ah: y.ah,
                De: y.De,
                kj: y.kj
              }
          });
          return "dehydration" !== C ? C : undefined;
        }
      }
    }
    ;
    /* method: x.Aza(y) */ x.prototype.Aza = function(y) {
      d.__awaiter(this, undefined, undefined, function() {
          var A, z, B, C, D, E;
          E = this;
          return d.__generator(this, function(G) {
              switch (G.label) {
                case 0:
                A = y.map(function(F) {
                    return [new w(F.J,F.Sa), F.cda];
                });
                z = A.map(function(F) {
                    return d.__read(F, 1)[0];
                });
                B = (0,
                  f.jic)(this.items, z, w.isEqual);
                this.items = B.result;
                B.dga.forEach(function(F) {
                    F.cza || F.abort();
                });
                A.filter(function(F) {
                    return d.__read(F, 2)[1];
                }).forEach(function(F) {
                    var H;
                    H = d.__read(F, 1)[0];
                    F = (0,
                      c.kc)(E.items, function(J) {
                        return w.isEqual(J, H);
                    });
                    null === F || undefined === F ? undefined : F.qIc();
                });
                q.u && this.console.log("Evaluated schedule", {
                    nbc: B.krb.length,
                    dga: B.dga.length,
                    qya: B.qya.length,
                    BKc: B.result.length
                });
                this.tk.Eg({
                    nbc: B.krb.length,
                    dga: B.dga.length,
                    qya: B.qya.length,
                    BKc: B.result.length
                });
                C = this.items.filter(function(F) {
                    return !F.pga;
                }).map(function(F) {
                    return E.tg(F);
                });
                if (!(0,
                    k.Ts)(this.ka.se.value))
                return [3, 5];
                D = this.items.map(function(F) {
                    return E.Tv.Yp(F.J).Qk;
                });
                G.label = 1;
                case 1:
                return (G.ac.push([1, , 3, 4]),
                  [4, Promise.race(C)]);
                case 2:
                return (G.T(),
                  [3, 4]);
                case 3:
                return (D.forEach(function(F) {
                      return F.release();
                  }),
                  [7]);
                case 4:
                return [3, 7];
                case 5:
                return [4, Promise.all(C)];
                case 6:
                (G.T(),
                  G.label = 7);
                case 7:
                return [2];
              }
          });
      });
    }
    ;
    /* method: x.tg(y) */ x.prototype.tg = function(y) {
      return d.__awaiter(this, undefined, undefined, function() {
          var A, z, B, C, D, E, G, F;
          G = this;
          return d.__generator(this, function(H) {
              switch (H.label) {
                case 0:
                (q.u && this.console.log("Start scheduling for adbreak", {
                      lnd: y.J,
                      Ccd: y.Sa.Ub
                  }),
                  A = ("").concat(y.Sa.Ub, ":").concat(null !== (F = y.Sa.Cu()) && undefined !== F ? F : ""),
                  this.tk.Eg({
                      id: A
                  }),
                  y.S$b(),
                  z = y.Vv,
                  B = (0,
                    m.Ds)(this.ka.Z, y.J, y.Sa.Ga),
                  C = (0,
                    c.ooa)(z),
                  H.label = 1);
                case 1:
                return (H.ac.push([1, , 5, 6]),
                  [4, Promise.race([(function() {
                            return d.__awaiter(G, undefined, undefined, function() {
                                return d.__generator(this, function(J) {
                                    switch (J.label) {
                                      case 0:
                                      return [4, this.p1a(z)];
                                      case 1:
                                      return (J.T(),
                                        q.u && this.console.log("Rebuffering detected, expediting hydration"),
                                        [2, "rebuffer"]);
                                    }
                                });
                            });
                          }
                        )(), Promise.all([this.B4c(C), this.E4c(B, C)]).then(function() {
                            return "gatesPassed";
                        }), C.then(function() {
                            return "cleanup";
                })])]);
                case 2:
                D = H.T();
                q.u && this.console.log("Schedule completed for reason", D);
                if (z.aborted)
                return [3, 4];
                q.u && this.console.log("Making Item Fetch", {
                    Dcd: y.Sa.Ub,
                    Xu: y.Sa.location.G
                });
                y.pga = true;
                return [4, this.ZOb(y, D, z)];
                case 3:
                (H.T(),
                  H.label = 4);
                case 4:
                return [3, 6];
                case 5:
                return (y.Vv === z && (E = this.items.indexOf(y),
                    -1 !== E && (q.u && this.console.log(("Removing item ").concat(E, ", ").concat(this.items.length - 1, " left")),
                      this.items.splice(E, 1))),
                  [7]);
                case 6:
                return [2];
              }
          });
      });
    }
    ;
    /* method: x.p1a(y) */ x.prototype.p1a = function(y) {
      return d.__awaiter(this, undefined, undefined, function() {
          return d.__generator(this, function() {
              return (0,
                k.Ts)(this.ka.se.value) ? (q.u && this.console.log("Buffering detected, expediting hydration"),
                [2]) : [2, g.Ut.H4c([this.ka.se], function(A) {
                    A = d.__read(A, 1)[0];
                    return (0,
                      k.Ts)(A);
                  }, y)];
          });
      });
    }
    ;
    /* method: x.B4c(y) */ x.prototype.B4c = function(y) {
      var A;
      A = this;
      return new Promise(function(z) {
          var B, C;
          B = A.g1c.add(g.I.Ca(A.config.YBc));
          C = A.pW.uu(n.ie.Jm(B), z, "hydratorWaitTask");
          y.then(function() {
              return C.La();
          });
        }
      );
    }
    ;
    /* method: x.E4c(y, A) */ x.prototype.E4c = function(y, A) {
      return d.__awaiter(this, undefined, undefined, function() {
          var z, B, C;
          C = this;
          return d.__generator(this, function(D) {
              switch (D.label) {
                case 0:
                if (!this.config.vJb)
                return [2, Promise.resolve()];
                z = g.I.Ca(this.config.vJb);
                D.label = 1;
                case 1:
                return (D.ac.push([1, 3, , 4]),
                  [4, new Promise(function(E) {
                        var G, F;
                        G = C.ka.eB(y, true);
                        F = C.ka.sd.uu(n.ie.Jm(G.da(z)), E, "waitJitHydrateAdBreak");
                        A.then(function() {
                            return F.La();
                        });
                      }
                )]);
                case 2:
                return (D.T(),
                  [3, 4]);
                case 3:
                return (B = D.T(),
                  q.u && this.console.warn("waitJitHydrateAdBreak failed", c.VC.wy(B)),
                  [3, 4]);
                case 4:
                return [2];
              }
          });
      });
    }
    ;
    /* method: x.wfc(y, A) */ x.prototype.wfc = function(y, A) {
      var z, B, C, D, E, G;
      if (y.Ip && this.config.VNc) {
        C = y.Ic.Cn(true);
        D = g.I.max(g.I.ia, C.da(A.Sa.Ga));
        E = D.Hn(g.I.Ca(this.config.HGc));
        G = null !== (B = null === (z = y.S.wd) || undefined === z ? undefined : z.exb) && undefined !== B ? B : this.config.GGc;
        z = Math.floor(Math.random() * G);
        q.u && this.console.log("Checking schedule for live jitter and adbreak hydration", {
            nia: A.Sa.Cu(),
            Lkd: z,
            Udd: G,
            UZa: C.ca(),
            Oq: D.ca(),
            dhd: E
        });
        if (E)
        return (C = this.ka.Rs(this.ka.Wg).Ga,
          {
            Lxb: D.G,
            Mxb: A.Sa.Ga.da(C).G,
            Xia: G,
            K4: z,
            xC: y.Wf + z,
            GF: y.Wf
        });
      }
    }
    ;
    /* method: x.Odc(y, A, z) */ x.prototype.Odc = function(y, A, z) {
      return d.__awaiter(this, undefined, undefined, function() {
          var B;
          B = this;
          return d.__generator(this, function(C) {
              switch (C.label) {
                case 0:
                return [4, new Promise(function(D, E) {
                      var G;
                      G = B.pW.uu(n.ie.Mz(g.I.Ca(y.K4)), D, "hydrationLiveJitterTask");
                      z.addEventListener("abort", function() {
                          G.La();
                          E();
                      });
                    }
                )];
                case 1:
                return (C.T(),
                  q.u && this.console.log("Live jitter completed", {
                      nia: A.Sa.Cu()
                  }),
                  [2]);
              }
          });
      });
    }
    ;
    /* method: x.ZOb(y, A, z) */ x.prototype.ZOb = function(y, A, z) {
      return d.__awaiter(this, undefined, undefined, function() {
          var B, C, D, E, G, F, H, J, M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa, ca, ea, R, P;
          return d.__generator(this, function(V) {
              switch (V.label) {
                case 0:
                (B = y.Sa,
                  C = y.J,
                  D = ("").concat(B.Ub, ":").concat(null !== (R = B.Cu()) && undefined !== R ? R : ""),
                  this.tk.Eg({
                      id: D,
                      reason: A
                  }),
                  E = B.Ura(),
                  G = B.Cu(),
                  F = null !== G && undefined !== G ? G : E,
                  (0,
                    c.assert)(F, "adBreakToken or adBreakTriggerId must exist if adBreak hydration was queued"),
                  H = this.eOa++,
                  y.Br = H,
                  J = this.Tv.Yp(C),
                  M = J.Qk,
                  K = false,
                  O = d.__read((0,
                      h.wKb)(this.Tv.UU.bind(this.Tv)), 2),
                  I = O[0],
                  N = O[1],
                  V.label = 1);
                case 1:
                return (V.ac.push([1, 6, 9, 12]),
                  [4, J.mq]);
                case 2:
                return (Q = V.T(),
                  Q.Ip ? (L = this.wfc(Q, y)) ? [4, Promise.race([this.Odc(L, y, z), y.opb.promise])] : [3, 4] : [3, 4]);
                case 3:
                (V.T(),
                  V.label = 4);
                case 4:
                return y.Vv.aborted || z.aborted ? [2] : [4, I({
                      Pj: E,
                      hb: G,
                      J: C
                })];
                case 5:
                S = V.T();
                if (y.Vv.aborted || z.aborted)
                return [2];
                y.cza = true;
                T = S.B9;
                U = S.jn;
                q.u && this.console.log("Hydrated response " + ("with ").concat(null === (P = S.B9.yb) || undefined === P ? undefined : P.length, " ads"));
                q.u && this.console.debug("Hydrated complete response ", {
                    response: T
                });
                X = {
                  type: "adBreakHydrated",
                  Pj: E,
                  hb: G,
                  B9: T,
                  jn: U,
                  IO: y.Sa,
                  Br: H,
                  AJ: {
                    jC: N.start,
                    mC: N.end
                  },
                  Ow: L
                };
                this.eha(y.Sa, d.__assign({}, X));
                this.events.emit("adBreakHydrated", X);
                K = true;
                return [3, 12];
                case 6:
                Y = V.T();
                if (z.aborted)
                return [3, 8];
                da = l.bD.Yzc(Y);
                ba = l.bD.Sba(Y);
                return [4, J.mq];
                case 7:
                aa = V.T();
                (0,
                  c.assert)(aa, "parentAseViewable must exist");
                if ("adBreakHydration" === da && ba && -1 !== b.tqb.indexOf(ba))
                return (q.u && this.console.log("AdBreak hydration failed with recoverable error, playback can continue. Hydration will be attempted again if user revisits the adBreak location. " + ("errorCode: ").concat(ba, ", ") + ("parentViewableId: ").concat(C, ", ") + ("adBreakToken: ").concat(E)),
                  ca = {
                    type: "adBreakHydrationSkipped",
                    Pj: E,
                    hb: G,
                    error: Y,
                    errorCode: ba,
                    jn: aa,
                    IO: y.Sa,
                    Br: this.eOa++,
                    AJ: {
                      jC: N.start,
                      mC: N.end
                    },
                    Ow: L
                  },
                  this.eha(y.Sa, ca),
                  B.k4 = true,
                  this.events.emit("adBreakHydrationSkipped", ca),
                  K = true,
                  [2]);
                ea = {
                  type: "adBreakHydrationFailed",
                  Pj: E,
                  hb: G,
                  error: Y,
                  errorCode: ba,
                  jn: aa,
                  IO: y.Sa,
                  Br: H,
                  AJ: {
                    jC: N.start,
                    mC: N.end
                  },
                  Ow: L
                };
                this.eha(y.Sa, ea);
                this.events.emit("adBreakHydrationFailed", ea);
                K = true;
                V.label = 8;
                case 8:
                return [3, 12];
                case 9:
                return K || y.vGb ? [3, 11] : [4, J.mq];
                case 10:
                (aa = V.T(),
                  (0,
                    c.assert)(aa, "parentAseViewable must exist"),
                  this.events.emit("adBreakHydrationSkipped", {
                      type: "adBreakHydrationSkipped",
                      Pj: E,
                      hb: G,
                      jn: aa,
                      IO: y.Sa,
                      Br: H,
                      AJ: {
                        jC: N.start,
                        mC: N.end
                      },
                      Ow: L
                  }),
                  V.label = 11);
                case 11:
                return (y.cza = true,
                  M.release(),
                  z.aborted || this.ka.Kga(),
                  [7]);
                case 12:
                return [2];
              }
          });
      });
    }
    ;
    /* method: x.La() */ x.prototype.La = function() {
      this.Aza([]);
    }
    ;
    d.__decorate([(0,
          u.kb)({
            methodName: "setHydration"
      })], x.prototype, "eha", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "clearHydrations"
      })], x.prototype, "Jhc", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "cancelAndSkipHydration",
            gn: true,
            df: true
      })], x.prototype, "fQa", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "dehydrateAdBreaks",
            df: true
      })], x.prototype, "kxb", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "scheduleHydration",
            df: true
      })], x.prototype, "Aza", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "schedule",
            return: true
      })], x.prototype, "tg", null);
    d.__decorate([(0,
          u.kb)({
            methodName: "queueAdBreakHydration"
      })], x.prototype, "ZOb", null);
    return x;
  }
)();
export const B9a = t;

// Detected exports: tqb, B9a
