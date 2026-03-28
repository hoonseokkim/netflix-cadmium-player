/**
 * @module Module_84007
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 84007
 * Deobfuscated size: 4647 chars
 * Functions: 10
 * Prototype definitions: 10
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 84007
{
                        var d, p, c, g, f, e;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.iX = undefined;
                        d = a(22970);
                        p = a(66164);
                        c = a(44847);
                        g = a(43529);
                        a(70058);
                        f = a(47061);
                        e = a(36992);
                        t = (function(h) {
                            function k(l, m, n) {
                                m = h.call(this, m, n) || this;
                                m.TVc = l;
                                m.CYa = false;
                                m.Nxa = false;
                                m.reset();
                                return m;
                            }
                            d.__extends(k, h);
                            k.prototype.reset = function() {
                                var l, m;
                                if (this.gb === f.Sm.yr || this.gb === f.Sm.pending)
                                    null === (m = null === (l = this.g_) || undefined === l ? undefined : l.return) || undefined === m ? undefined : m.call(l);
                                h.prototype.reset.call(this);
                                this.g_ = this.TVc();
                                this.Nxa = false;
                                this.Sea = e.ie.Mz(c.I.ia);
                            }
                            ;
                            k.prototype.kd = function() {
                                this.reset();
                                (0,
                                g.assert)(this.XG);
                                this.XG.zga(this);
                            }
                            ;
                            k.prototype.swa = function() {
                                return this.Sea;
                            }
                            ;
                            k.prototype.ef = function() {
                                var l, m, n, q;
                                try {
                                    this.CYa = true;
                                    q = (null === (l = this.g_) || undefined === l ? undefined : l.next()) || ({
                                        done: true
                                    });
                                } finally {
                                    this.CYa = false;
                                    this.JFc = p.platform.time.fa();
                                    this.Wgc();
                                }
                                q.done ? (this.Sea = e.ie.U8a,
                                null === (n = null === (m = this.g_) || undefined === m ? undefined : m.return) || undefined === n ? undefined : n.call(m),
                                this.g_ = undefined) : this.Sea = q.value;
                            }
                            ;
                            k.prototype.Wgc = function() {
                                this.Nxa && this.yxb();
                            }
                            ;
                            k.prototype.yxb = function() {
                                var l, m;
                                this.CYa ? this.Nxa = true : (this.Nxa = false,
                                null === (m = null === (l = this.g_) || undefined === l ? undefined : l.return) || undefined === m ? undefined : m.call(l),
                                this.g_ = undefined);
                            }
                            ;
                            k.prototype.La = function() {
                                this.yxb();
                                h.prototype.La.call(this);
                            }
                            ;
                            k.prototype.Tq = function() {
                                return {
                                    state: f.Sm[this.state],
                                    nextWakeup: {
                                        ms: this.Sea.timestamp.G,
                                        type: e.VP[this.Sea.type]
                                    },
                                    lastRunMono: this.JFc
                                };
                            }
                            ;
                            return k;
                        }
                        )(f.XX);
                        b.iX = t;
                    }
