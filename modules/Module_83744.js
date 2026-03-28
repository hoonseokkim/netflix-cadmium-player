/**
 * Netflix Cadmium Playercore - Module 83744
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_83744
 * @description Error handling/reporting; Network/HTTP request handling; Event system; CDN/server URL management; Stream selection
 * @size 36,926 chars (raw), 18,661 chars (deobfuscated)
 * Original signature: function(t, b, a)
 *
 * @dependencies (9 imports)
 *   d <- Module 22970 (simple)
 *   p <- Module 90745 (simple)
 *   c <- Module 17267 (star)
 *   g <- Module 66164 (simple)
 *   f <- Module 91176 (simple)
 *   h <- Module 14282 (default)
 *   k <- Module 86429 (simple)
 *   l <- Module 94646 (simple)
 *   m <- Module 16131 (simple)
 *
 * @exports (1 exports)
 *   Ecb
 */

// Webpack module 83744
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;
// [__esModule declaration removed]
// b.Ecb = undefined; [pre-declaration]
import * as d from "./Module_22970"; // a(22970)
import * as p from "./Module_90745"; // a(90745)
import * as c from "./Module_17267"; // __importStar(a(17267))
import * as g from "./Module_66164"; // a(66164)
import * as f from "./Module_91176"; // a(91176)
e = new g.platform.Console("ASEJS_ERROR_DIRECTOR","asejs");
import h from "./Module_14282"; // __importDefault(a(14282))
import * as k from "./Module_86429"; // a(86429)
import * as l from "./Module_94646"; // a(94646)
import * as m from "./Module_16131"; // a(16131)
n = g.platform.Bi;
t = (function() {
    var L1E;
    function q(r, u, v, w, x, y) {
      var N0T;
      // NOTE: state machine (var=N0T, states 2..20)
      N0T = 2;
      for (; N0T !== 20; ) {
        switch (N0T) {
          case 2:
          this.gj = u;
          this.config = v;
          this.kXa = w;
          this.hM = x;
          this.b4 = y;
          N0T = 9;
          break;
          case 11:
          this.EZa = g.platform.time.fa();
          this.MN = new k.mkb(u,x,v);
          N0T = 20;
          break;
          case 6:
          var u$l = "issueServe";
          u$l += "rP";
          u$l += "robe";
          u$l += "R";
          u$l += "equest";
          var E2C = "n";
          E2C += "e";
          E2C += "two";
          E2C += "rkFai";
          E2C += "led";
          this.mub = new f.Y7();
          this.JH = r ? new m.xfb(v) : new l.YW(v);
          this.ek.addListener(this.gj, E2C, this.MAc.bind(this));
          this.ek.addListener(this.gj, u$l, this.UAc.bind(this));
          N0T = 11;
          break;
          case 9:
          var V00 = "1SIYb";
          V00 += "Z";
          V00 += "rNJCp9";
          this.events = new p.EventEmitter();
          this.ek = new p.sf();
          V00;
          N0T = 6;
          break;
        }
        // NOTE: state machine (var=L1E, states 2..6)
      }
    }
    L1E = 2;
    for (; L1E !== 6; ) {
      switch (L1E) {
        case 8:
        // NOTE: state machine (var=h0Z, states 2..7)
        /* method: q.ZIb(r, u) */ q.prototype.ZIb = function(r, u) {
          var h0Z, w, x, v;
          h0Z = 2;
          for (; h0Z !== 7; ) {
            switch (h0Z) {
              case 5:
              w = v.zVa(r.stream);
              h0Z = 4;
              break;
              // NOTE: state machine (var=n2i, states 2..1)
              case 3:
              x = v.Ksa(r.stream).map(function(y) {
                  var n2i;
                  n2i = 2;
                  for (; n2i !== 1; ) {
                    switch (n2i) {
                      case 2:
                      return {
                        url: r.url,
                        md: y.id,
                        Hb: y,
                        stream: w,
                        urls: y.urls,
                        M: r.ji
                      };
                      break;
                    }
                  }
              });
              h0Z = 9;
              break;
              case 1:
              h0Z = r ? 5 : 8;
              break;
              case 2:
              v = this.gj;
              h0Z = 1;
              break;
              case 4:
              this.RFc = r.ji;
              h0Z = 3;
              break;
              case 9:
              return x;
              // NOTE: state machine (var=c3r, states 2..1)
              break;
              case 8:
              u && (x = v.UWc(u.host, u.port).map(function(y) {
                    var c3r;
                    c3r = 2;
                    for (; c3r !== 1; ) {
                      switch (c3r) {
                        case 2:
                        return {
                          url: v.I0(y.url.url, y.url.stream.aZ),
                          md: y.Hb.id,
                          Hb: y.Hb,
                          stream: y.url.stream,
                          urls: y.Hb.urls
                        };
                        // NOTE: state machine (var=R_n, states 2..1)
                        break;
                      }
                    }
                }).filter(function(y) {
                    var R_n;
                    R_n = 2;
                    for (; R_n !== 1; ) {
                      switch (R_n) {
                        case 2:
                        return "" !== y.url;
                        break;
                      }
                    }
              }));
              h0Z = 9;
              break;
              // NOTE: state machine (var=G6V, states 2..5)
            }
          }
        }
        ;
        return q;
        break;
        case 3:
        /* method: q.H3() */ q.prototype.H3 = function() {
          // NOTE: state machine (var=o1G, states 2..1)
          var G6V, r;
          G6V = 2;
          for (; G6V !== 5; ) {
            switch (G6V) {
              case 2:
              r = this;
              this.mub.ioa || this.mub.fYb(function() {
                  var o1G;
                  o1G = 2;
                  for (; o1G !== 1; ) {
                    switch (o1G) {
                      case 2:
                      r.J3 || (r.gj.H3(),
                        r.JH.H3(),
                        r.hM());
                      o1G = 1;
                      break;
                      // NOTE: state machine (var=m4l, states 2..9)
                    }
                  }
              });
              G6V = 5;
              break;
            }
          }
        }
        ;
        /* method: q.LO(r) */ q.prototype.LO = function(r) {
          var m4l, u, v;
          m4l = 2;
          // NOTE: state machine (var=p6E, states 2..5)
          for (; m4l !== 9; ) {
            switch (m4l) {
              case 2:
              (u = this,
                v = this.config);
              this.EZa = Math.max(r.Aj || g.platform.time.fa(), this.EZa);
              v.YI && this.MN.LO(r);
              (r = this.ZIb(r)) && 0 < r.length && r.forEach(function(w) {
                  var p6E;
                  p6E = 2;
                  for (; p6E !== 5; ) {
                    switch (p6E) {
                      case 2:
                      u.JH.LO(w.md);
                      u.gj.LO(w.md);
                      p6E = 5;
                      break;
                    }
                  }
              });
              m4l = 3;
              break;
              case 3:
              var e_C = "updatingLa";
              e_C += "stS";
              e_C += "uccessEve";
              e_C += "nt";
              var m1m = "updatingL";
              m1m += "ast";
              m1m += "S";
              m1m += "uccessE";
              m1m += "vent";
              // NOTE: state machine (var=g97, states 2..5)
              this.events.emit(m1m, {
                  type: e_C
              });
              m4l = 9;
              break;
            }
          }
        }
        ;
        L1E = 8;
        break;
        case 2:
        /* method: q.La() */ q.prototype.La = function() {
          var g97;
          g97 = 2;
          // NOTE: state machine (var=W61, states 2..12)
          for (; g97 !== 5; ) {
            switch (g97) {
              case 2:
              this.ek.clear();
              this.MN.reset();
              // NOTE: state machine (var=Z1J, states 2..7)
              g97 = 5;
              break;
            }
          }
        }
        ;
        /* method: q.dJ(r, u, v, w, x) */ q.prototype.dJ = function(r, u, v, w, x) {
          // NOTE: state machine (var=d_B, states 2..5)
          var W61, D, H1Y, E, G, J8r, p3M, C0G, C, y, A, z, B;
          W61 = 2;
          for (; W61 !== 12; ) {
            switch (W61) {
              case 7:
              u = function(H) {
                var Z1J, V$S, J, M, K, L, O;
                Z1J = 2;
                for (; Z1J !== 7; ) {
                  switch (Z1J) {
                    case 4:
                    J.some(function(I) {
                        var d_B;
                        d_B = 2;
                        for (; d_B !== 5; ) {
                          switch (d_B) {
                            case 2:
                            B.dJ(L, O, I.url);
                            return L === h.default.xk.UP;
                            break;
                          }
                        }
                    });
                    Z1J = 3;
                    break;
                    case 1:
                    V$S = D.JH.WN(w, K);
                    Z1J = V$S === h.default.WW.ha ? 5 : 9;
                    break;
                    case 9:
                    Z1J = V$S === h.default.WW.pK ? 8 : 3;
                    break;
                    case 2:
                    (J = H.urls,
                      M = H.url,
                      K = H.md);
                    Z1J = 1;
                    break;
                    case 8:
                    D.MN.mRc(H, {
                        rrb: K,
                        oia: C,
                        Mk: v,
                        Zg: w,
                        Ezb: z,
                        dh: x
                    });
                    Z1J = 3;
                    break;
                    case 3:
                    var N9s = "e";
                    N9s += "r";
                    N9s += "r";
                    N9s += "o";
                    // NOTE: state machine (var=H1Y, states 2..3)
                    N9s += "r";
                    !D.b4 || 0 !== v && undefined !== v || D.b4(N9s, M);
                    Z1J = 7;
                    break;
                    case 5:
                    (L = C[0],
                      O = C[1]);
                    Z1J = 4;
                    break;
                  }
                }
              }
              ;
              D = this;
              try {
                H1Y = 2;
                for (; H1Y !== 3; ) {
                  switch (H1Y) {
                    case 7:
                    H1Y = +G.done ? 3 : 4;
                    break;
                    case 1:
                    H1Y = !G.done ? 5 : 3;
                    break;
                    case 6:
                    u(G.value);
                    H1Y = 5;
                    break;
                    case 4:
                    G = E.next();
                    H1Y = 1;
                    break;
                    case 5:
                    u(G.value);
                    H1Y = 4;
                    break;
                    case 2:
                    // NOTE: state machine (var=J8r, states 2..1)
                    (E = d.__values(r),
                      G = E.next());
                    H1Y = 1;
                    break;
                    // NOTE: state machine (var=p3M, states 2..1)
                    case 14:
                    G = E.next();
                    H1Y = 2;
                    break;
                  }
                }
              } catch (H) {
                var F;
                F = {
                  error: H
                };
              } finally {
                // NOTE: state machine (var=C0G, states 2..5)
                J8r = 2;
                for (; J8r !== 1; ) {
                  switch (J8r) {
                    case 2:
                    try {
                      p3M = 2;
                      for (; p3M !== 1; ) {
                        switch (p3M) {
                          case 2:
                          G && !G.done && (y = E.return) && y.call(E);
                          p3M = 1;
                          break;
                        }
                      }
                    } finally {
                      C0G = 2;
                      for (; C0G !== 5; ) {
                        switch (C0G) {
                          case 2:
                          C0G = F ? 1 : 5;
                          break;
                          case 1:
                          throw F.error;
                          C0G = 5;
                          break;
                        }
                      }
                    }
                    J8r = 1;
                    break;
                  }
                }
              }
              W61 = 12;
              break;
              case 4:
              C = this.JH.qVa(w) || l.YW.ug;
              W61 = 3;
              break;
              case 5:
              W61 = w && c.isArray(this.JH.qVa(w)) ? 4 : 13;
              break;
              case 2:
              var x_S = " ";
              x_S += "o";
              x_S += "n";
              x_S += " ";
              var d4f = " wi";
              d4f += "t";
              d4f += "h";
              d4f += " ";
              var P7e = " ";
              P7e += "o";
              P7e += "n ";
              var P5o = "F";
              P5o += "ai";
              P5o += "lu";
              P5o += "re ";
              (A = n.Rr.name,
                z = w ? A[w] : undefined,
                B = this.gj);
              e.warn(P5o.concat(z, P7e).concat(null === r || undefined === r ? undefined : r.url, d4f).concat(v, x_S).concat(JSON.stringify(r ? r : u)));
              W61 = 5;
              break;
              case 3:
              W61 = C !== l.YW.uta ? 9 : 12;
              break;
              case 13:
              var q9f = "Unmapped f";
              q9f += "ailure co";
              q9f += "de in JSASE error director : ";
              e.error(q9f.concat(w));
              W61 = 12;
              break;
              case 9:
              var t_l = "cri";
              t_l += "tic";
              t_l += "a";
              t_l += "lNetworkError";
              var I5m = "crit";
              I5m += "icalNetwork";
              I5m += "Err";
              I5m += "or";
              var p53 = "re";
              p53 += "qu";
              p53 += "e";
              p53 += "stErro";
              p53 += "r";
              var Y4d = "reque";
              Y4d += "s";
              Y4d += "tError";
              W61 = (this.KM = {
                  Mk: v,
                  Zg: w,
                  Ezb: z,
                  dh: x
                },
                this.events.emit(Y4d, {
                    type: p53,
                    Mk: v,
                    errorCode: w,
                    dh: x
                }),
                // NOTE: state machine (var=y8j, states 2..8)
                w && this.JH.EDc(w) && this.events.emit(I5m, {
                    type: t_l,
                    Zg: w
                }),
                r = this.ZIb(r, u),
                undefined === r) ? 8 : 7;
              break;
              case 8:
              var S76 = "Inv";
              S76 += "alid affected for ne";
              S76 += "t";
              S76 += "work failure";
              e.error(S76);
              W61 = 12;
              break;
            }
          }
        }
        ;
        /* method: q.MAc(r) */ q.prototype.MAc = function(r) {
          var y8j, y, A, z, u, v, w, x;
          y8j = 2;
          for (; y8j !== 8; ) {
            switch (y8j) {
              case 4:
              (y = this.KM.Zg,
                A = this.KM.Mk,
                z = this.KM.dh);
              y8j = 3;
              break;
              case 5:
              y8j = this.KM ? 4 : 3;
              break;
              case 2:
              var j20 = " m";
              j20 += "s ";
              j20 += "a";
              j20 += "go";
              var f$j = " ";
              f$j += "last succe";
              f$j += "s";
              f$j += "s was ";
              var l8h = "temp";
              l8h += "orar";
              l8h += "i";
              l8h += "ly";
              var M$u = "perm";
              M$u += "a";
              M$u += "nently";
              var Y3F = "Net";
              Y3F += "w";
              Y3F += "or";
              Y3F += "k has fai";
              Y3F += "led ";
              (u = this,
                v = r.lua,
                w = g.platform.time.fa() - this.EZa,
                x = this.config);
              e.warn(Y3F.concat(v ? M$u : l8h, f$j).concat(w, j20));
              y8j = 5;
              break;
              case 3:
              var H3J = "tempo";
              H3J += "ra";
              H3J += "ryNetworkErro";
              H3J += "r";
              var w16 = "tempo";
              w16 += "raryNe";
              // NOTE: state machine (var=y1d, states 2..5)
              w16 += "tworkE";
              w16 += "r";
              w16 += "ror";
              v || this.events.emit(w16, {
                  type: H3J,
                  errorCode: y,
                  Mk: A,
                  dh: z
              });
              v ? (this.J3 && (clearTimeout(this.J3),
                  this.J3 = undefined),
                this.MN.reset(),
                this.kXa({
                    lua: v,
                    BNc: y,
                    DNc: A,
                    // NOTE: state machine (var=u7p, states 2..9)
                    ENc: z,
                    Hb: r.md
              })) : this.J3 || (this.J3 = setTimeout(function() {
                    var y1d;
                    y1d = 2;
                    for (; y1d !== 5; ) {
                      switch (y1d) {
                        case 2:
                        u.J3 = undefined;
                        u.H3();
                        y1d = 5;
                        break;
                      }
                    }
                  }, x.kwa));
              y8j = 8;
              break;
            }
          }
        }
        ;
        /* method: q.UAc(r) */ q.prototype.UAc = function(r) {
          var u7p, x, u, v, w;
          u7p = 2;
          for (; u7p !== 9; ) {
            switch (u7p) {
              case 5:
              x = r.url.url;
              r = {
                url: x,
                md: v.id,
                Hb: v,
                stream: w,
                urls: v.urls,
                M: this.RFc,
                AOb: true
              };
              (w = null === (u = w.aZ) || undefined === u ? undefined : u.I0(r.M, x)) && this.MN.FRa(w, r, v.id);
              u7p = 9;
              break;
              case 1:
              u7p = r.url ? 5 : 9;
              break;
              case 2:
              (v = r.Hb,
                w = r.stream);
              u7p = 1;
              break;
            }
          }
        }
        ;
        L1E = 3;
        break;
      }
    }
  }
)();
export const Ecb = t;

// Detected exports: Ecb
