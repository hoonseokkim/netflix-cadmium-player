/**
 * Netflix Cadmium Playercore - Module 25462
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ovb, g3b
 * Dependencies: 22970, 32260, 42296, 51411, 54449, 68480, 70390, 89752
 * Purpose: Timing/Scheduling, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_32260 from './Module_32260.js';
// import dep_42296 from './Module_42296.js';
// import dep_51411 from './Module_51411.js';
// import dep_54449 from './Module_54449.js';
// import dep_68480 from './Module_68480.js';
// import dep_70390 from './Module_70390.js';
// import dep_89752 from './Module_89752.js';

// Webpack module 25462
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q;

t = a(22970);
d = t.__importDefault(a(79804));
p = a(54449);
c = a(68480);
g = a(42296);
f = a(51411);
e = t.__importDefault(a(6838));
h = t.__importDefault(a(48795));
k = t.__importDefault(a(10690));
l = a(70390);
m = a(89752);
n = a(32260);
q = (function() {
    class r {
    constructor(u, v, w, x, y, A, z) {
        var B;
        B = this;
        this.Ak = u;
        this.Oma = v;
        this.lA = w;
        this.qD = 1;
        this.pl = [];
        this.iob = this.Xl = false;
        this.fob = true;
        this.Oj = [];
        this.ql = false;
        this.HK = new m.S5();
        this.ws = this.Mg = false;
        this.nf = null;
        d.default(z, function() {
            var D, E, G, F;
            function C() {
                B.ql = true;
                B.HK.add(true);
            }
            D = u.Og;
            if (w instanceof p.wX)
                (G = (E = c.qYa(u.EG, w.QJb)) ? f.bDb(E.uL) : null,
                F = D.cDb());
            else
                (E = u.EG,
                G = null,
                F = y);
            B.f8b = F;
            B.EG = E;
            B.Jma = x;
            B.fMa = G;
            w.bo(D, F, {
                result: function(H) {
                    v.write(H, 0, H.length, A, {
                        result: function(J) {
                            try {
                                B.Mg ? C() : J < H.length ? (B.ws = true,
                                C()) : v.flush(A, {
                                    result: function(M) {
                                        B.Mg || (B.ws = !M);
                                        C();
                                    },
                                    timeout: function() {
                                        B.ws = true;
                                        C();
                                    },
                                    error: function(M) {
                                        B.nf = M;
                                        C();
                                    }
                                });
                            } catch (M) {
                                B.nf = M;
                                C();
                            }
                        },
                        timeout: function() {
                            B.ws = true;
                            C();
                        },
                        error: function(J) {
                            B.nf = J;
                            C();
                        }
                    });
                },
                error: function(H) {
                    B.nf = H instanceof e.default ? new h.default("Error encoding the message header.",H) : H;
                    C();
                }
            });
            return B;
        });
    }
    Ws(u) {
        var w;
        function v() {
            d.default(u, function() {
                if (w.Mg)
                    return false;
                if (w.ws)
                    u.timeout();
                else {
                    if (w.nf)
                        throw w.nf;
                    return true;
                }
            });
        }
        w = this;
        d.default(u, function() {
            w.ql ? v() : w.HK.Afa(-1, {
                result: function(x) {
                    d.default(u, function() {
                        if (undefined === x)
                            return false;
                        v();
                    });
                },
                timeout: function() {
                    d.default(u, function() {
                        throw new k.default("Timeout while waiting for MessageOutputStream.isReady() despite no timeout being specified.");
                    });
                },
                error: u.error
            });
        });
    }
    fXc(u, v, w) {
        var y;
        function x() {
            y.flush(v, {
                result: function(A) {
                    d.default(w, function() {
                        if (!A)
                            throw new h.default("flush() aborted");
                        y.fMa = u;
                        return true;
                    });
                },
                timeout: w.timeout,
                error: w.error
            });
        }
        y = this;
        d.default(w, function() {
            if (!y.Xq())
                throw new k.default("Cannot write payload data for an error message.");
            if (y.fMa == u)
                return true;
            if (u) {
                if (!y.EG)
                    return false;
                for (var A = y.EG.uL, z = 0; z < A.length; ++z)
                    if (A[z] == u) {
                        x();
                        return;
                    }
                return false;
            }
            x();
        });
    }
    Xq() {
        return this.lA instanceof p.wX ? this.lA : null;
    }
    z0() {
        return this.lA instanceof l.o6 ? this.lA : null;
    }
    l_c() {
        this.fob = false;
        this.Oj = [];
    }
    abort() {
        this.Mg = true;
        this.Oma.abort();
        this.HK.gpa();
    }
    Yhc(u) {
        this.iob = u;
    }
    close(u, v) {
        var w;
        w = this;
        d.default(v, function() {
            if (w.Mg)
                return false;
            if (w.ws)
                v.timeout();
            else {
                if (w.nf)
                    throw w.nf;
                if (w.Xl)
                    return true;
                w.Xl = true;
                w.flush(u, {
                    result: function(x) {
                        d.default(v, function() {
                            x && (w.pl = null);
                            if (w.iob)
                                w.Oma.close(u, v);
                            else
                                return x;
                        });
                    },
                    timeout: v.timeout,
                    error: v.error
                });
            }
        });
    }
    flush(u, v) {
        var x;
        function w() {
            d.default(v, function() {
                var y, A, D;
                if (!x.pl || !x.Xl && 0 == x.pl.length)
                    return true;
                y = x.Xq();
                if (!y || y.zM())
                    return true;
                A = 0;
                x.pl.forEach(function(E) {
                    A += E.length;
                });
                for (var z = new Uint8Array(A), B = 0, C = 0; C < x.pl.length; ++C) {
                    D = x.pl[C];
                    z.set(D, B);
                    B += D.length;
                }
                g.Wvb(x.Ak, x.qD, y.Ke, x.Xl, x.fMa, z, x.Jma, {
                    result: function(E) {
                        d.default(v, function() {
                            x.fob && x.Oj.push(E);
                            E.bo(x.Ak.Og, x.f8b, {
                                result: function(G) {
                                    d.default(v, function() {
                                        x.Oma.write(G, 0, G.length, u, {
                                            result: function(F) {
                                                d.default(v, function() {
                                                    if (x.Mg)
                                                        return false;
                                                    F < E.length ? v.timeout() : x.Oma.flush(u, {
                                                        result: function(H) {
                                                            d.default(v, function() {
                                                                if (x.Mg)
                                                                    return false;
                                                                if (H)
                                                                    return (++x.qD,
                                                                    x.pl = x.Xl ? null : [],
                                                                    true);
                                                                v.timeout();
                                                            });
                                                        },
                                                        timeout: v.timeout,
                                                        error: function(H) {
                                                            d.default(v, function() {
                                                                n.Md(H) && (H = new h.default("Error encoding payload chunk [sequence number " + x.qD + "].",H));
                                                                throw H;
                                                            });
                                                        }
                                                    });
                                                });
                                            },
                                            timeout: function() {
                                                v.timeout();
                                            },
                                            error: function(F) {
                                                d.default(v, function() {
                                                    n.Md(F) && (F = new h.default("Error encoding payload chunk [sequence number " + x.qD + "].",F));
                                                    throw F;
                                                });
                                            }
                                        });
                                    });
                                },
                                error: function(G) {
                                    d.default(v, function() {
                                        if (G instanceof e.default)
                                            throw new h.default("Error encoding payload chunk [sequence number " + x.qD + "].",G);
                                        throw G;
                                    });
                                }
                            });
                        });
                    },
                    error: function(E) {
                        d.default(v, function() {
                            n.Md(E) && (E = new h.default("Error encoding payload chunk [sequence number " + x.qD + "].",E));
                            throw E;
                        });
                    }
                });
            });
        }
        x = this;
        this.Ws({
            result: function(y) {
                d.default(v, function() {
                    if (y)
                        w();
                    else
                        return false;
                });
            },
            timeout: v.timeout,
            error: v.error
        });
    }
    write(u, v, w, x, y) {
        var A;
        A = this;
        d.default(y, function() {
            var z;
            if (A.Mg)
                return false;
            if (A.ws)
                y.timeout();
            else {
                if (A.nf)
                    throw A.nf;
                if (A.Xl)
                    throw new h.default("Message output stream already closed.");
                if (0 > v)
                    throw new RangeError("Offset cannot be negative.");
                if (0 > w)
                    throw new RangeError("Length cannot be negative.");
                if (v + w > u.length)
                    throw new RangeError("Offset plus length cannot be greater than the array length.");
                z = A.Xq();
                if (!z)
                    throw new k.default("Cannot write payload data for an error message.");
                if (z.zM())
                    throw new k.default("Cannot write payload data for a handshake message.");
                z = u.subarray(v, v + w);
                A.pl.push(z);
                return z.length;
            }
        });
    }
}
return r;
}
)();
export const g3b = q;
export function Ovb(r, u, v, w, x, y, A) {
    new q(r,u,v,w,x,y,A);
}
;

// Detected exports: Ovb, g3b
