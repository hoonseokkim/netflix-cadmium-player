/**
 * Netflix Cadmium Playercore - Module 29358
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: hab
 * Dependencies: 22970, 29092, 48170, 58049
 * Purpose: Logging, Configuration, Error handling, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_29092 from './Module_29092.js';
// import dep_48170 from './Module_48170.js';
// import dep_58049 from './Module_58049.js';

// Webpack module 29358
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(29092);
c = a(48170);
g = a(58049);
t = (function() {
    class f {
    constructor(e, h, k) {
        this.ub = e;
        this.B7b = h;
        this.LG = k;
        this.Mma = 0;
        this.uua = false;
        this.Q9 = [];
        this.e_ = undefined;
        c.u && e.trace(("BranchRequestIterator [").concat(this.LG, "]: created"));
    }
    next() {
        return d.__awaiter(this, undefined, undefined, function() {
            var e, h, k, l, m;
            return d.__generator(this, function(n) {
                var q;
                switch (n.label) {
                case 0:
                    e = this.Dp;
                    if (!e)
                        return [3, 6];
                    this.e_ = undefined;
                    return [4, e.next()];
                case 1:
                    h = n.T();
                    this.ub.log("BranchRequestIterator:: processing result", !h.done && h.value.value.toString());
                    q = h;
                    k = !q.done && !(0,
                    g.JYa)(q.value.value);
                    l = 0;
                    n.label = 2;
                case 2:
                    if (!(l < this.Q9.length))
                        return [3, 5];
                    this.e_ = l;
                    m = this.Q9[l];
                    if (!k && !h.done && !m.egc)
                        return (this.ub.log("BranchRequestIterator::Skipping policy", {
                            name: m.name
                        }),
                        [3, 4]);
                    this.ub.log("BranchRequestIterator::Checking policy", {
                        name: m.name
                    });
                    return [4, m.process(h)];
                case 3:
                    (h = n.T(),
                    this.ub.log("BranchRequestIterator::policy complete", {
                        name: m.name
                    }),
                    n.label = 4);
                case 4:
                    return (l++,
                    [3, 2]);
                case 5:
                    this.e_ = undefined;
                    if (h.done || this.Dp !== e)
                        return [2, {
                            done: true
                        }];
                    this.Mma++;
                    h.value.pqb();
                    return [2, {
                        done: false,
                        value: h.value.value
                    }];
                case 6:
                    return [2, p.AsyncIterator.LWa()];
                }
            });
        });
    }
    gVc() {
        this.VTb();
        this.VSc();
    }
    VTb() {
        var e;
        if (this.Dp) {
            this.CHb = this.Gwb;
            e = this.Dp;
            e && e.rh();
            this.Q9.forEach(function(h) {
                return h.reset();
            });
            e && c.u && this.ub.trace(("BranchRequestIterator [").concat(this.LG, "]: Disposing iterator that was on branch "), this.Upa && this.Upa.K.id);
            this.uua = false;
            this.e_ = this.Dp = undefined;
        }
    }
    H9(e) {
        this.Q9.push(e);
    }
    VSc() {
        var e, h, k, l;
        e = this;
        if (!this.uua) {
            h = this.ub;
            k = this.B7b;
            l = this.LG;
            this.Mma = 0;
            this.CHb = this.nob = undefined;
            this.Dp = (0,
            p.Hra)((0,
            p.map)(k.lzc(), function(m) {
                return d.__awaiter(e, undefined, undefined, function() {
                    var n;
                    return d.__generator(this, function(q) {
                        switch (q.label) {
                        case 0:
                            return (this.nob = m,
                            this.Mma = 0,
                            c.u && h.trace(("BranchRequestIterator [").concat(this.LG, "]: new branch ").concat(m.K.id)),
                            [4, m.cM(l)]);
                        case 1:
                            if (n = q.T())
                                return [2, {
                                    value: n
                                }];
                            c.u && h.error(("BranchRequestIterator [").concat(this.LG, "]: skipping branch ").concat(m.K.id));
                            return [2, {
                                value: []
                            }];
                        }
                    });
                });
            }, h), h);
            this.uua = true;
        }
    }
}
Object.defineProperties(f.prototype, {
        Pmc: {
            get: function() {
                return this.Mma;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        Upa: {
            get: function() {
                return this.nob;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        zj: {
            get: function() {
                return this.uua;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        Gwb: {
            get: function() {
                return this.Dp ? this.Dp.mI ? "Complete" : this.Dp.k3a ? "WaitingForBranch" : undefined !== this.e_ ? ("In Policy ").concat(this.Q9[this.e_].name) : "WaitingForRequest" : ("Uninitialized;Prior:").concat(this.CHb);
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const hab = t;

// Detected exports: hab
