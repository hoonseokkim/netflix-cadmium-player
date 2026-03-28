/**
 * @module Module_37353
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 37353
 * Deobfuscated size: 6476 chars
 * Functions: 7
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 37353
{
                        var h, k, l, m, n;
                        function d(q) {
                            var r, v;
                            (0,
                            k.jaa)(q);
                            if ((0,
                            m.Ri)(q) && b.xeb.test(q)) {
                                r = q.split(".");
                                if (4 === r.length) {
                                    for (var u = 0; u < r.length; u++) {
                                        v = (0,
                                        n.wm)(r[u]);
                                        if (0 > v || !(0,
                                        m.EM)(v, 0, 255) || 1 !== r[u].length && 0 === r[u].indexOf("0"))
                                            return;
                                    }
                                    return q;
                                }
                            }
                        }
                        function p(q) {
                            var r;
                            r = 0;
                            if (d(q) === q)
                                return (q = q.split("."),
                                r += (0,
                                n.wm)(q[0]) << 24,
                                r += (0,
                                n.wm)(q[1]) << 16,
                                r += (0,
                                n.wm)(q[2]) << 8,
                                r + (0,
                                n.wm)(q[3]));
                        }
                        function c(q) {
                            var r, u;
                            (0,
                            k.jaa)(q);
                            if ((0,
                            m.Ri)(q) && q.match(b.yeb)) {
                                r = q.split(":");
                                -1 !== r[r.length - 1].indexOf(".") && (q = g(r[r.length - 1]),
                                r.pop(),
                                r.push(q[0]),
                                r.push(q[1]),
                                q = r.join(":"));
                                q = q.split("::");
                                if (!(2 < q.length || 1 === q.length && 8 !== r.length) && (r = 1 < q.length ? f(q) : r,
                                q = r.length,
                                8 === q)) {
                                    for (; q--; ) {
                                        u = parseInt(r[q], 16);
                                        if (!(0,
                                        m.EM)(u, 0, h.lgb))
                                            return;
                                    }
                                    return r.join(":");
                                }
                            }
                        }
                        function g(q) {
                            var r;
                            q = p(q) >>> 0;
                            r = [];
                            r.push((q >>> 16 & 65535).toString(16));
                            r.push((q & 65535).toString(16));
                            return r;
                        }
                        function f(q) {
                            var r, u, v;
                            r = q[0].split(":");
                            q = q[1].split(":");
                            1 === r.length && "" === r[0] && (r = []);
                            1 === q.length && "" === q[0] && (q = []);
                            u = 8 - (r.length + q.length);
                            if (1 > u)
                                return [];
                            for (v = 0; v < u; v++)
                                r.push("0");
                            for (v = 0; v < q.length; v++)
                                r.push(q[v]);
                            return r;
                        }
                        function e(q) {
                            return -1 << 32 - q;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.AP = b.yeb = b.xeb = undefined;
                        b.T8c = d;
                        b.P8c = p;
                        b.U8c = c;
                        b.R8c = g;
                        b.S8c = f;
                        b.V8c = function(q, r, u) {
                            var v, w, x, y;
                            v = d(q);
                            w = c(q);
                            x = d(r);
                            y = c(r);
                            if (!v && !w || !x && !y || v && !x || w && !y)
                                return false;
                            if (q === v)
                                return (u = e(u),
                                (p(q) & u) !== (p(r) & u) ? false : true);
                            if (q === w) {
                                q = q.split(":");
                                r = r.split(":");
                                for (v = (0,
                                l.uX)(u / b.AP.length); v--; )
                                    if (q[v] !== r[v])
                                        return false;
                                u %= b.AP.length;
                                if (0 !== u)
                                    for ((q = parseInt(q[v], 16).toString(2),
                                    r = parseInt(r[v], 16).toString(2),
                                    q = b.AP.substring(0, b.AP.length - q.length) + q,
                                    r = b.AP.substring(0, b.AP.length - r.length) + r,
                                    v = 0); v < u; v++)
                                        if (q[v] !== r[v])
                                            return false;
                                return true;
                            }
                            return false;
                        }
                        ;
                        b.Q8c = e;
                        h = a(33096);
                        k = a(45146);
                        l = a(22365);
                        m = a(32687);
                        n = a(3887);
                        b.xeb = /^[0-9.]*$/;
                        b.yeb = /^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/;
                        b.AP = "0000000000000000";
                    }
