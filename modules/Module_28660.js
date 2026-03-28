/**
 * Netflix Cadmium Playercore - Module 28660
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Purpose: Encryption/Decryption, Configuration, Error handling, UI components
 */

// Webpack module 28660
// Parameters: t (module), b (exports), a (require)

var d;
(function(p) {
    var D, E, G, F, H, J, M, K, L;
    function c(O, I, N) {
        var Q;
        Q = L.get(O);
        if (!Q) {
            if (!N)
                return;
            Q = new M();
            L.set(O, Q);
        }
        O = Q.get(I);
        if (!O) {
            if (!N)
                return;
            O = new M();
            Q.set(I, O);
        }
        return O;
    }
    function g(O, I, N) {
        if (f(O, I, N))
            return true;
        I = u(I);
        return null !== I ? g(O, I, N) : false;
    }
    function f(O, I, N) {
        I = c(I, N, false);
        return undefined !== I && !!I.has(O);
    }
    function e(O, I, N) {
        if (f(O, I, N))
            return h(O, I, N);
        I = u(I);
        return null !== I ? e(O, I, N) : undefined;
    }
    function h(O, I, N) {
        I = c(I, N, false);
        return undefined === I ? undefined : I.get(O);
    }
    function k(O, I) {
        var N, S;
        N = l(O, I);
        O = u(O);
        if (null === O)
            return N;
        I = k(O, I);
        if (0 >= I.length)
            return N;
        if (0 >= N.length)
            return I;
        O = new K();
        for (var Q = 0; Q < N.length; Q++) {
            S = N[Q];
            O.add(S);
        }
        for (N = 0; N < I.length; N++)
            (S = I[N],
            O.add(S));
        return x(O);
    }
    function l(O, I) {
        var N;
        O = c(O, I, false);
        N = [];
        O && w(O, function(Q, S) {
            return N.push(S);
        });
        return N;
    }
    function m(O) {
        return undefined === O;
    }
    function n(O) {
        return Array.isArray ? Array.isArray(O) : O instanceof Array || "[object Array]" === Object.prototype.toString.call(O);
    }
    function q(O) {
        return "object" === typeof O ? null !== O : "function" === typeof O;
    }
    function r(O) {
        return "symbol" === typeof O ? O : String(O);
    }
    function u(O) {
        var I, N;
        I = Object.getPrototypeOf(O);
        if ("function" !== typeof O || O === J || I !== J)
            return I;
        N = O.prototype;
        N = N && Object.getPrototypeOf(N);
        if (null == N || N === Object.prototype)
            return I;
        N = N.constructor;
        return "function" !== typeof N || N === O ? I : N;
    }
    function v(O) {
        O = O.next();
        return O.done ? undefined : O;
    }
    function w(O, I, N) {
        var Q, S, T;
        Q = O.entries;
        if ("function" === typeof Q) {
            Q = Q.call(O);
            try {
                for (; S = v(Q); ) {
                    T = S.value;
                    I.call(N, T[1], T[0], O);
                }
            } finally {
                S && (O = Q["return"]) && O.call(Q);
            }
        } else
            (Q = O.forEach,
            "function" === typeof Q && Q.call(O, I, N));
    }
    function x(O) {
        var I;
        I = [];
        w(O, function(N, Q) {
            I.push(Q);
        });
        return I;
    }
    function y(O, I, N) {
        var Q;
        Q = 0;
        return {
            next: function() {
                var S;
                if ((O || I) && Q < (O || I).length) {
                    S = Q++;
                    switch (N) {
                    case "key":
                        return {
                            value: O[S],
                            done: false
                        };
                    case "value":
                        return {
                            value: I[S],
                            done: false
                        };
                    case "key+value":
                        return {
                            value: [O[S], I[S]],
                            done: false
                        };
                    }
                }
                I = O = undefined;
                return {
                    value: undefined,
                    done: true
                };
            },
            "throw": function(S) {
                if (O || I)
                    I = O = undefined;
                throw S;
            },
            "return": function(S) {
                if (O || I)
                    I = O = undefined;
                return {
                    value: S,
                    done: true
                };
            }
        };
    }
    function A() {
        var O;
        O = {};
        return (function() {
            class I {
    constructor() {
                this.Pg = [];
                this.cj = [];
                this.iD = O;
                this.gA = -2;
            }
    has(N) {
                return 0 <= this.GG(N, false);
            }
    get(N) {
                N = this.GG(N, false);
                return 0 <= N ? this.cj[N] : undefined;
            }
    set(N, Q) {
                N = this.GG(N, true);
                this.cj[N] = Q;
                return this;
            }
    delete(N) {
                var Q;
                Q = this.GG(N, false);
                if (0 <= Q) {
                    N = this.Pg.length;
                    for (Q += 1; Q < N; Q++)
                        (this.Pg[Q - 1] = this.Pg[Q],
                        this.cj[Q - 1] = this.cj[Q]);
                    this.Pg.length--;
                    this.cj.length--;
                    this.iD = O;
                    this.gA = -2;
                    return true;
                }
                return false;
            }
    clear() {
                this.Pg.length = 0;
                this.cj.length = 0;
                this.iD = O;
                this.gA = -2;
            }
    keys() {
                return y(this.Pg, undefined, "key");
            }
    values() {
                return y(undefined, this.cj, "value");
            }
    entries() {
                return y(this.Pg, this.cj, "key+value");
            }
    GG(N, Q) {
                var S;
                if (this.iD === N)
                    return this.gA;
                S = this.Pg.indexOf(N);
                0 > S && Q && (S = this.Pg.length,
                this.Pg.push(N),
                this.cj.push(undefined));
                return (this.iD = N,
                this.gA = S);
            }
}
Object.defineProperty(I.prototype, "size", {
                get: function() {
                    return this.Pg.length;
                },
                enumerable: true,
                configurable: true
            });
            return I;
        }
        )();
    }
    function z() {
        return (function() {
            class O {
    constructor() {
                this.kh = new M();
            }
    has(I) {
                return this.kh.has(I);
            }
    add(I) {
                return (this.kh.set(I, I),
                this);
            }
    delete(I) {
                return this.kh.delete(I);
            }
    clear() {
                this.kh.clear();
            }
    keys() {
                return this.kh.keys();
            }
    values() {
                return this.kh.values();
            }
    entries() {
                return this.kh.entries();
            }
}
Object.defineProperty(O.prototype, "size", {
                get: function() {
                    return this.kh.size;
                },
                enumerable: true,
                configurable: true
            });
            return O;
        }
        )();
    }
    function B() {
        var Q, S;
        function O(T, U) {
            for (var X = 0; X < U; ++X)
                T[X] = 255 * Math.random() | 0;
            return T;
        }
        function I() {
            var T, Y;
            do {
                T = "function" === typeof Uint8Array ? "undefined" !== typeof crypto ? crypto.getRandomValues(new Uint8Array(16)) : "undefined" !== typeof msCrypto ? msCrypto.getRandomValues(new Uint8Array(16)) : O(new Uint8Array(16), 16) : O(Array(16), 16);
                T[6] = T[6] & 79 | 64;
                T[8] = T[8] & 191 | 128;
                for (var U = "", X = 0; 16 > X; ++X) {
                    Y = T[X];
                    if (4 === X || 6 === X || 8 === X)
                        U += "-";
                    16 > Y && (U += "0");
                    U += Y.toString(16).toLowerCase();
                }
                T = "@@WeakMap@@" + U;
            } while (H.has(Q, T));
            Q[T] = true;
            return T;
        }
        function N(T, U) {
            if (!D.call(T, S)) {
                if (!U)
                    return;
                Object.defineProperty(T, S, {
                    value: F()
                });
            }
            return T[S];
        }
        Q = F();
        S = I();
        return (function() {
            class T {
    constructor() {
                this.nA = I();
            }
    has(U) {
                U = N(U, false);
                return undefined !== U ? H.has(U, this.nA) : false;
            }
    get(U) {
                U = N(U, false);
                return undefined !== U ? H.get(U, this.nA) : undefined;
            }
    set(U, X) {
                N(U, true)[this.nA] = X;
                return this;
            }
    delete(U) {
                U = N(U, false);
                return undefined !== U ? delete U[this.nA] : false;
            }
    clear() {
                this.nA = I();
            }
}
return T;
        }
        )();
    }
    function C(O) {
        O.wbd = 1;
        delete O.xbd;
        return O;
    }
    D = Object.prototype.hasOwnProperty;
    E = "function" === typeof Object.create;
    G = (function() {
        var I;
        function O() {}
        I = {};
        O.prototype = I;
        return new O().__proto__ === I;
    }
    )();
    F = E ? function() {
        return C(Object.create(null));
    }
    : G ? function() {
        return C({
            __proto__: null
        });
    }
    : function() {
        return C({});
    }
    ;
    (function(O) {
        var I;
        I = !E && !G;
        O.has = I ? function(N, Q) {
            return D.call(N, Q);
        }
        : function(N, Q) {
            return (Q in N);
        }
        ;
        O.get = I ? function(N, Q) {
            return D.call(N, Q) ? N[Q] : undefined;
        }
        : function(N, Q) {
            return N[Q];
        }
        ;
    }
    )(H || (H = {}));
    J = Object.getPrototypeOf(Function);
    M = "function" === typeof Map ? Map : A();
    K = "function" === typeof Set ? Set : z();
    L = new ("function" === typeof WeakMap ? WeakMap : B())();
    p.BL = function(O, I, N, Q) {
        var T;
        if (m(Q)) {
            if (m(N)) {
                if (!n(O))
                    throw new TypeError();
                if ("function" !== typeof I)
                    throw new TypeError();
                for (N = O.length - 1; 0 <= N; --N)
                    if ((Q = (0,
                    O[N])(I),
                    !m(Q))) {
                        if ("function" !== typeof Q)
                            throw new TypeError();
                        I = Q;
                    }
                return I;
            }
            if (!n(O))
                throw new TypeError();
            if (!q(I))
                throw new TypeError();
            N = r(N);
            for (Q = O.length - 1; 0 <= Q; --Q)
                (0,
                O[Q])(I, N);
        } else {
            if (!n(O))
                throw new TypeError();
            if (!q(I))
                throw new TypeError();
            if (m(N))
                throw new TypeError();
            if (!q(Q))
                throw new TypeError();
            N = r(N);
            for (var S = O.length - 1; 0 <= S; --S) {
                T = (0,
                O[S])(I, N, Q);
                if (!m(T)) {
                    if (!q(T))
                        throw new TypeError();
                    Q = T;
                }
            }
            return Q;
        }
    }
    ;
    p.xa = function(O, I) {
        return function(N, Q) {
            if (m(Q)) {
                if ("function" !== typeof N)
                    throw new TypeError();
                c(N, undefined, true).set(O, I);
            } else {
                if (!q(N))
                    throw new TypeError();
                Q = r(Q);
                c(N, Q, true).set(O, I);
            }
        }
        ;
    }
    ;
    p.kqa = function(O, I, N, Q) {
        if (!q(N))
            throw new TypeError();
        m(Q) || (Q = r(Q));
        c(N, Q, true).set(O, I);
    }
    ;
    p.iBc = function(O, I) {
        var N;
        if (!q(I))
            throw new TypeError();
        m(N) || (N = r(N));
        return g(O, I, N);
    }
    ;
    p.rXa = function(O, I) {
        var N;
        if (!q(I))
            throw new TypeError();
        m(N) || (N = r(N));
        return f(O, I, N);
    }
    ;
    p.getMetadata = function(O, I, N) {
        if (!q(I))
            throw new TypeError();
        m(N) || (N = r(N));
        return e(O, I, N);
    }
    ;
    p.OCb = function(O, I, N) {
        if (!q(I))
            throw new TypeError();
        m(N) || (N = r(N));
        return h(O, I, N);
    }
    ;
    p.Xfd = function(O, I) {
        if (!q(O))
            throw new TypeError();
        m(I) || (I = r(I));
        return k(O, I);
    }
    ;
    p.bgd = function(O, I) {
        if (!q(O))
            throw new TypeError();
        m(I) || (I = r(I));
        return l(O, I);
    }
    ;
    p.$dd = function(O, I, N) {
        var Q;
        if (!q(I))
            throw new TypeError();
        m(N) || (N = r(N));
        Q = c(I, N, false);
        if (m(Q) || !Q.delete(O))
            return false;
        if (0 < Q.size)
            return true;
        O = L.get(I);
        O.delete(N);
        if (0 < O.size)
            return true;
        L.delete(I);
        return true;
    }
    ;
    (function(O) {
        if ("undefined" !== typeof O.Reflect) {
            if (O.Reflect !== p)
                for (var I in p)
                    D.call(p, I) && (O.Reflect[I] = p[I]);
        } else
            O.Reflect = p;
    }
    )("undefined" !== typeof Da ? Da : "undefined" !== typeof WorkerGlobalScope ? self : "undefined" !== typeof a.n0 ? a.n0 : Function("return this;")());
}
)(d || (d = {}));

