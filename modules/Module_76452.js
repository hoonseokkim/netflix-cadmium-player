/**
 * Netflix Cadmium Playercore - Module 76452
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_76452
 * @description DRM license management; Ad break management; Timeline/timestamp management; Configuration management; Event system; CDN/server URL management; Track switching; Stream selection; Live streaming support; Logging/telemetry
 * @size 43,201 chars (raw), 25,168 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (13 imports)
 *   d <- Module 22970 (simple)
 *   p <- Module 90745 (simple)
 *   c <- Module 91176 (simple)
 *   g <- Module 91562 (simple)
 *   f <- Module 66164 (simple)
 *   e <- Module 48170 (simple)
 *   h <- Module 8149 (simple)
 *   k <- Module 61996 (simple)
 *   l <- Module 54366 (simple)
 *   m <- Module 45173 (simple)
 *   n <- Module 89025 (simple)
 *   q <- Module 12381 (simple)
 *   r <- Module 4786 (simple)
 *
 * @exports (1 exports)
 *   Ogb
 */

// Webpack module 76452
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r;
// [__esModule declaration removed]
// b.Ogb = undefined; [pre-declaration]
import * as d from "./Module_22970"; // a(22970)
import * as p from "./Module_90745"; // a(90745)
import * as c from "./Module_91176"; // a(91176)
import * as g from "./Module_91562"; // a(91562)
import * as f from "./Module_66164"; // a(66164)
import * as e from "./Module_48170"; // a(48170)
import * as h from "./Module_08149"; // a(8149)
import * as k from "./Module_61996"; // a(61996)
import * as l from "./Module_54366"; // a(54366)
import * as m from "./Module_45173"; // a(45173)
import * as n from "./Module_89025"; // a(89025)
import * as q from "./Module_12381"; // a(12381)
import * as r from "./Module_04786"; // a(4786)
t = (function() {
    function u(v, w, x, y) {
      var A, z, B, C, D, E, G, F, H;
      A = this;
      this.L = w;
      this.config = x;
      this.fN = y;
      this.model = {
        Il: [],
        get NM() {
          return 0 < this.Il.length ? this.Il[this.Il.length - 1] : undefined;
        },
        get Dra() {
          return 0 < this.Il.length ? this.Il[0] : undefined;
        },
        OB: [],
        cc: [],
        A1c: function() {
          return {
            last5NetflixMediaEvents: this.OB.map(function(J) {
                return {
                  id: J.id,
                  contentTimestamp: new c.YX(J.Ga,J.Ga.add(J.duration)).toString()
                };
            }).slice(-5),
            netflixMediaEventsCount: this.OB.length,
            last5adBreaks: this.cc.map(function(J) {
                return {
                  id: J.id,
                  contentTimestamp: new c.YX(J.Ga,J.Ga.add(J.duration)).toString()
                };
            }).slice(-5),
            adBreaksCount: this.cc.length,
            last5Programs: this.Il.map(function(J) {
                var M, K;
                return {
                  id: J.id,
                  programStart: null === (M = J.Yk) || undefined === M ? undefined : M.Ga.toString(),
                  programEnd: null === (K = J.Xk) || undefined === K ? undefined : K.Ga.toString()
                };
            }).slice(-5)
          };
        }
      };
      this.vNa = false;
      this.OB = new Map();
      this.cc = new Map();
      this.nr = new c.LP([],function(J, M) {
          return J.eg - M.eg;
        }
      );
      this.KG = c.I.g0a;
      this.xo = new q.Hgb();
      this.xZc = function(J, M) {
        var K, L, O;
        if (!J.presentationTime.equal(M.presentationTime))
        return J.presentationTime.xl(M.presentationTime);
        (0,
          c.assert)(J.type !== M.type, "events with the same presentation time should not have the same type");
        O = {
          breakend: 1,
          cancel: 1,
          programend: 2,
          programstart: 3,
          adbreak: 3,
          breakstart: 4,
          programbreakaway: 5,
          netflix: 6
        };
        J = null !== (K = O[J.type]) && undefined !== K ? K : 0;
        M = null !== (L = O[M.type]) && undefined !== L ? L : 0;
        return J - M;
      }
      ;
      (0,
        c.assert)(w.Ab, "MediaEventsStore requires live Viewable");
      this.events = new p.EventEmitter();
      y = c.I.ia;
      this.behavior = (0,
        r.Qlc)(this.L, this.model);
      this.console = new f.platform.Console("MEDIAEVENTSSTORE","asejs",("[").concat(this.L.R, "]"));
      e.u && this.console.log(("Creating MediaEventsStore: synthesizeLiveIdrMismatch=").concat(this.config.J4));
      this.tk = new k.Tm({
          Ej: this,
          source: "media-events-store",
          Ig: 10,
          console: this.console
      });
      this.L.jf.Xc(new l.ko(this.tk));
      G = x.Paa;
      if (this.fN && G) {
        F = this.fN;
        G = F.Wmc;
        H = F.Zdc;
        (F = F.O) && G >= H && (y = c.I.Ca(G - H).Rc(F));
        F = c.I.Ca(this.L.Al(true));
        this.KKb(y, F) && (e.u && this.console.log("needs events from media event history, adjusting startContentTimestamp", "startContentTimestamp", null === y || undefined === y ? undefined : y.ca(), "logicalLiveEdge", null === F || undefined === F ? undefined : F.ca(), "new startContentTimestamp", null === (z = c.I.min(y, F)) || undefined === z ? undefined : z.ca()),
          y = c.I.min(y, F));
        this.HOb(y);
        e.u && this.console.log("processed history: cutoffTimeMs", G, "baseTimeMs", H, "startContentTimestamp", y.ca());
      } else
      e.u && this.console.log("no media events history");
      this.behavior.cTb() && (this.ut = new m.Igb(v,w,x,this.jda.bind(this),this.xo),
        this.ut.events.on("mediaEventsReceived", function(J) {
            var M;
            A.nr.push(J);
            e.u && A.console.info("Received media events", {
                eg: J.eg,
                Amd: A.nr.Ij().slice(0, 5).map(function(K) {
                    return K.eg;
                })
            });
            A.process();
            A.complete && (null === (M = A.ut) || undefined === M ? undefined : M.La());
        }),
        this.ut.events.on("eosReceived", function() {
            var J;
            null === (J = A.ut) || undefined === J ? undefined : J.La();
        }),
        this.events.on("modelUpdated", function() {
            A.vNa = true;
      }));
      null !== (B = this.L.Ic.$aa) && undefined !== B && B.isFinite() ? undefined === (null === (C = this.model.NM) || undefined === C ? undefined : C.Xk) && (v = this.L.Ic.dE,
        undefined !== v && (y = c.I.max(y, v))) : (v = w.Hy ? x.eGc : x.fIb,
        y = c.I.max(y, c.I.Ca(this.L.Al(true) - v)));
      this.L.events.on("urlsUpdated", function() {
          var J;
          null === (J = A.ut) || undefined === J ? undefined : J.Aia(A.Kn);
      });
      this.start(y);
      e.u && this.ut && this.console.log(("starting retrieval at segment ").concat(this.Kn, ", ") + ("startSegmentNumber: ").concat(this.stream.track.Qo, ", ") + ("startContentTimestamp: ").concat(y.ca(), ", ") + "eventStartContentTimestamp: " + ("").concat(null === (D = this.L.Ic.dE) || undefined === D ? undefined : D.ca(), ", ") + "eventEndContentTimestamp: " + ("").concat(null === (E = this.L.Ic.$aa) || undefined === E ? undefined : E.ca(), ", ") + ("logicalLiveEdge: ").concat(this.L.Al(true), ", ") + ("averageSegmentDuration: ").concat(this.stream.track.Tj.ca()));
    }
    Object.defineProperties(u.prototype, {
        Sw: {
          get: function() {
            return this.KG;
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        MSc: {
          get: function() {
            return this.vNa;
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        complete: {
          get: function() {
            return this.jda(this.Sw);
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        track: {
          get: function() {
            var v;
            v = this.L.getTracks(g.l.yk)[0];
            (0,
              c.assert)((0,
                h.Gn)(v), "MediaEventsStore: track is not live");
            return v;
          },
          enumerable: false,
          configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        stream: {
          get: function() {
            return this.track.Xd[0];
          },
          enumerable: false,
          configurable: true
        }
    });
    /* method: u.cuc() */ u.prototype.cuc = function() {
      var v;
      v = c.I.Ca(this.L.Al(true) - this.config.fIb);
      this.Kn = 0;
      this.nr.clear();
      this.vNa = false;
      this.KG = v;
      this.kd(v);
    }
    ;
    /* method: u.nEb(v) */ u.prototype.nEb = function(v) {
      var w;
      if (this.complete || this.Sw.greaterThan(v))
      return (e.u && this.console.trace("" + ("hasMediaEvents ").concat(v.ca(), " returns true")),
        true);
      w = v.da(c.I.Ca(this.config.LGc));
      e.u && this.console.trace(("hasMediaEvents ").concat(v.ca(), " returns false,") + (" cutoff (").concat(this.Sw.ca(), ")") + (" catchup (").concat(w.ca(), ")"));
      this.Sw.lessThan(w) && (e.u && this.console.trace(("catchup to ").concat(w.ca())),
        this.kd(w));
      return false;
    }
    ;
    /* method: u.lTb(v) */ u.prototype.lTb = function(v) {
      !this.complete && this.Sw.Hn(v) && (v = v.add(this.track.Tj),
        e.u && this.console.trace(("skip to ").concat(v.ca())),
        this.kd(v));
    }
    ;
    u.prototype.$Lb = function(v, w) {
      var A;
      e.u && this.console.trace(("POI changed from ").concat(v.ca(), " to ").concat(w.ca()));
      for (var x = false, y = 0; y < this.model.cc.length; y++) {
        A = this.model.cc[y];
        if (A.Ga.G === v.G) {
          e.u && this.console.trace(("Updating adBreak ").concat(y, ", id:").concat(A.id, " location: ").concat(A.Ga.ca()) + (" to location ").concat(w.ca(), " ") + ("from ").concat(A.Ga.ca(), " and duration from ").concat(A.duration.ca(), " ") + ("to ").concat(A.duration.add(A.Ga.da(w)).ca()));
          A.duration = A.duration.add(A.Ga.da(w));
          A.Ga = w;
          x = true;
          break;
        }
        if (A.Ga.add(A.duration).G === v.G) {
          e.u && this.console.trace(("Updating adBreak ").concat(y, ", id:").concat(A.id, " location: ").concat(A.Ga.ca()) + (" duration to ").concat(w.da(A.Ga).ca(), " ") + ("from ").concat(A.duration.ca()));
          A.duration = w.da(A.Ga);
          x = true;
          break;
        }
      }
      e.u && !x && this.console.warn(("POI changed from ").concat(v.ca(), " to ").concat(w.ca(), " but no adBreak found"));
    }
    ;
    /* method: u.start(v) */ u.prototype.start = function(v) {
      v = Math.floor(v.Af(this.stream.track.Tj));
      this.Kn = v + this.stream.track.Qo;
      this.KG = this.stream.track.Tj.wh(v);
      this.ut && ((0,
          c.assert)(!this.ut.zj, "retrieval service should not be running at start"),
        this.ut.start(this.Kn));
    }
    ;
    /* method: u.kd(v) */ u.prototype.kd = function(v) {
      var w, x, y;
      w = Math.floor(v.Af(this.stream.track.Tj));
      x = this.Kn;
      y = w + this.stream.track.Qo;
      y > x && (this.Kn = y,
        this.KG = this.stream.track.Tj.wh(w));
      this.ut && ((e.u && this.console.trace("Restarting retrieval", {
              start: v.ca(),
              r2: y
          }),
          this.ut.Bca) ? y > x && (this.nr.clear(),
          this.ut.kd(this.Kn)) : this.ut.start(this.Kn));
      this.process();
    }
    ;
    /* method: u.jda(v) */ u.prototype.jda = function(v) {
      var w, x;
      if (this.behavior.jda())
      return (e.u && this.console.trace("isEventsModelComplete ending because the model is complete"),
        true);
      w = this.L.Ic.eUb;
      x = v.$f(w);
      x && e.u && this.console.trace("isEventsModelComplete ending at time:", {
          Ga: v,
          eUb: w
      });
      return x;
    }
    ;
    /* method: u.process() */ u.prototype.process = function() {
      var v, w, x, y, A, z, B, C, D, E, H, J;
      D = new Set();
      E = [];
      null !== (x = this.Kn) && undefined !== x ? x : this.Kn = this.stream.track.Qo;
      x = false;
      for (e.u && this.console.log("Starting process loop", {
            eg: this.Kn,
            Mtc: null === (y = this.nr.mr()) || undefined === y ? undefined : y.eg,
            WOc: this.nr.length,
            Mwb: this.KG.toString()
        }); 0 < this.nr.length; )
      if ((y = this.nr.mr(),
          (null === y || undefined === y ? undefined : y.eg) === this.Kn)) {
        y.events.length ? e.u && this.console.log("Adding media events", {
            eg: this.Kn,
            next: y
        }) : e.u && this.console.debug("Empty media events", {
            eg: this.Kn,
            next: y
        });
        x = null === y || undefined === y ? undefined : y.events;
        x.sort(this.xZc);
        try {
          for (var G = (v = undefined,
              d.__values(x)), F = G.next(); !F.done; F = G.next()) {
            H = F.value;
            if (this.fN) {
              J = this.fN.O;
              H.presentationTime = H.presentationTime.Rc(J);
              H.xw = H.xw ? H.xw.Rc(J) : undefined;
            }
            this.vOa(H) && (D.add(H.type),
              E.push(H.presentationTime),
              e.u && this.console.debug("Adding event updated model", {
                  Ped: H.presentationTime,
                  wa: y.wa
            }));
          }
        } catch (M) {
          v = {
            error: M
          };
        } finally {
          try {
            F && !F.done && (w = G.return) && w.call(G);
          } finally {
            if (v)
            throw v.error;
          }
        }
        this.KG = c.I.max(this.Sw, y.wa);
        x = true;
        this.Kn++;
        this.nr.pop();
      } else if ((null !== (A = null === y || undefined === y ? undefined : y.eg) && undefined !== A ? A : 0) < this.Kn)
      (e.u && this.console.warn("Dropping old media event", {
            PKc: this.Kn,
            Qed: null === y || undefined === y ? undefined : y.eg
        }),
        this.nr.pop(),
        null === (z = this.xo) || undefined === z ? undefined : z.qMc(null !== (B = null === y || undefined === y ? undefined : y.eg) && undefined !== B ? B : 0));
      else {
        e.u && e.u && this.console.info("First item in queue is later... waiting", {
            PKc: this.Kn,
            ifd: null === y || undefined === y ? undefined : y.eg
        });
        break;
      }
      0 < D.size && this.events.emit("modelUpdated", {
          type: "modelUpdated",
          h5: D,
          dwa: E
      });
      x && (e.u && this.console.trace("" + ("progress to ").concat(this.KG.ca())),
        this.events.emit("progress", {
            type: "progress",
            wa: this.KG
      }));
      e.u && this.console.log("Exiting process loop", {
          eg: this.Kn,
          Mtc: null === (C = this.nr.mr()) || undefined === C ? undefined : C.eg,
          Mwb: this.KG.toString(),
          Tid: x,
          jkd: this.nr.Ij().map(function(M) {
              return M.eg;
          })
      });
    }
    ;
    /* method: u.HOb(v) */ u.prototype.HOb = function(v) {
      var w, x, y, A, z, B;
      w = this;
      x = [];
      if (this.fN) {
        y = this.fN;
        A = y.In;
        z = y.O;
        if (A.length) {
          B = new Set();
          A.forEach(function(C) {
              var D, E, G, F, H, J;
              D = new c.I(C.timestamp,z);
              E = undefined !== C.duration ? new c.I(C.duration,z) : undefined;
              if ("netflix" === C.type) {
                F = C.type;
                H = C.id;
                C = C.Qj;
                v.$f(D.add(E || c.I.ia)) ? G = {
                  type: F,
                  id: H,
                  presentationTime: D,
                  xw: E,
                  Qj: C
                } : e.u && w.console.trace("skipping in-progress event id:", H);
              } else {
                F = C.type;
                G = C.Zp;
                J = C.hb;
                H = C.id;
                G = {
                  type: F,
                  id: H,
                  presentationTime: D,
                  xw: E,
                  Zp: G,
                  hb: J
                };
              }
              G && (w.vOa(G),
                x.push(G.presentationTime),
                B.add(G.type));
          });
          B.size && this.events.emit("modelUpdated", {
              type: "modelUpdated",
              h5: B,
              dwa: x
          });
          this.tk.Eg({
              store: this.model.A1c()
          });
        }
      }
    }
    ;
    /* method: u.vOa(v) */ u.prototype.vOa = function(v) {
      var w, x;
      x = (0,
        n.Vta)(v) ? this.Iac(v) : this.Vac(v);
      this.tk.Eg({
          cc: this.model.cc.length,
          bed: x,
          type: v.type
      });
      null === (w = this.xo) || undefined === w ? undefined : w.WLc(v, x, v.presentationTime);
      return x;
    }
    ;
    /* method: u.Iac(v) */ u.prototype.Iac = function(v) {
      var w, x, y, A;
      w = false;
      x = v.xDc;
      y = ("").concat(v.id, "-").concat(v.Qj);
      A = this.OB.get(y);
      A || x ? A && x ? (x = v.presentationTime.da(A.Ga),
        w = this.b3(v, A, x),
        v = d.__assign(d.__assign({}, A), {
            duration: x,
            cF: v.cF,
            payload: v.payload
        }),
        e.u && this.console.trace("emitting netflixEventCancelled:", v),
        this.events.emit("netflixEventCancelled", v)) : e.u && this.console.trace("Duplicate NetflixMediaEvent ignored:", {
          ETa: y,
          Ved: A,
          event: v
      }) : (v = {
          key: y,
          id: v.id,
          duration: v.xw || c.I.ia,
          Ga: v.presentationTime,
          Qj: v.Qj,
          cF: v.cF,
          payload: v.payload
        },
        this.OB.set(v.key, v),
        w = true,
        e.u && this.console.trace("emitting netflixEventReceived:", v),
        this.events.emit("netflixEventReceived", v));
      w && (this.model.OB = Array.from(this.OB.values()));
      return w;
    }
    ;
    /* method: u.Vac(v) */ u.prototype.Vac = function(v) {
      var w, x, y, A, z, B;
      y = false;
      A = v.eWc;
      z = (null === A || undefined === A ? undefined : A.Tga) || v.Zp;
      if (this.config.J4) {
        B = null === (w = this.L.getTracks(g.l.U)[0].Ha) || undefined === w ? undefined : w.wh(this.config.J4);
        B && (this.console.log(("Adjusting event timestamp ").concat(v.presentationTime.ca(), " by ").concat(B.ca())),
          v.presentationTime = v.presentationTime.add(B));
      }
      w = v.presentationTime.$;
      this.console.debug("Processing event", {
          id: w,
          IFc: this.Sw,
          event: v
      });
      if (this.behavior.ytb(v))
      switch ((B = this.model.NM,
          v.type)) {
        case "breakstart":
        case "adbreak":
        if (v.presentationTime.lessThan(this.Sw))
        break;
        if ((x = this.cc.get(w)) && x.Ga.equal(v.presentationTime) && x.duration.equal(v.xw || c.I.ia) && x.Zp === z)
        break;
        this.behavior.xtb() && (this.Gqb(w, v, A),
          y = true);
        break;
        case "cancel":
        x = this.model.cc.filter(function(C) {
            return C.pRb === (null === A || undefined === A ? undefined : A.id) && C.Zp === z;
        }).sort(function(C, D) {
            return C.Ga.xl(D.Ga);
        });
        if (0 === x.length)
        break;
        x = x[x.length - 1];
        if (x.Ga.add(x.duration).lessThan(v.presentationTime))
        break;
        y = this.b3(v, x, v.presentationTime.da(x.Ga));
        break;
        case "breakend":
        x = this.model.cc.filter(function(C) {
            var D;
            D = new c.YX(C.Ga,C.Ga.add(C.duration));
            return C.pRb === (null === A || undefined === A ? undefined : A.id) && D.OZ(v.presentationTime);
        }).sort(function(C, D) {
            return C.Ga.xl(D.Ga);
        });
        if (0 === x.length)
        break;
        x = x[x.length - 1];
        if (x.Ga.add(x.duration).lessThan(v.presentationTime))
        break;
        y = this.XDb(x, v);
        break;
        case "programend":
        !B || B.id !== v.id || null !== (x = B.Xk) && undefined !== x && x.Ga || (this.console.debug("Setting program end", v.presentationTime),
          B.Xk = {
            Ga: v.presentationTime
          },
          y = true);
        break;
        case "programstart":
        B && B.id === v.id ? v.xw && v.xw.isFinite() && v.xw.greaterThan(c.I.ia) && !B.Xk && (this.console.debug("Setting program end from programstart event", v.presentationTime),
          B.Xk = {
            Ga: v.presentationTime.add(v.xw)
          },
          y = true) : 0 < this.model.Il.filter(function(C) {
            return C.id === v.id;
        }).length ? this.console.debug("Skipping program start because it not the latest program start", v.presentationTime) : (null === B || undefined === B ? 0 : B.Yk) && v.presentationTime.lessThan(B.Yk.Ga) ? this.console.debug("Skipping program start event because it is before the last program start", v.presentationTime) : (B && !B.Xk && (this.console.debug("Received a new program start while program end is not set, setting program end automatically", v.presentationTime),
            B.Xk = {
              Ga: v.presentationTime
          }),
          this.console.debug("Setting program start", v.presentationTime),
          (0,
            c.assert)(undefined !== v.id, "Program start event must have an id"),
          this.model.Il.push({
              id: v.id,
              Yk: {
                Ga: v.presentationTime
              }
          }),
          y = true);
      }
      y && (this.model.cc = Array.from(this.cc.values()));
      return y;
    }
    ;
    /* method: u.Gqb(v, w, x) */ u.prototype.Gqb = function(v, w, x) {
      var y, A, z;
      z = null === (A = null === (y = this.model.NM) || undefined === y ? undefined : y.Yk) || undefined === A ? undefined : A.Ga;
      y = (null === x || undefined === x ? undefined : x.Tga) || w.Zp;
      this.cc.set(v, {
          id: v,
          duration: w.xw || c.I.ia,
          Ga: w.presentationTime,
          location: z ? w.presentationTime.da(z) : c.I.ia,
          Zp: y,
          hb: w.hb,
          pRb: null === x || undefined === x ? undefined : x.id
      });
      e.u && this.console.debug("Upserting event", {
          id: v,
          Sa: this.cc.get(v)
      });
    }
    ;
    /* method: u.b3(v, w, x) */ u.prototype.b3 = function(v, w, x) {
      var y;
      y = false;
      x.equal(c.I.ia) ? (this.console.debug("Deleting event", w.id),
        this.tk.Eg({
            deleting: true
        }),
        (0,
          n.Vta)(v) ? this.OB.delete(w.key) : this.cc.delete(w.id),
        y = true) : x.TT(w.duration) && (this.console.debug("Updating event", {
            id: w.id,
            zKc: x
        }),
        this.tk.Eg({
            adjusting: x
        }),
        (0,
          n.Vta)(v) ? this.OB.set(w.key, d.__assign(d.__assign({}, w), {
              duration: x
        })) : this.cc.set(w.id, d.__assign(d.__assign({}, w), {
              duration: x
        })),
        y = true);
      return y;
    }
    ;
    /* method: u.XDb(v, w) */ u.prototype.XDb = function(v, w) {
      var x;
      x = false;
      w = w.presentationTime.da(v.Ga);
      w.equal(c.I.ia) ? this.console.error("Unexpected zero-length adBreak after breakend media event (early terminated adbreak)", v.hb) : w.TT(v.duration) && (this.console.debug("Updating event", {
            id: v.id,
            zKc: w
        }),
        this.tk.Eg({
            adjusting: w
        }),
        this.cc.set(v.id, d.__assign(d.__assign({}, v), {
              duration: w
        })),
        x = true);
      return x;
    }
    ;
    /* method: u.KKb(v, w) */ u.prototype.KKb = function(v, w) {
      var x, y, A;
      if (this.fN && this.config.upc) {
        x = this.fN;
        y = x.In;
        A = x.O;
        if (y.length)
        return y.some(function(z) {
            var B, C;
            B = new c.I(z.timestamp,A);
            C = undefined !== z.duration ? new c.I(z.duration,A) : undefined;
            C = B.add(C || c.I.ia);
            return "netflix" === z.type && B.lessThan(v) && C.greaterThan(w);
        });
      }
      return false;
    }
    ;
    /* method: u.La() */ u.prototype.La = function() {
      var v;
      null === (v = this.ut) || undefined === v ? undefined : v.La();
    }
    ;
    /* method: u.disable() */ u.prototype.disable = function() {
      var v;
      this.La();
      v = c.I.Ca(72E6);
      this.lTb(v);
    }
    ;
    d.__decorate([(0,
          k.kb)({
            methodName: "processMediaEventsHistory",
            df: true
      })], u.prototype, "HOb", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "addEvent",
            df: true
      })], u.prototype, "vOa", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "addAdBreak",
            gn: true
      })], u.prototype, "Gqb", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "performCancel",
            df: true,
            gn: true
      })], u.prototype, "b3", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "handleBreakEnd",
            df: true,
            gn: true
      })], u.prototype, "XDb", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "needsMediaEventsFromHistory"
      })], u.prototype, "KKb", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "destruct"
      })], u.prototype, "La", null);
    d.__decorate([(0,
          k.kb)({
            methodName: "disable"
      })], u.prototype, "disable", null);
    return u;
  }
)();
export const Ogb = t;

// Detected exports: Ogb
