/**
 * @module Module_92623
 * @description Class/prototype module
 * @categories DRM, Network, Media, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 92623
 * Deobfuscated size: 6152 chars
 * Functions: 20
 * Prototype definitions: 11
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 92623
{
                        var e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B;
                        function d(C, D, E) {
                            this.Cd = C;
                            this.groups = D;
                            this.GK = E;
                            C = v(C, D, E);
                            this.info = C.info.bind(C);
                            this.fatal = C.fatal.bind(C);
                            this.error = C.error.bind(C);
                            this.warn = C.warn.bind(C);
                            this.trace = C.trace.bind(C);
                            this.debug = C.debug.bind(C);
                            this.log = C.log.bind(C);
                        }
                        function p() {}
                        function c() {}
                        function g() {
                            return u ? u : "0.0.0.0";
                        }
                        function f(C) {
                            C({
                                Yjd: 0,
                                hmd: 0,
                                xgd: 0,
                                afd: 0
                            });
                        }
                        e = a(90745);
                        p.prototype.set = function(C, D) {
                            l[C] = D;
                            m.save(C, D);
                        }
                        ;
                        p.prototype.get = function(C, D) {
                            if (l.hasOwnProperty(C))
                                return l[C];
                            r.trace("key: " + C + ", is not available in storage cache and needs to be retrieved asynchronously");
                            m.load(C, function(E) {
                                E.success ? (l[C] = E.data,
                                D && D(E.data)) : l[C] = undefined;
                            });
                        }
                        ;
                        p.prototype.remove = function(C) {
                            m.remove(C);
                        }
                        ;
                        p.prototype.clear = function() {
                            r.info("WARNING: Calling unimplemented function Storage.clear()");
                        }
                        ;
                        c.prototype.now = function() {
                            return n();
                        }
                        ;
                        c.prototype.fa = function() {
                            return q();
                        }
                        ;
                        c.prototype.$va = function(C) {
                            return C + n() - q();
                        }
                        ;
                        c.prototype.Mwa = function(C) {
                            return C + q() - n();
                        }
                        ;
                        d.prototype.JRa = function(C) {
                            var D;
                            D = [];
                            this.GK && Array.isArray(this.GK) ? D.push.apply(D, Ba(this.GK)) : this.GK && D.push(this.GK);
                            D.push(C);
                            return new d(this.Cd,this.groups,D);
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            prefix: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return Array.isArray(this.GK) ? this.GK.join(" ") : this.GK;
                                }
                            }
                        });
                        w = (function() {
                            var C;
                            C = Promise;
                            C.prototype.fail = Promise.prototype.catch;
                            return C;
                        }
                        )();
                        t.exports = function(C) {
                            h = C.Wxa;
                            v = C.An;
                            m = C.storage;
                            l = C.kT;
                            n = C.cyc;
                            q = C.getTime;
                            r = C.ucc;
                            x = C.Bi;
                            B = C.Pm;
                            y = C.k6;
                            A = C.SourceBuffer;
                            z = C.MediaSource;
                            u = C.Zgd;
                            k = C.SD;
                            return {
                                name: "cadmium",
                                SD: k,
                                Wxa: h,
                                storage: new p(),
                                Storage: p,
                                time: new c(),
                                events: new e.EventEmitter(),
                                console: new d("JS-ASE",undefined,"default"),
                                Console: d,
                                options: {},
                                Promise: w,
                                Bi: x,
                                k6: y,
                                v9c: A,
                                MediaSource: z,
                                Pm: B,
                                TE: {
                                    name: g
                                },
                                memory: {
                                    Qfd: f
                                },
                                C0: C.C0,
                                aqa: C.aqa,
                                AL: C.AL,
                                $qa: C.$qa,
                                ping: function(D) {
                                    fetch(D).catch(function() {});
                                }
                            };
                        }
                        ;
                    }
