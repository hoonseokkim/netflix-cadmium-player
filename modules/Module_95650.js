/**
 * Netflix Cadmium Playercore - Module 95650
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_95650
 * @description Manifest/MPD parsing; Content prefetching; Ad break management; Event system; Live streaming support
 * @size 36,412 chars (raw), 19,104 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (8 imports)
 *   d <- Module 22970 (simple)
 *   p <- Module 91176 (simple)
 *   c <- Module 91176 (simple)
 *   g <- Module 66164 (simple)
 *   f <- Module 90745 (simple)
 *   e <- Module 91176 (simple)
 *   h <- Module 95407 (simple)
 *   k <- Module 98589 (simple)
 *
 * @exports (1 exports)
 *   tbb
 */

// Webpack module 95650
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;
// [__esModule declaration removed]
// b.tbb = b.HDa = undefined; [pre-declaration]
import * as d from "./Module_22970"; // a(22970)
import * as p from "./Module_91176"; // a(91176)
import * as c from "./Module_91176"; // a(91176)
import * as g from "./Module_66164"; // a(66164)
import * as f from "./Module_90745"; // a(90745)
import * as e from "./Module_91176"; // a(91176)
import * as h from "./Module_95407"; // a(95407)
import * as k from "./Module_98589"; // a(98589)
(function(n) {
    n[n.cp = 0] = "INITIAL";
    n[n.lib = 1] = "PENDING";
    n[n.ai = 2] = "SUCCESS";
    n[n.rP = 3] = "FAILED";
  }
)(l || (l = {}));
(function(n) {
    n[n.ai = 0] = "SUCCESS";
    n[n.ngb = 1] = "MISSED_OPPORTUNITY";
  }
)(m || (b.HDa = m = {}));
t = (function() {
    function n(q, r, u, v, w, x) {
      var A, z;
      function y() {
        A.L.Ic.dE && (A.AU.kd(),
          A.L.events.vm("liveEventTimesUpdated", y));
      }
      A = this;
      this.L = q;
      this.Lj = r;
      this.kC = u;
      this.sr = v;
      this.ka = w;
      this.ppa = new Map();
      this.Cda = l.cp;
      this.FG = true;
      this.Qua = new p.tGa({
          Sya: p.$Ja.all
      });
      this.tn = {
        cc: new Map(),
        C9: []
      };
      this.kZa = [];
      this.events = new f.EventEmitter();
      this.console = (0,
        p.Nf)(g.platform, x, "DAIPREFETCHER");
      false;
      this.eS = new f.sf();
      this.AU = this.Lj.Fs(function() {
          return A.XVc();
        }, "DaiPrefetcher.schedulePrefetchAds");
      this.eS.addListener(v.events, "adBreakComplete", function() {
          return A.AU.kd();
      });
      this.eS.addListener(v.events, "adBreakPresenting", function() {
          return A.AU.kd();
      });
      this.L.events.on("liveEventTimesUpdated", y);
      this.dRc(this.L.S);
      q = (null === (z = this.L.S.W1) || undefined === z ? undefined : z.In.filter(function(B) {
            return "adbreak" === B.type;
      })) || [];
      this.zZa = Math.min(this.LLc.length, q.length);
      0 === this.tn.cc.size && (false,
        this.zZa = 0);
    }
    Object.defineProperties(n.prototype, {
        enabled: {
          get: function() {
            return this.FG;
          },
          set: function(q) {
            false;
            this.FG !== q && (this.FG = q,
              this.AU.kd());
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        $y: {
          get: function() {
            var q, r;
            r = null === (q = this.L.cg) || undefined === q ? undefined : q.model;
            return r ? r.cc.map(function(u) {
                return u.hb;
            }).filter(p.gd) : [];
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        LLc: {
          get: function() {
            var q, r, u;
            q = this;
            u = null === (r = this.L.cg) || undefined === r ? undefined : r.model;
            return u ? u.cc.filter(function(v) {
                return v.Ga.add(v.duration).lessThan(q.L.cg.Sw);
            }).map(function(v) {
                return v.hb;
            }).filter(p.gd) : [];
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        yFc: {
          get: function() {
            var q;
            q = this.sr.WH().result[this.L.J] || [];
            return q[q.length - 1];
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: n.Ygc(q) */ n.prototype.Ygc = function(q) {
      return this.$y.length === q + 1 ? this.Cda === l.rP : false;
    }
    ;
    Object.defineProperties(n.prototype, {
        CZc: {
          get: function() {
            var q, r, u, v, y, A, C, D;
            v = new Set();
            try {
              for (var w = d.__values(this.tn.C9), x = w.next(); !x.done; x = w.next()) {
                y = x.value;
                A = [];
                try {
                  for (var z = (r = undefined,
                      d.__values(y)), B = z.next(); !B.done; B = z.next()) {
                    C = B.value;
                    D = this.tn.cc.get(C);
                    D ? A.push(D) : this.console.error("DaiPrefetcher::getSpeculativeAdBreakQueues: ad break not found for trigger", {
                        hb: C,
                        cc: Array.from(this.tn.cc.keys())
                    });
                  }
                } catch (G) {
                  r = {
                    error: G
                  };
                } finally {
                  try {
                    B && !B.done && (u = z.return) && u.call(z);
                  } finally {
                    if (r)
                    throw r.error;
                  }
                }
                A.length && v.add(A);
              }
            } catch (G) {
              var E;
              E = {
                error: G
              };
            } finally {
              try {
                x && !x.done && (q = w.return) && q.call(w);
              } finally {
                if (E)
                throw E.error;
              }
            }
            return v;
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: n.dRc(q) */ n.prototype.dRc = function(q) {
      var r;
      if (null === (r = q.wd) || undefined === r ? 0 : r.Uj)
      (q = q.wd,
        q.A9 && (false,
          this.ZDb(q, new c.AbortController())));
    }
    ;
    /* method: n.Aza() */ n.prototype.Aza = function() {
      d.__awaiter(this, undefined, undefined, function() {
          return d.__generator(this, function() {
              this.AU.Ho || this.AU.kd();
              return [2];
          });
      });
    }
    ;
    /* method: n.Chc(q) */ n.prototype.Chc = function(q) {
      var r;
      r = this;
      q.forEach(function(u) {
          if (u = u.Cu())
          (false,
            r.ppa.delete(u));
      });
    }
    ;
    /* method: n.Lvb(q, r, u) */ n.prototype.Lvb = function(q, r, u) {
      var v;
      if (!r.has(q)) {
        v = q.yb;
        if (v && 0 !== v.length) {
          false;
          for (var w = function(A) {
              A = v[A];
              if (null === A || undefined === A || !A.id)
              return "continue";
              A = x.kC.Yp(A.id, {
                  Mf: {
                    Kb: x.L.S.Kb,
                    jd: x.L.J
                  },
                  Ep: true
              });
              A.mq.then(function() {
                  false;
              });
              r.Oqb(q, A.Qk);
            }, x = this, y = 0; y < u; y++)
          w(y);
        }
      }
    }
    ;
    /* method: n.Rsc(q) */ n.prototype.Rsc = function(q) {
      d.__awaiter(this, undefined, undefined, function() {
          var r, u, v, w, x, y, A, z, B, C, D, E;
          return d.__generator(this, function(G) {
              switch (G.label) {
                case 0:
                (null === (D = this.z9) || undefined === D ? undefined : D.mh.abort(),
                  r = new c.AbortController(),
                  this.z9 = {
                    mh: r
                  },
                  v = this.$y,
                  w = d.__read((0,
                      e.wKb)(this.kC.VU.bind(this.kC)), 2),
                  x = w[0],
                  y = w[1],
                  G.label = 1);
                case 1:
                return (G.ac.push([1, 3, , 4]),
                  A = Array.from(this.tn.cc.keys()).filter(function(F) {
                      return -1 === v.indexOf(F);
                  }),
                  [4, x({
                        Mf: {
                          Kb: this.L.S.Kb,
                          jd: this.L.J
                        },
                        $y: v,
                        t$: A
                      }, r.signal)]);
                case 2:
                return (u = G.T(),
                  z = {
                    L: this.L,
                    lOb: u,
                    Ow: q,
                    AJ: {
                      jC: y.start,
                      mC: y.end
                    }
                  },
                  this.events.emit("daiPrefetchComplete", z),
                  [3, 4]);
                case 3:
                return (B = G.T(),
                  this.console.error("DaiPrefetcher: error fetching prefetch ads", p.VC.wy(B)),
                  C = h.bD.Sba(B),
                  z = {
                    L: this.L,
                    Ow: q,
                    AJ: {
                      jC: y.start,
                      mC: y.end
                    },
                    error: B,
                    errorCode: C
                  },
                  this.events.emit("daiPrefetchFailed", z),
                  this.rSb(r, l.rP),
                  [2]);
                case 4:
                if (r.signal.aborted)
                return ((null === (E = this.z9) || undefined === E ? undefined : E.mh) === r && (this.Cda = l.cp),
                  [2]);
                false;
                this.ZDb(u, r);
                this.zZa = v.length;
                this.rSb(r, l.ai);
                return [2];
              }
          });
      });
    }
    ;
    /* method: n.ZDb(q, r) */ n.prototype.ZDb = function(q, r) {
      var u, v, w, A, z, B, C, D, E, G, F, H, J, M;
      w = new p.tGa({
          Sya: p.$Ja.all
      });
      this.nJc(q);
      q = this.L.config;
      q = {
        Lp: q.Lp,
        Wu: q.Wu
      };
      try {
        for (var x = d.__values(this.tn.C9), y = x.next(); !y.done; y = x.next()) {
          A = y.value;
          z = A[0];
          if (z) {
            B = this.tn.cc.get(z);
            if (B) {
              C = B.yb || [];
              D = A[1];
              E = D ? this.tn.cc.get(D) : undefined;
              G = (null === E || undefined === E ? undefined : E.yb) || [];
              F = d.__spreadArray(d.__spreadArray([], d.__read(C), false), d.__read(G), false);
              H = (0,
                k.ofc)(F, q);
              J = Math.min(H, C.length);
              M = Math.max(0, H - C.length);
              false;
              this.Lvb(B, w, J);
              E && 0 < M && this.Lvb(E, w, M);
            } else
            this.console.error("DaiPrefetcher: ad break not found for trigger", {
                hb: z,
                cc: Array.from(this.tn.cc.keys())
            });
          }
        }
      } catch (L) {
        var K;
        K = {
          error: L
        };
      } finally {
        try {
          y && !y.done && (u = x.return) && u.call(x);
        } finally {
          if (K)
          throw K.error;
        }
      }
      r.signal.addEventListener("abort", function() {
          false;
          w.clear();
      });
      null === (v = this.Vmc) || undefined === v ? undefined : v.mh.abort();
      this.Vmc = {
        mh: r
      };
      this.Qua = w;
      this.z9 = undefined;
    }
    ;
    /* method: n.nJc(q) */ n.prototype.nJc = function(q) {
      var r, u, v, y, A;
      v = this.$y;
      try {
        for (var w = d.__values(Object.keys(q.A9)), x = w.next(); !x.done; x = w.next()) {
          y = x.value;
          A = q.A9[y];
          "" === y ? this.console.error("Empty ad break trigger id in prefetch data") : "REMOVE" === A.action || -1 !== v.indexOf(y) ? (false,
            this.tn.cc.delete(y)) : "UPSERT" === A.action && (A.Sa.yu || null !== (u = A.Sa.yb) && undefined !== u && u.length ? (false,
              this.tn.cc.set(y, A.Sa)) : this.console.error("Empty dynamic ad break in prefetch data", {
                nia: y,
                Sa: A.Sa
          }));
        }
      } catch (B) {
        var z;
        z = {
          error: B
        };
      } finally {
        try {
          x && !x.done && (r = w.return) && r.call(w);
        } finally {
          if (z)
          throw z.error;
        }
      }
      this.tn.C9 = q.vNc.map(function(B) {
          return B.filter(function(C) {
              C = -1 !== v.indexOf(C);
              false;
              return !C;
          });
      }).filter(function(B) {
          return B.length;
      });
    }
    ;
    /* method: n.WH() */ n.prototype.WH = function() {
      return this.ppa;
    }
    ;
    /* method: n.uhc(q, r) */ n.prototype.uhc = function(q, r) {
      var u, v, w, x, y, A;
      v = this;
      false;
      w = this.tn.cc.has(q);
      x = this.tn.C9.some(function(D) {
          return D[0] === q;
      });
      if (w && x) {
        y = this.tn.cc.get(q);
        this.Lj.uu(p.ie.Mz(p.I.Ca(1E3)), function() {
            return d.__awaiter(v, undefined, undefined, function() {
                return d.__generator(this, function(D) {
                    switch (D.label) {
                      case 0:
                      return [4, this.ka.Kga()];
                      case 1:
                      return (D.T(),
                        this.Qua.delete(y),
                        [2]);
                    }
                });
            });
          }, "delayedLeaseCleanup");
        w = function(D) {
          var E, G, F;
          E = D.indexOf(q);
          -1 !== E && D.splice(E, 1);
          G = y.yb || [];
          F = r.duration.G;
          G = G.filter(function(H) {
              H = H.eb - H.Va;
              if (F >= H - 1E4)
              return (F = Math.max(F, 0),
                F -= H,
                true);
              false;
              F = -Infinity;
              return false;
          });
          0 === E && 0 < D.length && ((E = A.tn.cc.get(D[0])) ? A.zxc(0 < F ? r.duration.G - F : r.duration.G, r, E, D) : A.console.error("Invalid state detected, did not have adbreak metadata for ad break trigger", {
                triggerId: D[0]
          }));
          A.ppa.set(q, {
              status: m.ai,
              Sa: d.__assign(d.__assign({}, y), {
                  yb: G
              })
          });
          A.tn.cc.delete(q);
        }
        ;
        A = this;
        try {
          for (var z = d.__values(this.tn.C9), B = z.next(); !B.done; B = z.next())
          w(B.value);
        } catch (D) {
          var C;
          C = {
            error: D
          };
        } finally {
          try {
            B && !B.done && (u = z.return) && u.call(z);
          } finally {
            if (C)
            throw C.error;
          }
        }
      } else
      (false,
        this.Cda === l.lib && this.ppa.set(q, {
            status: m.ngb
      }));
    }
    ;
    /* method: n.zxc(q, r, u, v) */ n.prototype.zxc = function(q, r, u, v) {
      var x, y, A, z, B, C, D;
      function w(E) {
        var G, F;
        G = C[E];
        if (0 <= G.x_a)
        return "break";
        F = B[E];
        if (null === F || undefined === F || !F.id)
        return "continue";
        E = D.L.Ic.Yga(z + G.x_a + Math.random() * y.Lp);
        false;
        E = D.Lj.uu(p.ie.Jm(p.I.Ca(E)), function() {
            return d.__awaiter(x, undefined, undefined, function() {
                return d.__generator(this, function() {
                    v[0] === u.hb ? this.Elc(u, F) : false;
                    return [2];
                });
            });
          }, ("liveNextAdBreakManifestWindow_").concat(F.id));
        D.kZa.push(E);
      }
      x = this;
      y = this.L.config;
      A = {
        Lp: y.Lp,
        Wu: y.Wu
      };
      q = r.Ga.add(p.I.Ca(q));
      z = this.L.Ic.iRa(q).G;
      B = u.yb || [];
      C = (0,
        k.ttb)(B, A);
      false;
      D = this;
      for (A = 0; A < C.length && "break" !== w(A); A++)
      ;
    }
    ;
    /* method: n.Elc(q, r) */ n.prototype.Elc = function(q, r) {
      r = this.kC.Yp(r.id, {
          Mf: {
            Kb: this.L.S.Kb,
            jd: this.L.J
          },
          Ep: true
      });
      r.mq.then(function() {
          false;
      });
      this.Qua.Oqb(q, r.Qk);
    }
    ;
    /* method: n.XVc() */ n.prototype.XVc = function() {
      var q;
      return d.__generator(this, function(r) {
          switch (r.label) {
            case 0:
            q = this.Vxc();
            if (!q.fZ)
            return [3, 2];
            this.Cda = l.lib;
            return [4, p.ie.Jm(p.I.Ca(q.bKc))];
            case 1:
            (r.T(),
              this.Rsc(q),
              r.label = 2);
            case 2:
            return [2];
          }
      });
    }
    ;
    /* method: n.Vxc() */ n.prototype.Vxc = function() {
      var r, u, v, w, x, y, A, z;
      function q(B, C) {
        var D;
        B = null !== (D = null !== B && undefined !== B ? B : x) && undefined !== D ? D : 0;
        C = null !== C && undefined !== C ? C : w;
        D = undefined === C ? B : Math.floor(Math.random() * C) + B;
        false;
        return {
          SBa: B,
          cYb: C,
          xC: D
        };
      }
      if (!this.enabled)
      return (false,
        {
          fZ: false
      });
      u = this.L.S.wd;
      v = this.yFc;
      if (this.tn.cc.size && (null === (r = this.L.cg) || undefined === r || !r.MSc) || this.$y.length && this.$y.length === this.zZa || !this.L.Ic.dE)
      return (false,
        {
          fZ: false
      });
      w = u.exb;
      x = u.Enc;
      r = u.MCc;
      y = u.NCc;
      if (v) {
        u = "lastAdBreak";
        A = v.Ga.add(v.duration);
      } else
      (u = "programStart",
        A = this.L.Ic.dE);
      if (v) {
        if (!v.EPb && "mediaEvents" !== v.source)
        return (false,
          {
            fZ: false
        });
        v = q(v.rQc, v.qQc);
      } else
      v = q(y, r);
      r = this.L.Ic.iRa(A);
      A = this.L.Ic.Gdc(r);
      y = A.da(r).G;
      z = A.add(p.I.Ca(v.xC));
      z = this.L.Ic.Yga(z.G);
      u = d.__assign(d.__assign({
            fZ: true
          }, v), {
          nya: y,
          TQ: r,
          Brb: u,
          GF: this.L.Wf,
          bKc: z,
          tkd: A.G
      });
      false;
      return u;
    }
    ;
    /* method: n.La() */ n.prototype.La = function() {
      var q, r;
      false;
      null === (r = this.z9) || undefined === r ? undefined : r.mh.abort();
      this.Qua.La();
      this.AU.La();
      this.eS.clear();
      try {
        for (var u = d.__values(this.kZa), v = u.next(); !v.done; v = u.next())
        v.value.La();
      } catch (x) {
        var w;
        w = {
          error: x
        };
      } finally {
        try {
          v && !v.done && (q = u.return) && q.call(u);
        } finally {
          if (w)
          throw w.error;
        }
      }
      this.kZa = [];
    }
    ;
    /* method: n.rSb(q, r) */ n.prototype.rSb = function(q, r) {
      var u;
      q === (null === (u = this.z9) || undefined === u ? undefined : u.mh) && (this.Cda = r);
    }
    ;
    return n;
  }
)();
export const tbb = t;

// Detected exports: tbb
