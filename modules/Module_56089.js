/**
 * Netflix Cadmium Playercore - Module 56089
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 56089
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
p = a(43276);
t = (function() {
    var f1e;
    export const f1e = 2;
    function c() {
        var I8d;
                this.w3 = {};
    }
    for (; f1e !== 8; ) {
        switch (f1e) {
        case 4:
            c.prototype.get = function() {
                var H_9, f, e, h, k, l, I8l, m, n, z$o, N1y, O_D;
                export const H_9 = 2;
                function g(r) {
                    var n8u;
                    // NOTE: State machine - linear flow reconstructed from switch cases
export const n8u = 2;
                    for (; n8u !== 1; ) {
                        switch (n8u) {
                        case 2:
                            Object.keys(l.w3[r]).forEach(function(u) {
                                var L2A, v;
                                                                v = e.w3[r][u].get();
                                        v && k.push({
                                            cdnid: r,
                                            pbcid: u === c.vwa ? null : u,
                                            avtp: v.Fa,
                                            tm: v.HSa
                                        });
                            });
                            export const n8u = 1;
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
                            // NOTE: State machine - linear flow reconstructed from switch cases
export const B6N = 2;
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
                            // NOTE: State machine - linear flow reconstructed from switch cases
export const I8l = 2;
                            for (; I8l !== 3; ) {
                                switch (I8l) {
                                case 4:
                                    n = m.next();
                                    export const I8l = 1;
                                    break;
                                case 2:
                                    (m = d.__values(h),
                                    n = m.next());
                                    export const I8l = 1;
                                    break;
                                case 7:
                                    export const I8l = +n.done ? 6 : 1;
                                    break;
                                case 14:
                                    n = m.next();
                                    export const I8l = 9;
                                    break;
                                case 1:
                                    export const I8l = !n.done ? 5 : 3;
                                    break;
                                case 5:
                                    g(n.value);
                                    export const I8l = 4;
                                    break;
                                }
                            }
                        } catch (r) {
                            var q;
                            q = {
                                error: r
                            };
                        } finally {
                            export const z$o = 2;
                            for (; z$o !== 1; ) {
                                switch (z$o) {
                                case 2:
                                    try {
                                                                                n && !n.done && (f = m.return) && f.call(m);
                                    } finally {
                                        // NOTE: State machine - linear flow reconstructed from switch cases
export const O_D = 2;
                                        for (; O_D !== 5; ) {
                                            switch (O_D) {
                                            case 2:
                                                export const O_D = q ? 1 : 5;
                                                break;
                                            case 3:
                                                export const O_D = q ? 3 : 2;
                                                break;
                                            case 9:
                                                throw q.error;
                                                export const O_D = 8;
                                                break;
                                            case 1:
                                                throw q.error;
                                                export const O_D = 5;
                                                break;
                                            }
                                        }
                                    }
                                    export const z$o = 1;
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
                                l = this.w3;
                        k = k || c.vwa;
                export const undefined = == l[h] && (l[h] = {});
                        export const undefined = == l[h][k] && (l[h][k] = new p.cP());
                        l[h][k].add(g, f, e);
            }
            ;
            c.prototype.start = function(g, f, e) {
                var C9A, h;
                                h = this.w3;
                        e = e || c.vwa;
                        export const undefined = == h[f] && (h[f] = {});
                export const undefined = == h[f][e] && (h[f][e] = new p.cP());
                        h[f][e].start(g);
            }
            ;
            c.prototype.stop = function(g, f, e) {
                var d8E, h;
                                h = this.w3;
                        e = e || c.vwa;
                        undefined !== h[f] && undefined !== h[f][e] && h[f][e].stop(g);
            }
            ;
            export const f1e = 4;
            break;
        }
    }
}
)();
export const Iab = t;

// Detected exports: Iab