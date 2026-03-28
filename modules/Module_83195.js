/**
 * @module Module_83195
 * @description Class/prototype module
 * @categories Network, Manifest, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 83195
 * Deobfuscated size: 16390 chars
 * Functions: 32
 * Prototype definitions: 18
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 83195
{
                        var f;
                        function d() {
                            return Object.create(null);
                        }
                        function p(e) {
                            this.log = e.log;
                            this.Qa = e.Qa;
                            this.Xy = d();
                            this.Promise = e.Promise;
                            this.op = e.op;
                            this.GJ = e.GJ;
                            this.xE = e.xE || false;
                            this.oaa = d();
                            this.FD = d();
                            this.fR = d();
                            this.f2a = false;
                            this.n$b(e);
                            e.yp && (this.yp = e.yp);
                        }
                        function c(e) {
                            return "undefined" !== typeof e;
                        }
                        function g(e) {
                            var l;
                            for (var h = 0, k = arguments.length; h < k; ) {
                                l = arguments[h++];
                                if (c(l))
                                    return l;
                            }
                        }
                        a(85852);
                        f = a(46601);
                        p.prototype.n$b = function(e) {
                            this.oaa.manifest = g(e.ksc, f.hS.S);
                            this.oaa.ldl = g(e.jsc, f.hS.Gda);
                            this.oaa.metadata = g(e.Wed, f.hS.xa);
                            this.FD.manifest = g(e.gfc, f.FD.S);
                            this.FD.ldl = g(e.ffc, f.FD.Gda);
                            this.FD.metadata = g(e.Mcd, f.FD.xa);
                            this.fR.manifest = g(e.Kcd, f.fR.S);
                            this.fR.ldl = g(e.Jcd, f.fR.Gda);
                            this.fR.metadata = g(e.Lcd, f.fR.xa);
                        }
                        ;
                        p.prototype.zca = function(e, h) {
                            this.ow("undefined" !== typeof e);
                            this.ow("undefined" !== typeof h);
                            return !!this.Aob(e, h, undefined).value;
                        }
                        ;
                        p.prototype.Aob = function(e, h, k) {
                            var l, m;
                            l = {
                                value: null,
                                reason: "",
                                log: ""
                            };
                            m = this.Xy[h];
                            k = k ? k : "DEFAULTCAPS";
                            if ("undefined" === typeof m)
                                return (l.log = "cache miss: no data exists for field:" + h,
                                l.reason = "unavailable",
                                l);
                            "undefined" === typeof m[e] ? (l.log = "cache miss: no data exists for movieId:" + e,
                            l.reason = "unavailable") : (m = m[e][k]) && m.value ? this.fna(m) ? (l.log = "cache miss: " + h + " data expired for movieId:" + e,
                            l.reason = "expired",
                            this.clearData(e, h, k, false, "expired")) : (l.log = this.Promise && m.value instanceof this.Promise ? "cache hit: " + h + " request in flight for movieId:" + e : "cache hit: " + h + " available for movieId:" + e,
                            l.value = m.value) : (l.log = "cache miss: " + h + " data not available for movieId:" + e,
                            l.reason = "unavailable");
                            return l;
                        }
                        ;
                        p.prototype.getData = function(e, h, k) {
                            this.ow("undefined" !== typeof e);
                            this.ow("undefined" !== typeof h);
                            e = this.Aob(e, h, k);
                            this.log.trace(e.log);
                            return e.value ? this.Promise ? e.value instanceof this.Promise ? e.value : Promise.resolve(e.value) : this.GJ ? JSON.parse(this.GJ(e.value, "gzip", false)) : e.value : this.Promise ? Promise.reject(e.reason) : e.reason;
                        }
                        ;
                        p.prototype.setData = function(e, h, k, l, m, n) {
                            var q, r, u;
                            this.ow("undefined" !== typeof e);
                            this.ow("undefined" !== typeof h);
                            q = this.Xy;
                            r = m ? m : "DEFAULTCAPS";
                            q[h] || (q[h] = d(),
                            Object.defineProperty(q[h], "numEntries", {
                                enumerable: false,
                                configurable: true,
                                writable: true,
                                value: 0
                            }),
                            Object.defineProperty(q[h], "size", {
                                enumerable: false,
                                configurable: true,
                                writable: true,
                                value: 0
                            }));
                            k = this.op ? this.op(JSON.stringify(k), "gzip", true) : k;
                            q = q[h];
                            this.c9b(e, h, r, q);
                            u = this;
                            n = n || this.oaa[h] + 1;
                            l = {
                                creationTime: this.Qa.getTime(),
                                value: k,
                                size: 0,
                                type: h,
                                uSa: l,
                                hS: n,
                                LTa: setTimeout(function() {
                                    u.clearData(e, h, r, false, "expired");
                                }, n)
                            };
                            q[e] = q[e] || d();
                            q[e][r] = q[e][r] || d();
                            q[e][r] = l;
                            q.size += 0;
                            q.numEntries++;
                            this.yp && this.yp.emit("addedCacheItem", l);
                            return l;
                        }
                        ;
                        p.prototype.dub = function(e, h) {
                            var k, l, m, n;
                            l = Number.POSITIVE_INFINITY;
                            m = this;
                            Object.keys(e).every(function(q) {
                                var r;
                                r = e[q] && e[q][h];
                                r && r.value && m.fna(r) && (n = q);
                                r && r.value && r.creationTime < l && (l = r.creationTime,
                                k = q);
                                return true;
                            });
                            return n || k;
                        }
                        ;
                        p.prototype.c9b = function(e, h, k, l) {
                            var m, n, q, r, u;
                            m = l.numEntries;
                            n = this.FD[h];
                            q = l[e] && l[e][k];
                            if (q && q.value)
                                (r = e,
                                u = "promise_or_expired");
                            else
                                m >= n && !this.f2a && (r = this.dub(l, k),
                                u = "cache_full");
                            this.xE && this.log.debug("makespace ", {
                                maxCount: n,
                                currentCount: l.numEntries,
                                field: h,
                                movieId: e,
                                movieToBeRemoved: r
                            });
                            r && (this.clearData(r, h, k, undefined, u),
                            this.log.debug("removed from cache: ", r, h));
                        }
                        ;
                        p.prototype.DQa = function(e, h) {
                            var k, l;
                            k = this;
                            k.ow("undefined" !== typeof e);
                            l = e + "";
                            h.forEach(function(m) {
                                var n;
                                n = k.Xy[m];
                                n && Object.keys(n).forEach(function(q) {
                                    q != l && k.clearData(q, m, undefined, undefined, "clear_all");
                                });
                            });
                        }
                        ;
                        p.prototype.clearData = function(e, h, k, l, m) {
                            var n;
                            this.ow("undefined" !== typeof e);
                            this.ow("undefined" !== typeof h);
                            n = this.Xy[h];
                            h = n ? n[e] : undefined;
                            k = k ? k : "DEFAULTCAPS";
                            if (h && h[k]) {
                                n.size -= h[k].size;
                                n.numEntries--;
                                if (n = h && h[k])
                                    (clearTimeout(n.LTa),
                                    h[k] = undefined,
                                    !l && n.uSa && n.uSa());
                                this.yp && (e = {
                                    creationTime: n.creationTime,
                                    destroyFn: n.uSa,
                                    size: n.size,
                                    type: n.type,
                                    value: n.value,
                                    reason: m,
                                    movieId: e
                                },
                                this.yp.emit("deletedCacheItem", e));
                            }
                        }
                        ;
                        p.prototype.uWb = function(e, h, k, l) {
                            var m, n, q;
                            this.ow("undefined" !== typeof e);
                            this.ow("undefined" !== typeof h);
                            m = this;
                            n = this.Xy[h];
                            n = n ? n[e] : undefined;
                            q = k ? k : "DEFAULTCAPS";
                            k = n && n[q];
                            l = l || this.oaa[h] + 1;
                            k && (clearTimeout(k.LTa),
                            k.creationTime = this.Qa.getTime(),
                            k.hS = l,
                            k.LTa = setTimeout(function() {
                                m.clearData(e, h, q, false, "expired");
                            }, l));
                        }
                        ;
                        p.prototype.flush = function(e) {
                            var h;
                            this.ow("undefined" !== typeof e);
                            h = this.Xy;
                            h[e] = d();
                            h[e].numEntries = 0;
                            h[e].size = 0;
                        }
                        ;
                        p.prototype.nub = function() {
                            var e, h;
                            this.ow(false);
                            e = this;
                            h = this.Xy;
                            h[undefined]instanceof Object && Object.keys(h[undefined]).forEach(function(k) {
                                var l;
                                l = h[undefined][k].DEFAULTCAPS;
                                e.Qa.getTime() - l.creationTime > l.hS && e.clearData(k, undefined, "DEFAULTCAPS", undefined, "clean_up");
                            });
                        }
                        ;
                        p.prototype.fna = function(e) {
                            return this.Qa.getTime() - e.creationTime > e.hS;
                        }
                        ;
                        p.prototype.getStats = function(e, h, k) {
                            var l, m, n, q, r;
                            l = {};
                            m = this;
                            n = m.Xy;
                            q = c(e) && c(h);
                            r = k || "DEFAULTCAPS";
                            Object.keys(n).forEach(function(u) {
                                var v, w;
                                v = Object.keys(n[u]);
                                w = n[u];
                                v.forEach(function(x) {
                                    !(x = w && w[x] && w[x][r]) || !c(x.value) || x.value instanceof m.Promise || (l[u] = (l[u] | 0) + 1,
                                    m.fna(x) && (l[u + "_expired"] = (l[u + "_expired"] | 0) + 1),
                                    q && x.creationTime >= e && x.creationTime < h && (l[u + "_delta"] = (l[u + "_delta"] | 0) + 1));
                                });
                            });
                            return l;
                        }
                        ;
                        p.prototype.getState = function(e) {
                            var h, k, l, m;
                            h = [];
                            k = this;
                            l = k.Xy;
                            m = e || "DEFAULTCAPS";
                            Object.keys(l).forEach(function(n) {
                                var q, r;
                                q = Object.keys(l[n]);
                                r = l[n];
                                q.forEach(function(u) {
                                    var v, w;
                                    v = r && r[u] && r[u][m];
                                    if (v && c(v.value)) {
                                        w = k.fna(v) ? "expired" : v.value instanceof k.Promise ? "loading" : "cached";
                                        h.push({
                                            movieId: u,
                                            state: w,
                                            type: n,
                                            size: v.size
                                        });
                                    }
                                });
                            });
                            return h;
                        }
                        ;
                        p.prototype.OXc = function() {
                            this.f2a = true;
                        }
                        ;
                        p.prototype.jVc = function() {
                            var e;
                            for (this.f2a = false; this.Xy.manifest.numEntries > this.FD.manifest; ) {
                                e = this.dub(this.Xy.manifest, undefined);
                                this.clearData(e, "manifest", undefined, undefined, "eviction");
                                this.log.debug("removed from cache: ", e, "manifest");
                                this.xE && this.log.debug("makespace ", {
                                    maxCount: this.FD.manifest,
                                    currentCount: this.Xy.manifest.numEntries,
                                    field: "manifest",
                                    movieToBeRemoved: e
                                });
                            }
                        }
                        ;
                        p.prototype.ow = function(e) {
                            if (!e && (this.log.error("Debug Assert Failed", undefined),
                            this.xE))
                                throw Error("Debug Assert Failed ");
                        }
                        ;
                        t.exports = p;
                    }
