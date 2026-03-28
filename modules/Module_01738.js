/**
 * Netflix Cadmium Playercore - Module 1738
 * Extracted from cadmium-playercore-6.0055.939.911.js
 *
 * @module Module_01738
 * @description Reflect metadata polyfill
 * @size 37,073 chars (raw), 20,154 chars (deobfuscated)
 * Original signature: function(t, b, a)
 */

// Webpack module 1738
// Parameters: t (module), b (exports), a (require)

var d;
(function(p) {
    (function(c) {
        var f, e;
        function g(h, k) {
          return function(l, m) {
            "function" !== typeof h[l] && Object.defineProperty(h, l, {
                configurable: true,
                writable: true,
                value: m
            });
            k && k(l, m);
          }
          ;
        }
        f = "object" === typeof a.n0 ? a.n0 : "object" === typeof self ? self : "object" === typeof this ? this : Function("return this;")();
        e = g(p);
        "undefined" === typeof f.Reflect ? f.Reflect = p : e = g(f.Reflect, e);
        c(e);
      }
    )(function(c) {
        var E, G, F, H, J, M, K, L, O, I, N;
        function g(Q, S, T) {
          var U;
          U = N.get(Q);
          if (q(U)) {
            if (!T)
            return;
            U = new O();
            N.set(Q, U);
          }
          Q = U.get(S);
          if (q(Q)) {
            if (!T)
            return;
            Q = new O();
            U.set(S, Q);
          }
          return Q;
        }
        function f(Q, S, T) {
          if (e(Q, S, T))
          return true;
          S = A(S);
          return null === S ? false : f(Q, S, T);
        }
        function e(Q, S, T) {
          S = g(S, T, false);
          return q(S) ? false : !!S.has(Q);
        }
        function h(Q, S, T) {
          if (e(Q, S, T))
          return k(Q, S, T);
          S = A(S);
          if (null !== S)
          return h(Q, S, T);
        }
        function k(Q, S, T) {
          S = g(S, T, false);
          if (!q(S))
          return S.get(Q);
        }
        function l(Q, S) {
          var T, Y, da;
          T = m(Q, S);
          Q = A(Q);
          if (null === Q)
          return T;
          S = l(Q, S);
          if (0 >= S.length)
          return T;
          if (0 >= T.length)
          return S;
          Q = new I();
          for (var U = [], X = 0; X < T.length; X++) {
            Y = T[X];
            da = Q.has(Y);
            da || (Q.add(Y),
              U.push(Y));
          }
          for (T = 0; T < S.length; T++)
          (Y = S[T],
            (da = Q.has(Y)) || (Q.add(Y),
              U.push(Y)));
          return U;
        }
        function m(Q, S) {
          var T, U;
          T = [];
          Q = g(Q, S, false);
          if (q(Q))
          return T;
          Q = Q.keys();
          S = y(Q, H);
          if (!x(S))
          throw new TypeError();
          Q = S.call(Q);
          if (!r(Q))
          throw new TypeError();
          for (S = 0; ; ) {
            U = Q.next();
            U = U.done ? false : U;
            if (!U)
            return (T.length = S,
              T);
            U = U.value;
            try {
              T[S] = U;
            } catch (Y) {
              var X;
              try {
                X = Q["return"];
                X && X.call(Q);
              } finally {
                throw Y;
              }
            }
            S++;
          }
        }
        function n(Q) {
          if (null === Q)
          return 1;
          switch (typeof Q) {
            case "undefined":
            return 0;
            case "boolean":
            return 2;
            case "string":
            return 3;
            case "symbol":
            return 4;
            case "number":
            return 5;
            case "object":
            return null === Q ? 1 : 6;
            default:
            return 6;
          }
        }
        function q(Q) {
          return undefined === Q;
        }
        function r(Q) {
          return "object" === typeof Q ? null !== Q : "function" === typeof Q;
        }
        function u(Q, S) {
          var T;
          switch (n(Q)) {
            case 0:
            return Q;
            case 1:
            return Q;
            case 2:
            return Q;
            case 3:
            return Q;
            case 4:
            return Q;
            case 5:
            return Q;
          }
          S = 3 === S ? "string" : 5 === S ? "number" : "default";
          T = y(Q, F);
          if (undefined !== T) {
            Q = T.call(Q, S);
            if (r(Q))
            throw new TypeError();
            return Q;
          }
          a: {
            if ("string" === ("default" === S ? "number" : S)) {
              S = Q.toString;
              if (x(S) && (S = S.call(Q),
                  !r(S)))
              break a;
              S = Q.valueOf;
            } else {
              S = Q.valueOf;
              if (x(S) && (S = S.call(Q),
                  !r(S)))
              break a;
              S = Q.toString;
            }
            if (!x(S) || (S = S.call(Q),
                r(S)))
            throw new TypeError();
          }
          return S;
        }
        function v(Q) {
          Q = u(Q, 3);
          return "symbol" === typeof Q ? Q : "" + Q;
        }
        function w(Q) {
          return Array.isArray ? Array.isArray(Q) : Q instanceof Object ? Q instanceof Array : "[object Array]" === Object.prototype.toString.call(Q);
        }
        function x(Q) {
          return "function" === typeof Q;
        }
        function y(Q, S) {
          Q = Q[S];
          if (undefined !== Q && null !== Q) {
            if (!x(Q))
            throw new TypeError();
            return Q;
          }
        }
        function A(Q) {
          var S, T;
          S = Object.getPrototypeOf(Q);
          if ("function" !== typeof Q || Q === L || S !== L)
          return S;
          T = Q.prototype;
          T = T && Object.getPrototypeOf(T);
          if (null == T || T === Object.prototype)
          return S;
          T = T.constructor;
          return "function" !== typeof T || T === Q ? S : T;
        }
        function z() {
          var U, X, Y;
          function Q(da) {
            return da;
          }
          function S(da, ba) {
            return ba;
          }
          function T(da, ba) {
            return [da, ba];
          }
          U = {};
          X = [];
          Y = (function() {
              function da(ba, aa, ca) {
                this.Ei = 0;
                this.Pg = ba;
                this.cj = aa;
                this.l$b = ca;
              }
              da.prototype["@@iterator"] = function() {
                return this;
              }
              ;
              da.prototype[H] = function() {
                return this;
              }
              ;
              /* method: da.next() */ da.prototype.next = function() {
                var ba, aa;
                ba = this.Ei;
                if (0 <= ba && ba < this.Pg.length) {
                  aa = this.l$b(this.Pg[ba], this.cj[ba]);
                  ba + 1 >= this.Pg.length ? (this.Ei = -1,
                    this.cj = this.Pg = X) : this.Ei++;
                  return {
                    value: aa,
                    done: false
                  };
                }
                return {
                  value: undefined,
                  done: true
                };
              }
              ;
              /* method: da.throw(ba) */ da.prototype.throw = function(ba) {
                0 <= this.Ei && (this.Ei = -1,
                  this.cj = this.Pg = X);
                throw ba;
              }
              ;
              /* method: da.return(ba) */ da.prototype.return = function(ba) {
                0 <= this.Ei && (this.Ei = -1,
                  this.cj = this.Pg = X);
                return {
                  value: ba,
                  done: true
                };
              }
              ;
              return da;
            }
          )();
          return (function() {
              function da() {
                this.Pg = [];
                this.cj = [];
                this.iD = U;
                this.gA = -2;
              }
              Object.defineProperty(da.prototype, "size", {
                  get: function() {
                    return this.Pg.length;
                  },
                  enumerable: true,
                  configurable: true
              });
              /* method: da.has(ba) */ da.prototype.has = function(ba) {
                return 0 <= this.GG(ba, false);
              }
              ;
              /* method: da.get(ba) */ da.prototype.get = function(ba) {
                ba = this.GG(ba, false);
                return 0 <= ba ? this.cj[ba] : undefined;
              }
              ;
              /* method: da.set(ba, aa) */ da.prototype.set = function(ba, aa) {
                ba = this.GG(ba, true);
                this.cj[ba] = aa;
                return this;
              }
              ;
              /* method: da.delete(ba) */ da.prototype.delete = function(ba) {
                var aa, ca;
                aa = this.GG(ba, false);
                if (0 <= aa) {
                  ca = this.Pg.length;
                  for (aa += 1; aa < ca; aa++)
                  (this.Pg[aa - 1] = this.Pg[aa],
                    this.cj[aa - 1] = this.cj[aa]);
                  this.Pg.length--;
                  this.cj.length--;
                  ba === this.iD && (this.iD = U,
                    this.gA = -2);
                  return true;
                }
                return false;
              }
              ;
              /* method: da.clear() */ da.prototype.clear = function() {
                this.Pg.length = 0;
                this.cj.length = 0;
                this.iD = U;
                this.gA = -2;
              }
              ;
              /* method: da.keys() */ da.prototype.keys = function() {
                return new Y(this.Pg,this.cj,Q);
              }
              ;
              /* method: da.values() */ da.prototype.values = function() {
                return new Y(this.Pg,this.cj,S);
              }
              ;
              /* method: da.entries() */ da.prototype.entries = function() {
                return new Y(this.Pg,this.cj,T);
              }
              ;
              da.prototype["@@iterator"] = function() {
                return this.entries();
              }
              ;
              da.prototype[H] = function() {
                return this.entries();
              }
              ;
              /* method: da.GG(ba, aa) */ da.prototype.GG = function(ba, aa) {
                this.iD !== ba && (this.gA = this.Pg.indexOf(this.iD = ba));
                0 > this.gA && aa && (this.gA = this.Pg.length,
                  this.Pg.push(ba),
                  this.cj.push(undefined));
                return this.gA;
              }
              ;
              return da;
            }
          )();
        }
        function B() {
          return (function() {
              function Q() {
                this.kh = new O();
              }
              Object.defineProperty(Q.prototype, "size", {
                  get: function() {
                    return this.kh.size;
                  },
                  enumerable: true,
                  configurable: true
              });
              /* method: Q.has(S) */ Q.prototype.has = function(S) {
                return this.kh.has(S);
              }
              ;
              /* method: Q.add(S) */ Q.prototype.add = function(S) {
                return (this.kh.set(S, S),
                  this);
              }
              ;
              /* method: Q.delete(S) */ Q.prototype.delete = function(S) {
                return this.kh.delete(S);
              }
              ;
              /* method: Q.clear() */ Q.prototype.clear = function() {
                this.kh.clear();
              }
              ;
              /* method: Q.keys() */ Q.prototype.keys = function() {
                return this.kh.keys();
              }
              ;
              /* method: Q.values() */ Q.prototype.values = function() {
                return this.kh.values();
              }
              ;
              /* method: Q.entries() */ Q.prototype.entries = function() {
                return this.kh.entries();
              }
              ;
              Q.prototype["@@iterator"] = function() {
                return this.keys();
              }
              ;
              Q.prototype[H] = function() {
                return this.keys();
              }
              ;
              return Q;
            }
          )();
        }
        function C() {
          var U, X;
          function Q() {
            var Y, aa;
            do {
              Y = "function" === typeof Uint8Array ? "undefined" !== typeof crypto ? crypto.getRandomValues(new Uint8Array(16)) : "undefined" !== typeof msCrypto ? msCrypto.getRandomValues(new Uint8Array(16)) : T(new Uint8Array(16), 16) : T(Array(16), 16);
              Y[6] = Y[6] & 79 | 64;
              Y[8] = Y[8] & 191 | 128;
              for (var da = "", ba = 0; 16 > ba; ++ba) {
                aa = Y[ba];
                if (4 === ba || 6 === ba || 8 === ba)
                da += "-";
                16 > aa && (da += "0");
                da += aa.toString(16).toLowerCase();
              }
              Y = "@@WeakMap@@" + da;
            } while (K.has(U, Y));
            U[Y] = true;
            return Y;
          }
          function S(Y, da) {
            if (!E.call(Y, X)) {
              if (!da)
              return;
              Object.defineProperty(Y, X, {
                  value: K.create()
              });
            }
            return Y[X];
          }
          function T(Y, da) {
            for (var ba = 0; ba < da; ++ba)
            Y[ba] = 255 * Math.random() | 0;
            return Y;
          }
          U = K.create();
          X = Q();
          return (function() {
              function Y() {
                this.nA = Q();
              }
              /* method: Y.has(da) */ Y.prototype.has = function(da) {
                da = S(da, false);
                return undefined !== da ? K.has(da, this.nA) : false;
              }
              ;
              /* method: Y.get(da) */ Y.prototype.get = function(da) {
                da = S(da, false);
                return undefined !== da ? K.get(da, this.nA) : undefined;
              }
              ;
              /* method: Y.set(da, ba) */ Y.prototype.set = function(da, ba) {
                S(da, true)[this.nA] = ba;
                return this;
              }
              ;
              /* method: Y.delete(da) */ Y.prototype.delete = function(da) {
                da = S(da, false);
                return undefined !== da ? delete da[this.nA] : false;
              }
              ;
              /* method: Y.clear() */ Y.prototype.clear = function() {
                this.nA = Q();
              }
              ;
              return Y;
            }
          )();
        }
        function D(Q) {
          Q.m7b = undefined;
          delete Q.m7b;
          return Q;
        }
        E = Object.prototype.hasOwnProperty;
        G = "function" === typeof Symbol;
        F = G && "undefined" !== typeof Symbol.toPrimitive ? Symbol.toPrimitive : "@@toPrimitive";
        H = G && "undefined" !== typeof Symbol.iterator ? Symbol.iterator : "@@iterator";
        G = "function" === typeof Object.create;
        J = ({
            __proto__: []
        })instanceof Array;
        M = !G && !J;
        K = {
          create: G ? function() {
            return D(Object.create(null));
          }
          : J ? function() {
            return D({
                __proto__: null
            });
          }
          : function() {
            return D({});
          }
          ,
          has: M ? function(Q, S) {
            return E.call(Q, S);
          }
          : function(Q, S) {
            return (S in Q);
          }
          ,
          get: M ? function(Q, S) {
            return E.call(Q, S) ? Q[S] : undefined;
          }
          : function(Q, S) {
            return Q[S];
          }
        };
        L = Object.getPrototypeOf(Function);
        O = (G = "object" === typeof process && "true" === ({
              NODE_ENV: "production",
              PLATFORM: "cadmium",
              ASEBUILD: "release",
              OBFUSCATE: "obfuscate",
              BUILD_VERSION: "6.0055.939.911"
          }).REFLECT_METADATA_USE_MAP_POLYFILL) || "function" !== typeof Map || "function" !== typeof Map.prototype.entries ? z() : Map;
        I = G || "function" !== typeof Set || "function" !== typeof Set.prototype.entries ? B() : Set;
        N = new (G || "function" !== typeof WeakMap ? C() : WeakMap)();
        c("decorate", function(Q, S, T, U) {
            var Y;
            if (q(T)) {
              if (!w(Q))
              throw new TypeError();
              if ("function" !== typeof S)
              throw new TypeError();
              for (T = Q.length - 1; 0 <= T; --T)
              if ((U = (0,
                    Q[T])(S),
                  !q(U) && null !== U)) {
                if ("function" !== typeof U)
                throw new TypeError();
                S = U;
              }
              return S;
            }
            if (!w(Q))
            throw new TypeError();
            if (!r(S))
            throw new TypeError();
            if (!r(U) && !q(U) && null !== U)
            throw new TypeError();
            null === U && (U = undefined);
            T = v(T);
            for (var X = Q.length - 1; 0 <= X; --X) {
              Y = (0,
                Q[X])(S, T, U);
              if (!q(Y) && null !== Y) {
                if (!r(Y))
                throw new TypeError();
                U = Y;
              }
            }
            return U;
        });
        c("metadata", function(Q, S) {
            return function(T, U) {
              var X;
              if (!r(T))
              throw new TypeError();
              if (X = !q(U)) {
                a: switch (n(U)) {
                  case 3:
                  X = true;
                  break a;
                  case 4:
                  X = true;
                  break a;
                  default:
                  X = false;
                }
                X = !X;
              }
              if (X)
              throw new TypeError();
              g(T, U, true).set(Q, S);
            }
            ;
        });
        c("defineMetadata", function(Q, S, T, U) {
            if (!r(T))
            throw new TypeError();
            q(U) || (U = v(U));
            g(T, U, true).set(Q, S);
        });
        c("hasMetadata", function(Q, S, T) {
            if (!r(S))
            throw new TypeError();
            q(T) || (T = v(T));
            return f(Q, S, T);
        });
        c("hasOwnMetadata", function(Q, S, T) {
            if (!r(S))
            throw new TypeError();
            q(T) || (T = v(T));
            return e(Q, S, T);
        });
        c("getMetadata", function(Q, S, T) {
            if (!r(S))
            throw new TypeError();
            q(T) || (T = v(T));
            return h(Q, S, T);
        });
        c("getOwnMetadata", function(Q, S, T) {
            if (!r(S))
            throw new TypeError();
            q(T) || (T = v(T));
            return k(Q, S, T);
        });
        c("getMetadataKeys", function(Q, S) {
            if (!r(Q))
            throw new TypeError();
            q(S) || (S = v(S));
            return l(Q, S);
        });
        c("getOwnMetadataKeys", function(Q, S) {
            if (!r(Q))
            throw new TypeError();
            q(S) || (S = v(S));
            return m(Q, S);
        });
        c("deleteMetadata", function(Q, S, T) {
            var U;
            if (!r(S))
            throw new TypeError();
            q(T) || (T = v(T));
            U = g(S, T, false);
            if (q(U) || !U.delete(Q))
            return false;
            if (0 < U.size)
            return true;
            Q = N.get(S);
            Q.delete(T);
            if (0 < Q.size)
            return true;
            N.delete(S);
            return true;
        });
    });
  }
)(d || (d = {}));

// No named exports detected
