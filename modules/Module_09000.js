/**
 * @module Module_9000
 * @description Webpack module (scientific notation: 9E3)
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 9000 (written as 9E3 in bundle)
 * Deobfuscated size: 11541 chars
 * Functions: 20
 * Prototype definitions: 18
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 9000
{
                        var d, p, c, g, f;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.nj = undefined;
                        d = a(22970).__importDefault(a(6838));
                        p = a(48235);
                        c = a(21399);
                        g = a(77633);
                        f = a(46383);
                        t = (function() {
                            function e(h) {
                                undefined === h && (h = null);
                                this.map = {};
                                if (h)
                                    for (var k in h) {
                                        if (!(k instanceof String) && "string" !== typeof k)
                                            throw new TypeError("Map key is not a string.");
                                        this.put(k, h[k]);
                                    }
                            }
                            e.prototype.get = function(h) {
                                var k;
                                h instanceof String && (h = h.valueOf());
                                if ("string" !== typeof h)
                                    throw new TypeError("Unsupported key.");
                                k = this.map[h];
                                if (null === k || undefined === k)
                                    throw new d.default("MslObject[" + c.quote(h) + "] not found.");
                                return k instanceof Object && k.constructor === Object ? new e(k) : k instanceof Array ? new g.ml(k) : k;
                            }
                            ;
                            e.prototype.Eba = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof Boolean)
                                    return k.valueOf();
                                if ("boolean" === typeof k)
                                    return k;
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a boolean.");
                            }
                            ;
                            e.prototype.Ed = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof Uint8Array)
                                    return k;
                                throw new d.default("MslObject[" + c.quote(h) + "] is not binary data.");
                            }
                            ;
                            e.prototype.xS = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof Number)
                                    return k.valueOf() << 0;
                                if ("number" === typeof k)
                                    return k << 0;
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a number.");
                            }
                            ;
                            e.prototype.YVa = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof g.ml)
                                    return k;
                                if (k instanceof Array)
                                    return new g.ml(k);
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a MslArray.");
                            }
                            ;
                            e.prototype.Yq = function(h, k) {
                                var l;
                                l = this.get(h);
                                if (l instanceof e)
                                    return l;
                                if (l instanceof Object && l.constructor === Object)
                                    return new e(l);
                                if (l instanceof Uint8Array)
                                    try {
                                        return k.Qp(l);
                                    } catch (m) {
                                        if (m instanceof d.default)
                                            throw new d.default("MslObject[" + c.quote(h) + "] is not a MslObject.");
                                        throw m;
                                    }
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a MslObject.");
                            }
                            ;
                            e.prototype.Eo = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof Number)
                                    return parseInt(k.valueOf());
                                if ("number" === typeof k)
                                    return k;
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a number.");
                            }
                            ;
                            e.prototype.Be = function(h) {
                                var k;
                                k = this.get(h);
                                if (k instanceof String)
                                    return k.valueOf();
                                if ("string" === typeof k)
                                    return k;
                                throw new d.default("MslObject[" + c.quote(h) + "] is not a string.");
                            }
                            ;
                            e.prototype.has = function(h) {
                                if ("string" !== typeof h)
                                    throw new TypeError("Null key.");
                                return this.map.hasOwnProperty(h);
                            }
                            ;
                            e.prototype.Hf = function(h) {
                                h instanceof String && (h = h.valueOf());
                                if ("string" !== typeof h)
                                    throw new TypeError("Unsupported key.");
                                h = this.map[h];
                                try {
                                    if (h instanceof Object && h.constructor === Object)
                                        return new e(h);
                                    if (h instanceof Array)
                                        return new g.ml(h);
                                } catch (k) {
                                    if (h instanceof TypeError)
                                        return null;
                                }
                                return h;
                            }
                            ;
                            e.prototype.oxa = function(h) {
                                h = this.Hf(h);
                                return h instanceof g.ml ? h : h instanceof Array ? new g.ml(h) : null;
                            }
                            ;
                            e.prototype.ffa = function(h, k) {
                                h = this.Hf(h);
                                return h instanceof String ? h.valueOf() : "string" === typeof h ? h : k instanceof String ? k.valueOf() : "string" === typeof k || null === k ? k : "";
                            }
                            ;
                            e.prototype.put = function(h, k) {
                                h instanceof String && (h = h.valueOf());
                                if ("string" !== typeof h)
                                    throw new TypeError("Unsupported key.");
                                if (null === k)
                                    return (delete this.map[h],
                                    this);
                                if (k instanceof Boolean || "boolean" === typeof k || k instanceof Uint8Array || k instanceof Number || "number" === typeof k || k instanceof e || k instanceof g.ml || k instanceof String || "string" === typeof k || k instanceof p.fp)
                                    this.map[h] = k;
                                else if (k instanceof Object && k.constructor === Object)
                                    this.map[h] = new e(k);
                                else if (k instanceof Array)
                                    this.map[h] = new g.ml(k);
                                else
                                    throw new TypeError("Value [" + typeof k + "] is an unsupported type.");
                                return this;
                            }
                            ;
                            e.prototype.remove = function(h) {
                                var k;
                                h instanceof String && (h = h.valueOf());
                                if ("string" !== typeof h)
                                    throw new TypeError("Unsupported key.");
                                k = this.Hf(h);
                                delete this.map[h];
                                return k;
                            }
                            ;
                            e.prototype.Xba = function() {
                                return Object.keys(this.map);
                            }
                            ;
                            e.prototype.xCb = function() {
                                var h, k;
                                h = {};
                                for (k in this.map)
                                    h[k] = this.map[k];
                                return h;
                            }
                            ;
                            e.prototype.equals = function(h) {
                                if (this == h)
                                    return true;
                                if (!(h instanceof e))
                                    return false;
                                try {
                                    return f.azb(this, h);
                                } catch (k) {
                                    if (k instanceof d.default)
                                        return false;
                                    throw k;
                                }
                            }
                            ;
                            e.prototype.toString = function() {
                                var m, n;
                                for (var h = "{", k = Object.keys(this.map), l = 0; l < k.length; l++) {
                                    m = k[l];
                                    n = this.map[m];
                                    h = n instanceof e || n instanceof g.ml ? h + (c.quote(m) + ":{}") : h + (c.quote(m) + ":" + c.stringify(n));
                                    l != k.length - 1 && (h += ",");
                                }
                                return h + "}";
                            }
                            ;
                            return e;
                        }
                        )();
                        b.nj = t;
                    }
