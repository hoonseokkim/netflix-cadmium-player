/**
 * @module Module_59416
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 59416
 * Deobfuscated size: 1350 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 59416
{
                        var d, p, c, g, f, e;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.storage = undefined;
                        d = a(29204);
                        p = a(33096);
                        c = a(50350);
                        t = a(36129);
                        g = a(75876);
                        f = a(19630);
                        e = a(31276);
                        a = a(11479);
                        b.storage = b.storage || undefined;
                        e.Za.get(a.vk).register(t.ea.oeb, function(h) {
                            var k;
                            switch (d.config.v_c) {
                            case "idb":
                                k = g.r_c;
                                break;
                            case "none":
                                k = c.t_c;
                                break;
                            case "ls":
                                k = f.s_c;
                            }
                            k(function(l) {
                                l.success ? (b.storage = l.storage,
                                h(p.ai)) : h(l);
                            });
                        });
                    }
