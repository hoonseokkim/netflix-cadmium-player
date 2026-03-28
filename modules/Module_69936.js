/**
 * @module Module_69936
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 69936
 * Deobfuscated size: 3675 chars
 * Functions: 2
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 69936
{
                        var p, c, g, f, e;
                        function d(h, k) {
                            this.is = h;
                            this.json = k;
                            (0,
                            c.Rw)(this, "json");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.kFa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(66523);
                        g = a(63368);
                        f = a(5021);
                        a = a(42207);
                        d.prototype.parse = function(h) {
                            var l;
                            h = this.json.parse(h);
                            if (!this.is.YNa(h))
                                throw Error("FtlProbe: param: not an object");
                            if (h.next && !this.is.t9(h.next))
                                throw Error("FtlProbe: param.next: not a positive integer");
                            if (!this.is.t9(h.pulses))
                                throw Error("FtlProbe: param.pulses: not a positive integer");
                            if (h.pulse_delays && !this.is.SQ(h.pulse_delays))
                                throw Error("FtlProbe: param.pulse_delays: not an array");
                            if (!this.is.t9(h.pulse_timeout))
                                throw Error("FtlProbe: param.pulse_timeout: not a positive integer");
                            if (!this.is.SQ(h.urls))
                                throw Error("FtlProbe: param.urls: not an array");
                            if (!this.is.Zx(h.logblob))
                                throw Error("FtlProbe: param.logblob: not a string");
                            if (!this.is.N9(h.ctx))
                                throw Error("FtlProbe: param.ctx: not an object");
                            for (var k = 0; k < h.urls.length; ++k) {
                                l = h.urls[k];
                                if (!this.is.YNa(l))
                                    throw Error("FtlProbe: param.urls[" + k + "]: not an object");
                                if (!this.is.du(l.name))
                                    throw Error("FtlProbe: param.urls[" + k + "].name: not a string");
                                if (!this.is.du(l.method))
                                    throw Error("FtlProbe: param.urls[" + k + "].method: not a string");
                                if (!this.is.du(l.url))
                                    throw Error("FtlProbe: param.urls[" + k + "].url: not a string");
                            }
                            return {
                                dSc: h.pulses,
                                VOb: h.pulse_delays ? h.pulse_delays.map(f.pc) : [],
                                cSc: (0,
                                f.pc)(h.pulse_timeout),
                                SGb: h.next ? (0,
                                f.pc)(h.next) : undefined,
                                urls: h.urls,
                                l_a: h.logblob,
                                context: h.ctx
                            };
                        }
                        ;
                        e = d;
                        b.kFa = e;
                        b.kFa = e = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(a.Zi)), t.__param(1, (0,
                        p.v)(g.jX))], e);
                    }
