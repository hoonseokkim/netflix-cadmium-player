/**
 * Netflix Cadmium Playercore - Module 56089
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 56089
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Iab = void 0;
d = a(22970);
p = a(43276);
t = (function() {
    var f1e;
    f1e = 2;
    function c() {
        var I8d;
        I8d = 2;
        for (; I8d !== 5; ) {
            switch (I8d) {
            case 2:
                var M6T = "1S";
                M6T += "IYbZ";
                M6T += "rNJ";
                M6T += "C";
                M6T += "p9";
                this.w3 = {};
                M6T;
                I8d = 5;
                break;
            }
        }
    }
    for (; f1e !== 8; ) {
        switch (f1e) {
        case 4:
            var K6J = "no";
            K6J += "-pb";
            K6J += "cid-";
            K6J += "ke";
            K6J += "y";
            c.prototype.get = function() {
                var H_9, f, e, h, k, l, I8l, m, n, z$o, N1y, O_D;
                H_9 = 2;
                function g(r) {
                    var n8u;
                    n8u = 2;
                    for (; n8u !== 1; ) {
                        switch (n8u) {
                        case 2:
                            Object.keys(l.w3[r]).forEach(function(u) {
                                var L2A, v;
                                L2A = 2;
                                for (; L2A !== 5; ) {
                                    switch (L2A) {
                                    case 2:
                                        v = e.w3[r][u].get();
                                        v && k.push({
                                            cdnid: r,
                                            pbcid: u === c.vwa ? null : u,
                                            avtp: v.Fa,
                                            tm: v.HSa
                                        });
                                        L2A = 5;
                                        break;
                                    }
                                }
                            });
                            n8u = 1;
                            break;
                        }
                    }
                }
                for (; H_9 !== 4; ) {
                    switch (H_9) {
                    case 2:
                        (e = this,
                        h = Object.keys(this.w3).map(function(r) {
                            var B6N;
                            B6N = 2;
                            for (; B6N !== 1; ) {
                                switch (B6N) {
                                case 2:
                                    return parseInt(r);
                                    break;
                                }
                            }
                        }),
                        k = [],
                        l = this);
                        try {
                            I8l = 2;
                            for (; I8l !== 3; ) {
                                switch (I8l) {
                                case 4:
                                    n = m.next();
                                    I8l = 1;
                                    break;
                                case 2:
                                    (m = d.__values(h),
                                    n = m.next());
                                    I8l = 1;
                                    break;
                                case 7:
                                    I8l = +n.done ? 6 : 1;
                                    break;
                                case 14:
                                    n = m.next();
                                    I8l = 9;
                                    break;
                                case 1:
                                    I8l = !n.done ? 5 : 3;
                                    break;
                                case 5:
                                    g(n.value);
                                    I8l = 4;
                                    break;
                                }
                            }
                        } catch (r) {
                            var q;
                            q = {
                                error: r
                            };
                        } finally {
                            z$o = 2;
                            for (; z$o !== 1; ) {
                                switch (z$o) {
                                case 2:
                                    try {
                                        N1y = 2;
                                        for (; N1y !== 1; ) {
                                            switch (N1y) {
                                            case 2:
                                                n && !n.done && (f = m.return) && f.call(m);
                                                N1y = 1;
                                                break;
                                            }
                                        }
                                    } finally {
                                        O_D = 2;
                                        for (; O_D !== 5; ) {
                                            switch (O_D) {
                                            case 2:
                                                O_D = q ? 1 : 5;
                                                break;
                                            case 3:
                                                O_D = q ? 3 : 2;
                                                break;
                                            case 9:
                                                throw q.error;
                                                O_D = 8;
                                                break;
                                            case 1:
                                                throw q.error;
                                                O_D = 5;
                                                break;
                                            }
                                        }
                                    }
                                    z$o = 1;
                                    break;
                                }
                            }
                        }
                        return k;
                        break;
                    }
                }
            }
            ;
            c.vwa = K6J;
            return c;
            break;
        case 2:
            c.prototype.add = function(g, f, e, h, k) {
                var u40, l;
                u40 = 2;
                for (; u40 !== 9; ) {
                    switch (u40) {
                    case 2:
                        l = this.w3;
                        k = k || c.vwa;
                        u40 = 5;
                        break;
                    case 5:
                        void 0 === l[h] && (l[h] = {});
                        void 0 === l[h][k] && (l[h][k] = new p.cP());
                        l[h][k].add(g, f, e);
                        u40 = 9;
                        break;
                    }
                }
            }
            ;
            c.prototype.start = function(g, f, e) {
                var C9A, h;
                C9A = 2;
                for (; C9A !== 9; ) {
                    switch (C9A) {
                    case 2:
                        h = this.w3;
                        e = e || c.vwa;
                        void 0 === h[f] && (h[f] = {});
                        C9A = 4;
                        break;
                    case 4:
                        void 0 === h[f][e] && (h[f][e] = new p.cP());
                        h[f][e].start(g);
                        C9A = 9;
                        break;
                    }
                }
            }
            ;
            c.prototype.stop = function(g, f, e) {
                var d8E, h;
                d8E = 2;
                for (; d8E !== 4; ) {
                    switch (d8E) {
                    case 2:
                        h = this.w3;
                        e = e || c.vwa;
                        void 0 !== h[f] && void 0 !== h[f][e] && h[f][e].stop(g);
                        d8E = 4;
                        break;
                    }
                }
            }
            ;
            f1e = 4;
            break;
        }
    }
}
)();
b.Iab = t;


// Detected exports: Iab