/**
 * Netflix Cadmium Playercore - Module 92720
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_92720
 * @description ASE Playgraph playback orchestration; MediaSource/SourceBuffer management; DRM license management; Manifest/MPD parsing; Media buffer management; Adaptive bitrate (ABR) logic; Segment downloading/fetching; Error handling/reporting; Playback lifecycle management; Ad break management; Timeline/timestamp management; Network/HTTP request handling; Configuration management; Event system; CDN/server URL management; Track switching; Stream selection; Live streaming support; Caching logic; Logging/telemetry
 * @size 72,233 chars (raw), 40,016 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (18 imports)
 *   p <- Module 45247 (simple)
 *   c <- Module 90745 (simple)
 *   g <- Module 32219 (simple)
 *   f <- Module 36129 (simple)
 *   e <- Module 30326 (simple)
 *   h <- Module 85001 (simple)
 *   k <- Module 29204 (simple)
 *   l <- Module 32687 (simple)
 *   m <- Module 5021 (simple)
 *   n <- Module 64302 (simple)
 *   q <- Module 8825 (simple)
 *   r <- Module 81734 (simple)
 *   u <- Module 64213 (simple)
 *   _ <- Module 2762 (side-effect)
 *   v <- Module 26388 (simple)
 *   w <- Module 45240 (simple)
 *   x <- Module 26668 (simple)
 *   y <- Module 31149 (simple)
 *
 * @exports (1 exports)
 *   YGa
 */

// Webpack module 92720
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A;
function d(z, B, C, D, E) {
  var G;
  G = this;
  this.rb = z;
  this.j = B;
  this.debug = C;
  this.wcc = E;
  this.J8 = this.Ck = this.yK = false;
  this.g9 = this.f9 = this.e9 = undefined;
  this.kza = false;
  z = {};
  this.EB = (z[v.l.V] = {},
    z[v.l.U] = {},
    z[v.l.Ea] = {},
    z[v.l.yk] = {},
    z);
  this.Sob = undefined;
  this.ln = function() {
    var F, H, J, M, K, L;
    G.debug.assert(G.ka, "has access to asePlaygraph");
    G.debug.assert(G.Td, "has access to internalLogger");
    G.debug.assert(G.JB, "has access to mediaBufferGetLogFields");
    K = G.pu;
    L = null === (H = null === (F = G.$c.get()) || undefined === F ? undefined : F.sb) || undefined === H ? undefined : H.Fa;
    F = {
      type: "logdata",
      target: "startplay",
      fields: {
        hasasereport: G.j.A_,
        hashindsight: false,
        buffCompleteReason: K.reason,
        actualbw: L,
        initSelReason: null !== (J = K.initSelReason) && undefined !== J ? J : "unknown",
        bcVBufferLevelMs: K.vBufferLevelMs,
        bcABufferLevelMs: K.aBufferLevelMs
      }
    };
    (0,
      e.kPa)({
        ITa: F,
        Ys: G.Ys,
        loadTime: G.loadTime
    });
    G.ka.S7a("startplay", p.Sc.Gm);
    null !== (M = G.Mb) && undefined !== M && M.Sd ? (G.Td.trace("Buffering complete", {
          Cause: "ASE Buffering complete",
          evt: K
        }, G.JB()),
      G.j.pu = K,
      G.j.ju.set(h.zh.Lf),
      G.Ntc || (G.Ntc = true,
        G.j.qg("pb")),
      [p.Yb.Xla, p.Yb.Wt, p.Yb.aj].includes(G.Mh.value) || G.play()) : G.Td.error("Shim received buffering complete but player has no position (player " + (G.Mb ? "" : "un") + "defined, state " + G.j.state + ")");
  }
  ;
  this.vVb = function() {
    var F, H;
    G.debug.assert(G.Td, "has access to internalLogger");
    false;
    G.e9 = undefined;
    G.f9 = undefined;
    G.g9 = undefined;
    G.j.paused.value && G.hU && (G.hU = false,
      G.j.paused.set(false, {
          QB: true
    }));
    null === (F = G.j.ae) || undefined === F ? undefined : F.tic();
    null === (H = G.hMb) || undefined === H ? undefined : H.call(G);
    G.hMb = undefined;
  }
  ;
  this.events = new A();
  this.He = new u.JLa(this.UD.bind(this),function(F) {
      return G.j.UU(F);
    }
    ,function(F, H) {
      return G.j.VU(F, H);
    }
  );
}
// b.YGa = undefined; [pre-declaration]
import * as p from "./Module_45247"; // a(45247)
import * as c from "./Module_90745"; // a(90745)
import * as g from "./Module_32219"; // a(32219)
import * as f from "./Module_36129"; // a(36129)
import * as e from "./Module_30326"; // a(30326)
import * as h from "./Module_85001"; // a(85001)
import * as k from "./Module_29204"; // a(29204)
import * as l from "./Module_32687"; // a(32687)
import * as m from "./Module_05021"; // a(5021)
import * as n from "./Module_64302"; // a(64302)
import * as q from "./Module_08825"; // a(8825)
import * as r from "./Module_81734"; // a(81734)
import * as u from "./Module_64213"; // a(64213)
import "./Module_02762"; // a(2762) [side-effect]
import * as v from "./Module_26388"; // a(26388)
import * as w from "./Module_45240"; // a(45240)
import * as x from "./Module_26668"; // a(26668)
import * as y from "./Module_31149"; // a(31149)
A = a(17187).EventEmitter;
/* method: d.Ue() */ d.prototype.Ue = function() {
  var z;
  false;
  this.J8 = false;
  this.$c.Yza(null);
  this.debug.assert(this.qk, "has access to streamingEngine");
  this.ka && this.qk.tF(this.ka);
  this.Mb && this.qk.V3a(this.Mb);
  this.qk.ZPb(this.He.Ns(this.rb.ga.J));
  this.He.clear();
  null === (z = this.li) || undefined === z ? undefined : z.Hh();
}
;
/* method: d.iYc(z) */ d.prototype.iYc = function(z) {
  var B, C, D, E, G, F, H, J, M, K, L, O;
  B = z.config;
  C = z.$v;
  D = z.Td;
  E = z.hg;
  G = z.JB;
  F = z.An;
  H = z.cha;
  z = z.hV;
  this.Td = D;
  this.log = D.rR("AseIntegrationImpl");
  false;
  this.bsb = new x.y$a(this.Td);
  this.JB = G;
  this.cha = H;
  this.hV = z;
  G = this.j.ga;
  this.debug.assert(G, "has a playback segment");
  this.debug.assert(B, "has access to config");
  this.debug.assert(E, "has access to utils");
  this.debug.assert(F, "has access to getCategoryLog");
  this.debug.assert(C, "has access to aseGlobals");
  this.debug.assert(C.qk, "has access to streamingEngine");
  this.debug.assert(G.dd, "has access to parsedManifest");
  this.debug.assert(G.S, "has access to manifest");
  this.config = B;
  this.qk = C.qk;
  C.tl.set(a(87141)(B), true, F("ASE"));
  C.tl.set({
      maxNumberTitlesScheduled: null !== (M = null === (J = B.aQc) || undefined === J ? undefined : J.maxNumberTitlesScheduled) && undefined !== M ? M : 1
    }, true, D);
  B.kjc && !G.Hc.Da && 3E5 > G.S.Aa.duration ? C.tl.K1a({
      expandDownloadTime: false
    }, true, D) : C.tl.K1a({
      expandDownloadTime: C.tl.bPc().expandDownloadTime
    }, true, D);
  B = null === (O = null === (L = null === (K = G.oa.Mc) || undefined === K ? undefined : K.streams) || undefined === L ? undefined : L[0]) || undefined === O ? undefined : O.Zc;
  C.tl.K1a((0,
      k.Eic)(!!G.qb.bh, !!G.qb.AE, B), true, D);
  D = E.Hea({}, (0,
      k.$Qa)(G.Ye));
  G.Hc.Da && (D = E.Hea(D, (0,
        k.$Qa)("live")));
  this.tl = C.tl.su(D);
  p.platform.events.emit("networkchange", G.dd.WWc);
  this.yK = true;
}
;
/* method: d.Wca(z) */ d.prototype.Wca = function(z) {
  var B, C;
  this.debug.assert(this.qk, "has access to streamingEngine");
  B = this.j.mm(z.M);
  this.debug.assert(B.dd, "has access to playback parsedManifest");
  false;
  C = z.flags;
  this.$c.reset();
  this.Uh = new Set([v.l.V, v.l.U]);
  (C.zXb || C.icd) && this.Uh.delete(C.zXb ? v.l.V : v.l.U);
  this.$V = [B.dd.znc, B.dd.Knc, B.dd.Inc];
  this.UD(B.R, undefined, z.uR);
  this.PCc(z);
  this.TZ();
}
;
/* method: d.MO(z) */ d.prototype.MO = function(z) {
  var B;
  false;
  null === (B = this.ka) || undefined === B ? undefined : B.MO(z);
}
;
/* method: d.fec(z) */ d.prototype.fec = function(z) {
  var B, C, D;
  B = this;
  C = z.loadTime;
  D = z.Ys;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  this.Ys = D;
  this.loadTime = C;
  z = this.ka.events;
  z.addListener("error", function(E) {
      false;
      "NFErr_MC_StreamingFailure" === E.error && (B.Td.trace("receiving an unrecoverable streaming error: " + JSON.stringify(E)),
        B.Td.trace("StreamingFailure, buffer status:" + JSON.stringify(B.JB())),
        (0,
          g.gi)(function() {
            var G, F, H;
            G = f.ea.EYb;
            F = E.nativeCode;
            H = E.context;
            "adBreakHydration" === (null === H || undefined === H ? undefined : H.type) && (G = f.ea.qX,
              F = f.Y.PYb);
            B.j.Gg(G, {
                Ya: F,
                Cf: E.errormsg,
                Rq: E.httpCode,
                LI: E.networkErrorCode,
                Yg: E.httpCode
            });
      }));
  });
  z.addListener("logdata", function(E) {
      var G;
      false;
      "string" === typeof E.target && "object" === typeof E.fields && (E.fields.aseApiVersion = null === (G = B.ka) || undefined === G ? undefined : G.Sbc,
        (0,
          e.kPa)({
            ITa: E,
            Ys: D,
            loadTime: C
      }));
  });
  z.addListener("bufferingStarted", function() {
      false;
      B.j.ju.set(h.zh.Xf);
  });
  z.addListener("bufferingComplete", function(E) {
      false;
      B.pu = E;
  });
  this.j.paused.addListener(function(E) {
      var G;
      B.debug.assert(B.Td, "has access to internalLogger");
      null !== (G = E.sn) && undefined !== G && G.QB || !B.yK || (E.newValue && [p.Yb.Bg, p.Yb.aj].includes(B.Mh.value) ? (B.Mh.set(p.Yb.aj),
          B.mi.emit("paused", {
              type: "paused",
              yd: B.mi.Ld
        })) : E.newValue || B.Mh.value !== p.Yb.aj || (B.Mh.set(p.Yb.Bg),
          B.mi.emit("playing", {
              type: "playing",
              yd: B.mi.Ld
      })));
      E.newValue || (B.hU = false);
      B.Td.info("Paused changed", {
          From: E.oldValue,
          To: E.newValue,
          MediaTime: (0,
            q.zk)(B.j.mediaTime.value)
      });
  });
  this.j.oa.addListener([v.l.V, v.l.U, v.l.Ea], function(E) {
      var G, F, H, J, M, K, L;
      if (B.yK) {
        B.debug.assert(B.Td, "has access to internalLogger");
        L = E.bZ || E.Lia || E.M4 && B.j.Hc.Da;
        E.RQ || !L ? B.Td.trace("No tracks to process", {
            Cc: null === (G = E.UE) || undefined === G ? undefined : G.trackId,
            Mc: null === (F = E.qwa) || undefined === F ? undefined : F.trackId,
            xJ: null === (H = E.dv) || undefined === H ? undefined : H.trackId,
            RQ: E.RQ
        }) : (G = {},
          E.bZ && (G.ew = null === (J = E.UE) || undefined === J ? undefined : J.trackId),
          E.Lia && (G.eo = null === (M = E.qwa) || undefined === M ? undefined : M.trackId),
          E.M4 && B.j.Hc.Da && (G.Bz = null === (K = E.dv) || undefined === K ? undefined : K.trackId),
          B.z0c(G));
      }
  });
  z.addListener("serverSwitch", function(E) {
      var G;
      false;
      B.j.fireEvent(h.ja.Xga, E);
      if (E.mediatype === v.DT[v.l.V])
      G = v.l.V;
      else
      E.mediatype === v.DT[v.l.U] ? G = v.l.U : E.mediatype === v.DT[v.l.Ea] && (G = v.l.Ea);
      (0,
        l.gd)(G) && B.cha(E.segmentId, E.server, G);
  });
  z.addListener("streamSelected", function(E) {
      var G, F, H, J;
      false;
      if (B.J8) {
        F = E.manifest.de;
        if (!B.j.mBc(F) && B.config.Isc)
        return B.j.Gg(f.ea.o2b, {
            Xaa: F
        });
        F = (null === (G = B.ka) || undefined === G ? undefined : G.Rs(E.position)).Ga.G;
        G = [];
        if (E.mediaType === v.l.U) {
          H = B.j.yEb(E.streamId);
          J = B.j.ig;
          G = B.j.fM();
        } else
        E.mediaType === v.l.V && (H = B.j.cEb(E.streamId),
          J = B.j.qj,
          G = B.j.hvc());
        H && J ? (false,
          J.set(H, {
              jR: F,
              g$: E.bandwidth
        })) : E.mediaType !== v.l.Ea && B.Td.error("no matching stream for streamSelected event", {
            streamId: E.streamId,
            mediaType: E.mediaType,
            streamList: G,
            cachedManifest: B.j.gR
        });
      }
  });
  z.addListener("segmentNormalized", function(E) {
      var G, F, H, J, M;
      false;
      G = E.segmentId;
      F = Math.floor(E.viewableContentEnd.G);
      E = Math.floor(E.viewableEarliestContentEnd.G);
      F = (0,
        m.pc)(F);
      E = (0,
        m.pc)(E);
      B.ei && B.ei.ba[G] && (H = B.ei.ba[G]);
      J = B.j.rEb(G);
      M = H && B.j.Aca(H.J);
      J ? M && B.j.HYa() && (J = B.j.bk(H.J),
        J.M === "placeholder-segmentId-" + H.J && (false,
          J.M = G)) : (false,
        B.Rkc(G));
      if (H = B.j.mm(G))
      (B.debug.assert(H.M === G, "segmentNormalized: playbackViewableData segmentId should match the value in the event. playbackViewableData.segmentId: " + (H.M + " event.segmentId: ") + (G + " ")),
        H.vH = F,
        H.AJb = E);
      B.j.mt || (B.j.Hc.Da && Infinity === F.na(m.Ba) ? B.j.mt = m.ia : B.j.mt = F);
      G = B.j.mt.na(m.Ba);
      H = F.na(m.Ba);
      B.j.Hc.Da && Infinity !== H && H > G && (false,
        B.j.mt = F);
  });
  z.addListener("locationSelected", function(E) {
      false;
      B.j.fireEvent(h.ja.Pda, E);
  });
  z.addListener("aseReportEnabled", function() {
      false;
      B.j.A_ = true;
  });
  z.addListener("logblob", function(E) {
      false;
      B.j.fireEvent(h.ja.ZY, E);
  });
  z.addListener("mediaRequestComplete", function(E) {
      E = null === E || undefined === E ? undefined : E.uUc;
      (E = null === E || undefined === E ? undefined : E.cadmiumResponse) && B.j.fireEvent(h.ja.HR, {
          response: E,
          R: B.j.ga.R
      });
  });
  z.addListener("transportReport", function(E) {
      var G;
      (E = null === (G = E.Wrc) || undefined === G ? undefined : G.cadmiumResponse) && B.j.fireEvent(h.ja.HR, {
          response: E,
          R: B.j.ga.R
      });
  });
  z.addListener("liveEventTimesUpdated", function(E) {
      var G, F;
      G = E.M;
      F = E.startTime;
      E = E.endTime;
      B.j.rEb(G) && (G = B.j.mm(G),
        G.Hc.Da && G.Hc.A5a(F, E));
  });
  z.addListener("liveLoggingInfoUpdated", function(E) {
      var G, F, H;
      G = E.mediaType;
      E = E.info;
      F = B.EB[G];
      B.EB[G] = E;
      H = B.EB[G].Bo !== F.Bo && undefined !== F.Bo;
      (B.EB[G].Ao !== F.Ao && undefined !== F.Ao || H) && B.j.fireEvent(h.ja.ava, {
          mediaType: G,
          vr: F,
          current: B.EB[G],
          Nza: E.Nza,
          ob: E.ob
      });
  });
  z.addListener("livePostplayUpdated", function(E) {
      B.j.fireEvent(h.ja.iIb, {
          J: E.J,
          Bfa: E.Bfa,
          action: E.action
      });
  });
  z.addListener("chaptersUpdated", function(E) {
      B.j.fireEvent(h.ja.jpa, {
          J: E.J
      });
  });
  z.addListener("seeked", function(E) {
      B.a3 = E.position;
  });
  this.Rsb();
}
;
/* method: d.Rsb() */ d.prototype.Rsb = function() {
  var z, B;
  z = this;
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  B = this.Mb.events;
  B.addListener("logdata", function(C) {
      false;
      "string" === typeof C.target && "object" === typeof C.fields && (0,
        e.kPa)({
          ITa: C,
          Ys: z.Ys,
          loadTime: z.loadTime
      });
  });
  B.addListener("segmentPresenting", function(C) {
      var D, E, G, F;
      false;
      z.debug.assert(z.ka, "has access to asePlaygraph");
      z.debug.assert(z.Mb, "has access to asePlayer");
      z.debug.assert(z.hV, "has access to segmentPresentingHandler");
      E = z.ka.Rs(C.position);
      G = undefined;
      F = null === (D = C.inner) || undefined === D ? undefined : D.position;
      F && z.ei && (G = z.ei.ba[F.M]);
      z.rb.j1() && (z.rb.Li = C.position.M);
      z.hV({
          J: E.J,
          mR: G,
          XS: false,
          Xe: C.programId
      });
      D = C.metrics;
      z.Oxa && D && (E = D.segment,
        D.srcsegment !== z.Oxa.Aba.M || E !== z.Oxa.aia.M || "seamless" !== D.transitionType && "perfect" !== D.transitionType || (D.transitionType = "long",
          z.Oxa = undefined));
      z.j.fireEvent(h.ja.iO, {
          type: "segmentPresenting",
          position: {
            segmentId: C.position.M,
            offset: C.position.offset
          },
          playerTimestamp: C.playerTimestamp,
          metrics: C.metrics
      });
      false;
      z.Sob = z.Mb.Gu();
  });
  B.addListener("ptsChanged", function(C) {
      var D, E;
      false;
      z.debug.assert(z.ka, "has access to asePlaygraph");
      z.a3 || false;
      E = null !== (D = z.a3) && undefined !== D ? D : z.ka.Pn(C.initialTimestamp);
      z.a3 = undefined;
      D = z.ka.eB(E);
      E = z.UDb(E);
      E = {
        L0c: null === D || undefined === D ? undefined : D.$B,
        oFb: C.initialTimestamp.$B,
        em: E
      };
      false;
      z.j.ae.aSc(E);
      C.inNonSeamlessTransition ? z.mi.emit("clockAdjusted", {
          type: "clockAdjusted",
          yd: z.mi.Ld
      }) : z.mi.emit("skipped", {
          type: "skipped",
          yd: z.mi.Ld
      });
  });
  B.addListener("fragmentsMissing", function(C) {
      var D, E;
      E = null === (D = z.ka) || undefined === D ? undefined : D.Rs(C.nextAvailableGraphPosition);
      z.j.ae.seek(E.Ga.G, h.Tc.q6, C.nextAvailableGraphPosition.M);
  });
}
;
/* method: d.gE(z) */ d.prototype.gE = function(z) {
  var B, C;
  return null !== (C = null === (B = this.ka) || undefined === B ? undefined : B.gE(z)) && undefined !== C ? C : [];
}
;
/* method: d.Rkc(z) */ d.prototype.Rkc = function(z) {
  var B, C, D, E;
  if (this.ei && this.ei.ba[z]) {
    B = this.ei.ba[z];
    z = this.j.p_a;
    C = z.S;
    if (null === C || undefined === C ? 0 : C.Gq)
    D = null === C || undefined === C ? undefined : C.Gq.find(function(G) {
        return G.Aa.R === B.J;
    });
    D || (D = this.j.eCb(B.J));
    if (!D && (null === C || undefined === C ? 0 : C.Aa.Kb)) {
      E = this.wcc.Dyc({
          Kb: null === C || undefined === C ? undefined : C.Aa.Kb,
          jd: z.R,
          J: B.J
      });
      E && (D = E.S);
    }
    D && D.Aa.Kb === (null === C || undefined === C ? undefined : C.Aa.Kb) && this.j.Yvb(B.J, {
        Mf: {
          Kb: D.Aa.Kb,
          jd: z.R
        }
      }, z.Ia, D);
  }
}
;
/* method: d.Gu() */ d.prototype.Gu = function() {
  var z, B, C, D, E, G, F, H, J;
  H = null === (z = this.Mb) || undefined === z ? undefined : z.ita();
  z = (null !== (B = this.Sob) && undefined !== B ? B : H && this.Mb.Gu()) || ({});
  B = z.K;
  H = z.Qd;
  J = z.tU;
  z = z.bx;
  return {
    id: String(null === B || undefined === B ? undefined : B.id),
    IPa: null !== (C = null === H || undefined === H ? undefined : H.G) && undefined !== C ? C : 0,
    Ipa: null !== (D = null === B || undefined === B ? undefined : B.nb.G) && undefined !== D ? D : Infinity,
    Vic: null !== (E = null === B || undefined === B ? undefined : B.$b.G) && undefined !== E ? E : 0,
    BPc: null !== (G = null === J || undefined === J ? undefined : J.G) && undefined !== G ? G : Infinity,
    B2a: null !== (F = null === z || undefined === z ? undefined : z.G) && undefined !== F ? F : 0
  };
}
;
/* method: d.IFb() */ d.prototype.IFb = function() {
  var z, B;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  z = {};
  B = this.ka.XL();
  z.vbuflmsec = B.totalvbuflmsecs;
  z.vbuflbytes = B.vbuflbytes;
  z.abuflmsec = B.totalabuflmsecs;
  z.abuflbytes = B.abuflbytes;
  z.tbuflmsec = B.totaltbuflmsecs;
  z.tbuflbytes = B.tbuflbytes;
  return z;
}
;
/* method: d.paused() */ d.prototype.paused = function() {}
;
/* method: d.vPc() */ d.prototype.vPc = function() {
  false;
  this.mi.emit("playbackRateChanged", {
      type: "playbackRateChanged",
      yd: this.mi.Ld
  });
}
;
/* method: d.iu(z, B) */ d.prototype.iu = function(z, B) {
  var C;
  this.debug.assert(this.j.S, "has access to playback manifest");
  this.debug.assert(this.bsb, "has access to ASE utils");
  C = this.$V[v.l.V];
  return z.R === this.j.S.Aa.R ? C : this.bsb.ptc(this.j.S.Aa.kn[C], B);
}
;
/* method: d.zC(z, B) */ d.prototype.zC = function(z, B) {
  this.debug.assert(this.j.S, "has access to playback manifest");
  if (this.j.Hc.Da && (z = this.$V[v.l.Ea],
      (B = B[z]) && (!B.Jy || B.mda)))
  return z;
}
;
/* method: d.n8a(z, B, C) */ d.prototype.n8a = function(z, B, C) {
  var D;
  this.debug.assert(this.Td, "has access to internalLogger");
  z = this.$V[z];
  undefined === B ? D = z : C.some(function(E, G) {
      if (E.new_track_id === B)
      return (D = G,
        true);
  }) || this.Td.error("switchTracks, trackId not found:", B);
  return D;
}
;
/* method: d.z0c(z) */ d.prototype.z0c = function(z) {
  var B, C, D;
  this.debug.assert(this.Td, "has access to internalLogger");
  this.debug.assert(this.Mb, "has access to asePlayer");
  this.debug.assert(this.j.S, "has access to playback manifest");
  this.G7a && false;
  C = this.n8a(v.l.V, z.ew, this.j.S.Aa.audio_tracks);
  D = this.n8a(v.l.Ea, z.Bz, this.j.S.Aa.timedtexttracks);
  z = this.n8a(v.l.U, z.eo, this.j.S.Aa.video_tracks);
  false;
  this.e9 = C;
  this.f9 = D;
  this.g9 = z;
  null === (B = this.j.ae) || undefined === B ? undefined : B.f_c();
  this.j.paused.value || (this.Mb.pause([v.l.V, v.l.Ea, v.l.U]),
    this.hU = true,
    this.j.paused.set(true, {
        QB: true
  }));
  this.debug.S9(this.e9, "has access to valid requestedAudioTrackIndex number");
  this.$V[v.l.V] = this.e9;
  this.debug.S9(this.f9, "has access to valid requestedTextTrackIndex number");
  this.$V[v.l.Ea] = this.f9;
  this.debug.S9(this.g9, "has access to valid requestedVideoTrackIndex number");
  this.$V[v.l.U] = this.g9;
  (this.zt() || this.hU) && this.Mb.resume(this.hU ? [v.l.V, v.l.Ea, v.l.U] : undefined);
  this.TO(this.vVb);
}
;
/* method: d.zt() */ d.prototype.zt = function() {
  var z;
  z = this;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  return this.ka.zt({
      kV: this.iu.bind(this)
    }, {
      kV: function() {
        return z.$V[v.l.U];
      }
    }, {
      kV: this.zC.bind(this)
  });
}
;
/* method: d.Ayc() */ d.prototype.Ayc = function() {
  var z, B;
  z = this;
  if (!this.kza) {
    B = {
      type: "playbackEnding",
      cancel: function() {
        z.kza = true;
      }
    };
    this.mi.emit(B.type, B);
  }
  B = this.kza;
  this.kza = false;
  return B;
}
;
/* method: d.Mr() */ d.prototype.Mr = function() {
  var z;
  false;
  this.Mh.set(p.Yb.Qm);
  null === (z = this.ka) || undefined === z ? undefined : z.S7a("intrplay", p.Sc.Mr);
  this.mi.emit("underflow", {
      type: "underflow",
      yd: this.mi.Ld
  });
  this.TO(this.ln);
}
;
/* method: d.fAa(z, B) */ d.prototype.fAa = function(z, B) {
  this.IBa.fAa(z, B);
}
;
/* method: d.open() */ d.prototype.open = function() {
  var z, B;
  if (!this.J8) {
    this.debug.assert(this.ka, "has access to asePlaygraph");
    this.debug.assert(this.Mb, "has access to asePlayer");
    false;
    this.J8 = this.Ck = true;
    this.ka.open();
    this.debug.assert(this.uC, "invalid start position relative to playgraph");
    this.a3 = this.uC;
    this.ka.gO(this.uC);
    this.Mh.set(p.Yb.Xf);
    this.TO(this.ln);
    this.ka.zA(this.Mb);
    this.XHb();
    B = null === (z = this.lm()) || undefined === z ? undefined : z.sr.Gw();
    z = this.j.ga.R.toString();
    (null === B || undefined === B ? 0 : B.result[z]) && this.events.emit("adMetadataUpdated");
  }
}
;
/* method: d.play() */ d.prototype.play = function() {
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  0 !== this.ka.state && (this.Mb.resume(this.hU ? [v.l.V, v.l.Ea] : undefined),
    this.Mh.set(p.Yb.Bg),
    this.mi.emit("playing", {
        type: "playing",
        yd: this.mi.Ld
  }));
}
;
/* method: d.stop() */ d.prototype.stop = function() {
  var z;
  false;
  this.Mh.set(p.Yb.Xla);
  null === (z = this.Mb) || undefined === z ? undefined : z.pause();
  this.events.emit("stop");
  this.mi.emit("paused", {
      type: "paused",
      yd: this.mi.Ld
  });
}
;
/* method: d.flush() */ d.prototype.flush = function() {
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.qk, "has access to streamingEngine");
  false;
  this.J8 && this.Mh.value !== p.Yb.Wt && this.Mh.value !== p.Yb.Xla && this.stop();
  this.ka.S7a("endplay", p.Sc.Wj);
  this.ka.Tg();
  this.qk.qm.save();
  this.qk.mN.save();
}
;
/* method: d.lm() */ d.prototype.lm = function() {
  var z;
  return null === (z = this.ka) || undefined === z ? undefined : z.Dc;
}
;
/* method: d.UDb(z) */ d.prototype.UDb = function(z) {
  this.debug.assert(this.ka, "has access to asePlaygraph");
  return this.ka.Z.ba[z.M].Va + Number(z.offset.G.toFixed(0));
}
;
/* method: d.kRa(z) */ d.prototype.kRa = function(z) {
  var B;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  B = p.I.Ca(z);
  return (B = this.ka.Pn(B, {
        rZc: true,
        qZc: true
  })) ? this.UDb(B) : this.fail("convertPlayerPtsToContentPts failed to convert playerPts: " + z);
}
;
/* method: d.mRa(z, B) */ d.prototype.mRa = function(z, B) {
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Td, "has access to internalLogger");
  false;
  this.ka.Z.ba[z] || (z = this.$Ta(B));
  this.debug.soa(z, "has access to segmentId");
  z = {
    M: z,
    offset: p.I.Ca(B - this.ka.Z.ba[z].Va)
  };
  if (z = this.ka.eB(z))
  return z.G;
  false;
  return B;
}
;
/* method: d.Atc(z, B) */ d.prototype.Atc = function(z, B) {
  var C, D, E;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  B && this.ka.Z.ba[B] || (B = null !== (C = this.$Ta(z)) && undefined !== C ? C : null === (D = this.Mb) || undefined === D ? undefined : D.Wg.M);
  B = this.j.mm(B);
  z = {
    Ga: p.I.Ca(z),
    J: B.R
  };
  return null === (E = this.ka.mAb(z)) || undefined === E ? undefined : E.Ga.G;
}
;
/* method: d.Faa(z) */ d.prototype.Faa = function(z) {
  var B;
  B = undefined === B ? true : B;
  false;
  if (!this.Ck)
  return this.fail("Must call open prior to drmReady");
  Number.isFinite(z) && (this.debug.assert(this.Mb, "has access to asePlayer"),
    B ? this.Mb.kSb(z) : this.Mb.jSb(z));
}
;
/* method: d.mEb() */ d.prototype.mEb = function() {
  var z;
  return null !== (z = this.Mb) && undefined !== z && z.Sd ? this.Mb.gda(this.rb.ga.J) : false;
}
;
/* method: d.vl(z) */ d.prototype.vl = function(z) {
  var B, C, D;
  false;
  if (!this.Mb)
  return (false,
    false);
  z = p.I.Ca(z);
  D = null !== (C = null === (B = this.lm()) || undefined === B ? undefined : B.vl(z)) && undefined !== C ? C : true;
  return this.Mb.vl(z) && D;
}
;
/* method: d.gWc(z, B) */ d.prototype.gWc = function(z, B) {
  var C;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  B && this.ka.Z.ba[B] || (B = null !== (C = this.$Ta(z)) && undefined !== C ? C : this.rb.Li);
  this.debug.soa(B, "has access to segmentId");
  this.debug.assert(this.ka.Z.ba[B], "segment exists in playgraph map");
  this.a3 = z = {
    M: B,
    offset: p.I.Ca(z - this.ka.Z.ba[B].Va)
  };
  this.ka.gO(z);
  this.Mb.resume();
  this.Mh.set(p.Yb.Xf);
  this.TO(this.ln);
  z = this.ka.kRb(z);
  this.debug.assert(z, "Valid position must be provided for seek");
}
;
/* method: d.addEventListener(z, B) */ d.prototype.addEventListener = function(z, B) {
  this.events.addListener(z, B);
  return this;
}
;
/* method: d.removeEventListener(z, B) */ d.prototype.removeEventListener = function(z, B) {
  this.events.removeListener(z, B);
  return this;
}
;
/* method: d.M2c(z, B) */ d.prototype.M2c = function(z, B) {
  var C;
  false;
  C = {};
  this.ka.Pl((C[z] = B,
      C));
}
;
/* method: d.mpa(z, B) */ d.prototype.mpa = function(z, B) {
  var C, D;
  this.debug.assert(this.Td, "has access to internalLogger");
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Mb, "has access to asePlayer");
  false;
  C = this.Gu().id;
  D = this.ka.dca(C, z);
  if (B) {
    if (!D.O3c)
    return (this.Td.warn("chooseNextSegment, seamless transition, invalid destination: " + (z + " for current segment: " + C)),
      false);
    if (undefined !== D.v0a && (false,
        D.v0a !== z))
    return false;
    this.ka.Wn(C, z, false, B);
    return true;
  }
  if (undefined !== D.v0a)
  return (false,
    false);
  D.r$ && (this.Mb.reset(),
    this.a3 = {
      M: z,
      offset: p.I.Ca(0)
    },
    this.ka.Wn(C, z, false, B),
    this.Mb.resume(),
    this.Mh.set(p.Yb.Xf),
    this.TO(this.ln));
  return !!D.r$;
}
;
/* method: d.Wn(z, B, C, D) */ d.prototype.Wn = function(z, B, C, D) {
  this.debug.assert(this.ka, "has access to asePlaygraph");
  false;
  this.ka.Wn(z, B, C, D);
}
;
/* method: d.rO() */ d.prototype.rO = function() {
  var z;
  this.debug.assert(this.Td, "has access to internalLogger");
  false;
  z = this.mi.Ld;
  false;
  this.mi.emit("skipped", {
      type: "skipped",
      yd: z
  });
  return new p.p8(Promise.resolve()).iVc;
}
;
/* method: d.xsa(z, B) */ d.prototype.xsa = function(z, B) {
  var C;
  return null === (C = this.ka) || undefined === C ? undefined : C.xsa(z, B);
}
;
/* method: d.hWa() */ d.prototype.hWa = function() {
  var z;
  return null === (z = this.ka) || undefined === z ? undefined : z.hWa();
}
;
d.prototype.$Ta = function(z) {
  var B, C, D, E, G, F, H, J;
  this.debug.assert(this.ka, "has access to asePlaygraph");
  this.debug.assert(this.Td, "has access to internalLogger");
  false;
  B = this.ka.Z;
  C = [];
  D = Infinity;
  for (E in B.ba) {
    G = B.ba[E];
    F = G.Va;
    G = G.eb;
    H = z < Number(null !== G && undefined !== G ? G : Infinity);
    if (F <= z && H)
    (false,
      C.push(E));
    else if ((F = Math.min(Math.abs(z - F), Math.abs(z - G)),
        F < D)) {
      D = F;
      J = E;
    }
  }
  z = C[0] || J;
  this.debug.soa(z, "has access to locatedSegmentId");
  false;
  return z;
}
;
/* method: d.XHb() */ d.prototype.XHb = function() {
  var z, B;
  z = this;
  this.debug.assert(this.j.jc, "has access to mediaElement");
  B = this.j.jc.Ja;
  this.debug.assert(B, "has access to videoElement");
  B.addEventListener("play", function() {
      z.Mh.value === p.Yb.aj && (z.Mh.set(p.Yb.Bg),
        z.mi.emit("playing", {
            type: "playing",
            yd: z.mi.Ld
      }));
  });
  B.addEventListener("pause", function() {
      z.Mh.value === p.Yb.Bg && (z.Mh.set(p.Yb.aj),
        z.mi.emit("paused", {
            type: "paused",
            yd: z.mi.Ld
      }));
  });
}
;
/* method: d.fail(z) */ d.prototype.fail = function(z) {
  var B;
  null === (B = this.ka) || undefined === B ? undefined : B.events.emit("error", {
      type: "error",
      error: "NFErr_MC_StreamingFailure",
      errormsg: z
  });
}
;
/* method: d.TO(z) */ d.prototype.TO = function(z) {
  var B, C, D, E, G, F, H, J;
  B = this;
  if (z !== this.vVb && this.G7a)
  (false,
    this.hMb = z);
  else {
    J = null === (C = this.Mb) || undefined === C ? undefined : C.Np.value;
    C = null === (D = this.ka) || undefined === D ? undefined : D.se.value;
    D = true === J;
    J = C === p.Yd.uq;
    false;
    null === (E = this.Mb) || undefined === E ? undefined : E.Np.removeListener(this.KJb);
    null === (G = this.ka) || undefined === G ? undefined : G.se.removeListener(this.ftb);
    D && J ? z() : (this.KJb = function() {
        return B.TO(z);
      }
      ,
      this.ftb = function() {
        return B.TO(z);
      }
      ,
      null === (F = this.Mb) || undefined === F ? undefined : F.Np.addListener(this.KJb),
      null === (H = this.ka) || undefined === H ? undefined : H.se.addListener(this.ftb));
  }
}
;
/* method: d.jBb(z) */ d.prototype.jBb = function(z) {
  var B, C;
  B = this;
  z = this.j.bk(z);
  return Promise.resolve(null !== (C = z.S) && undefined !== C ? C : this.Jya(z)).then(function(D) {
      var E, G;
      D = D.Aa;
      return {
        S: D,
        MD: D.ata && !D.iM,
        config: B.tl,
        Uh: [].concat(Ba(B.Uh)),
        Le: null !== (G = null === (E = B.ka) || undefined === E ? undefined : E.id) && undefined !== G ? G : -1
      };
  });
}
;
/* method: d.Jya(z) */ d.prototype.Jya = function(z) {
  var B, C, D, E, G;
  B = this;
  false;
  E = Promise.resolve();
  if (null === (C = z.ze) || undefined === C ? 0 : C.jd) {
    C = z.ze.jd;
    (G = null === (D = this.j.bk(C).S) || undefined === D ? undefined : D.Aa) ? z.ze.jfa = G : E = this.He.Ns(C).vv.then(function(F) {
        return F.S;
    }).then(function(F) {
        z.ze.jfa = F;
    }).catch(function() {
        return B.j.Gg(f.ea.qX, f.Y.QYb);
    });
  }
  return E.then(function() {
      return B.j.Jya(z);
  }).then(function() {
      return z.S;
  }).catch(function(F) {
      var H;
      throw new p.bD("Failed to request manifest",{
          Cd: 0,
          KAa: 0,
          errorCode: null !== (H = F.code) && undefined !== H ? H : 0,
          context: {
            error: F instanceof y.we ? F.toJSON() : F,
            type: "manifest"
          }
      });
  });
}
;
/* method: d.UD(z, B, C) */ d.prototype.UD = function(z, B, C) {
  var D, E, G, F, H, J, M, K, L, O, I, N, Q;
  D = this;
  this.debug.assert(this.qk, "has access to streamingEngine");
  false;
  L = {
    J: z,
    jd: null === (E = null === B || undefined === B ? undefined : B.Mf) || undefined === E ? undefined : E.jd,
    Kb: null === (G = null === B || undefined === B ? undefined : B.Mf) || undefined === G ? undefined : G.Kb
  };
  if (!this.He.has(L)) {
    if (!this.j.Aca(z) && (null === (F = null === B || undefined === B ? undefined : B.Mf) || undefined === F ? 0 : F.jd) && this.j.Aca(null === (H = null === B || undefined === B ? undefined : B.Mf) || undefined === H ? undefined : H.jd)) {
      E = this.j.bk(null === (J = B.Mf) || undefined === J ? undefined : J.jd);
      J = null === (M = E.S) || undefined === M ? undefined : M.Aa.Kb;
      M = this.j.eCb(z);
      (null === (K = null === M || undefined === M ? undefined : M.Aa) || undefined === K ? 0 : K.Kb) && M.Aa.Kb === J && (O = M);
      this.j.Yvb(z, B, E.Ia, O);
    }
    this.j.Aca(z) && (I = this.j.bk(z));
    N = C ? C.Ia : I ? I.Ia : undefined;
    K = C ? C.Sf : I ? I.correlationId : undefined;
    this.He.store(L, {
        yZ: function() {},
        equals: function(S) {
          return S && S.J === L.J && (N === S.Ia || !S.Ia || !N);
        },
        get vv() {
          Q || (Q = D.jBb(z));
          return Q;
        },
        set vv(S) {
          Q = S;
        },
        events: new c.EventEmitter(),
        Ia: N,
        J: L.J,
        ty: false,
        QAa: false
    });
    this.tl.TR && this.qk.bAa(this.He.Ns(L.J, B), {
        Ia: N,
        Sf: K,
        s_: null === C || undefined === C ? undefined : C.KL
    });
  }
}
;
/* method: d.g5(z) */ d.prototype.g5 = function(z) {
  var B, C, D;
  this.debug.assert(this.qk, "has access to streamingEngine");
  false;
  B = this.j.mm(z);
  C = B.ze;
  z = this.rb.Hu(z).J;
  if (!this.He.has({
        J: B.R,
        jd: null === C || undefined === C ? undefined : C.jd,
        Kb: null === C || undefined === C ? undefined : C.Kb
  }))
  return Promise.resolve();
  C && (D = {
      Mf: {
        Kb: null === C || undefined === C ? undefined : C.Kb,
        jd: C.jd
      }
  });
  B = this.He.Ns(z, D);
  B.vv = this.jBb(z);
  return this.qk.g5(B);
}
;
/* method: d.dca(z) */ d.prototype.dca = function(z) {
  var B;
  this.debug.assert(this.Mb, "has access to asePlayer");
  this.debug.assert(this.ka, "has access to asePlaygraph");
  return this.ka.dca(null === (B = this.Mb.Gu().K) || undefined === B ? undefined : B.id, z);
}
;
/* method: d.Cn(z) */ d.prototype.Cn = function(z) {
  var B;
  z = null === (B = this.ka) || undefined === B ? undefined : B.Cn(z);
  false;
  return z;
}
;
/* method: d.NDb(z) */ d.prototype.NDb = function(z) {
  return this.tl.qy || "LINEAR" === z.S.Aa.rf && this.tl.F_;
}
;
/* method: d.PCc(z) */ d.prototype.PCc = function(z) {
  var B, C, D;
  B = z.uR;
  C = z.M;
  this.debug.assert(this.qk, "has access to streamingEngine");
  this.debug.assert(this.Td, "has access to internalLogger");
  false;
  D = this.j.mm(C);
  z = this.rb.BS(D);
  C = z.ba[C];
  this.debug.assert(C, "segment exists");
  this.uC = (0,
    n.vzc)(C.J, z, this.j.Nb, C.Va);
  B = Object.create(this.tl, {
      KL: {
        value: B.KL
      },
      J_: {
        value: this.j.background.value
      },
      qy: {
        value: this.NDb(D)
      }
  });
  this.Mh = new r.Ac(p.Yb.Ul);
  this.ka = this.qk.G9(z, this.tl.JPc, B, this.He);
  this.IBa = new p.u8(this.Td);
  B = this.ka.$$(this.IBa);
  z = this.ka.Z$();
  this.ka.L5a(z, B);
  this.zt();
  this.hU = false;
}
;
/* method: d.TZ() */ d.prototype.TZ = function() {
  var z, B, C;
  z = this;
  this.debug.assert(this.qk, "has access to streamingEngine");
  this.debug.assert(this.j.S, "has access to playback manifest");
  false;
  C = null === (B = this.j.S) || undefined === B ? undefined : B.Aa;
  B = undefined !== this.zC(C, C.Kt);
  C = [].concat(Ba(this.Uh));
  B && C.push(v.l.Ea);
  B = Object.create(this.tl, {
      Uh: {
        value: C
      },
      VVa: {
        value: function() {
          return z.jyc();
        }
      },
      qy: {
        value: this.NDb(this.j)
      }
  });
  this.mi = this.kyc();
  this.Mb = this.qk.Qac(this.mi, B);
}
;
/* method: d.kyc() */ d.prototype.kyc = function() {
  var z, B;
  z = this;
  if (this.mi)
  return this.mi;
  B = Object.create(new c.EventEmitter(), {
      al: {
        get: function() {
          return z.j.lk.na(m.Ba);
        }
      },
      Ld: {
        get: function() {
          z.debug.S9(z.j.mediaTime.value, "has access to mediaTime.value");
          return p.I.Ca(z.j.mediaTime.value);
        }
      },
      playbackRate: {
        get: function() {
          return Math.max(z.j.playbackRate.value, .01);
        }
      },
      Kxc: {
        value: function() {
          z.debug.assert(z.j.jc, "has access to mediaElement");
          return z.j.jc;
        }
      },
      o4a: {
        value: function() {
          z.j.Hc.W3();
        }
      }
  });
  this.config.Vqc && (this.debug.assert(this.Td, "has access to internalLogger"),
    this.HQb = new w.Okb(this.j,this.config,this.Td),
    Object.defineProperties(B, {
        qu: {
          value: function(C) {
            var D;
            D = z.HQb.qu(C);
            D.qu || (z.Oxa = {
                Aba: C.Aba,
                aia: C.aia
            });
            return D;
          }
        },
        kd: {
          value: function(C, D) {
            return z.HQb.kd(C, D);
          }
        }
  }));
  return B;
}
;
/* method: d.fVc() */ d.prototype.fVc = function() {
  var z;
  z = this;
  return new Promise(function(B) {
      z.XHb();
      z.qoc();
      z.TZ();
      z.debug.assert(z.Mb, "asePlayer should have been re-created");
      z.Rsb();
      z.ka.zA(z.Mb);
      z.play();
      z.Mh.set(p.Yb.Xf);
      z.TO(function() {
          z.j.paused.value && z.j.paused.set(false, {
              QB: true
          });
          z.ln();
          false;
          B();
      });
    }
  );
}
;
/* method: d.qoc() */ d.prototype.qoc = function() {
  var z;
  null === (z = this.ka) || undefined === z ? undefined : z.roc();
  this.qk.V3a(this.Mb);
  this.li = this.Mb = undefined;
}
;
/* method: d.jyc() */ d.prototype.jyc = function() {
  this.li || (this.li = new p.platform.MediaSource(this.mi),
    this.li.Fg || (this.li.Fg = p.platform.MediaSource.Fg));
  return this.li;
}
;
Ha.Object.defineProperties(d.prototype, {
    G7a: {
      configurable: true,
      enumerable: true,
      get: function() {
        return undefined !== this.e9 && undefined !== this.f9 && undefined !== this.g9;
      }
    },
    $c: {
      configurable: true,
      enumerable: true,
      get: function() {
        this.debug.assert(this.qk, "has access to streamingEngine");
        return this.qk.$c;
      }
    },
    ei: {
      configurable: true,
      enumerable: true,
      get: function() {
        for (var z, B = null === (z = this.ka) || undefined === z ? undefined : z.ei; null === B || undefined === B ? 0 : B.ei; )
        B = B.ei;
        return null === B || undefined === B ? undefined : B.Z;
      }
    },
    OQa: {
      configurable: true,
      enumerable: true,
      get: function() {
        for (var z = this.Mb; null === z || undefined === z ? 0 : z.Xca; )
        z = z.Xca;
        return z;
      }
    },
    Bwb: {
      configurable: true,
      enumerable: true,
      get: function() {
        var z, B, C;
        if (null === (z = this.OQa) || undefined === z ? 0 : z.Sd) {
          C = (z = this.OQa.Wg) && (null === (B = this.ei) || undefined === B ? undefined : B.ba[z.M]);
          if (C)
          return {
            Ga: p.I.Ca(z.offset.G + C.Va),
            J: C.J
          };
        }
      }
    },
    Qmc: {
      configurable: true,
      enumerable: true,
      get: function() {
        var z, B;
        return null !== (B = null === (z = this.OQa) || undefined === z ? undefined : z.bb.map(function(C) {
              return C.K.id;
        })) && undefined !== B ? B : [];
      }
    },
    atb: {
      configurable: true,
      enumerable: true,
      get: function() {
        var z;
        return null === (z = this.Mb) || undefined === z ? undefined : z.eT.value.G;
      }
    }
});
export const YGa = d;

// Detected exports: YGa
