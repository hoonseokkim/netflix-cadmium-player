/**
 * @module Module_61520
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 61520
 * Deobfuscated size: 15323 chars
 * Functions: 42
 * Prototype definitions: 22
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 61520
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.pma = undefined;
                        b.eRc = function(g, f) {
                            var e;
                            e = "";
                            g.SL(function(h, k, l, m) {
                                e += ("").concat(Array(m + 1).join("-")).concat(f(h), "\n");
                                return true;
                            });
                            return e;
                        }
                        ;
                        a(22970);
                        a(91176);
                        d = a(48170);
                        p = a(29254);
                        c = a(52571);
                        t = (function() {
                            function g() {
                                this.W = new p.RJa();
                            }
                            Object.defineProperties(g.prototype, {
                                empty: {
                                    get: function() {
                                        return !this.zF;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(g.prototype, {
                                root: {
                                    get: function() {
                                        var f;
                                        return null === (f = this.zF) || undefined === f ? undefined : f.value;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(g.prototype, {
                                values: {
                                    get: function() {
                                        var f;
                                        f = [];
                                        this.SL(function(e) {
                                            return !!f.push(e);
                                        });
                                        return f;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            g.prototype.has = function(f) {
                                return !!this.W.get(f);
                            }
                            ;
                            g.prototype.parent = function(f) {
                                var e;
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "Attempted to find the parent of a node not in the tree");
                                return null === (e = null === f || undefined === f ? undefined : f.parent) || undefined === e ? undefined : e.value;
                            }
                            ;
                            g.prototype.children = function(f) {
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "Attempted to find the children of a node not in the tree");
                                return (null === f || undefined === f ? 0 : f.children) ? f.children.map(function(e) {
                                    return e.value;
                                }) : [];
                            }
                            ;
                            g.prototype.$sa = function(f) {
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "Attempted to find the children of a node not in the tree");
                                return undefined !== (null === f || undefined === f ? undefined : f.children) && 0 < f.children.length;
                            }
                            ;
                            g.prototype.add = function(f, e) {
                                var h;
                                d.u && (0,
                                c.assert)(!this.W.get(f), "Attempted to add a value to tree that is already present");
                                h = {
                                    value: f
                                };
                                undefined === this.zF ? (d.u && (0,
                                c.assert)(undefined === e, "a parent cannot be specified when the tree is empty"),
                                this.zF = h) : (d.u && (0,
                                c.assert)(undefined !== e, "a parent must be specified when the tree is non-empty"),
                                e = this.W.get(e),
                                d.u && (0,
                                c.assert)(e, "Parent value does not exist in tree"),
                                this.woa(h, e));
                                this.W.set(f, h);
                                return this;
                            }
                            ;
                            g.prototype.remove = function(f) {
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "Attempted to remove a node not in the tree");
                                this.removeNode(f);
                                return this;
                            }
                            ;
                            g.prototype.removeNode = function(f) {
                                var e;
                                e = this;
                                this.oUa(function(h) {
                                    return e.W.delete(h);
                                }, f.value);
                                undefined === f.parent ? this.zF = undefined : this.detach(f);
                            }
                            ;
                            g.prototype.move = function(f, e) {
                                f = this.W.get(f);
                                e = this.W.get(e);
                                d.u && (0,
                                c.assert)(f, "cannot move a value that is not in the tree");
                                d.u && (0,
                                c.assert)(e, "cannot move a value to a parent value not in the tree");
                                d.u && (0,
                                c.assert)(null === f || undefined === f ? undefined : f.parent, "cannot move the root node");
                                d.u && (0,
                                c.assert)(!this.lDc(f, e), "cannot move a node below itself or one of its decendants");
                                f.parent !== e && (this.detach(f),
                                this.woa(f, e));
                                return this;
                            }
                            ;
                            g.prototype.$Tc = function(f) {
                                var e, h;
                                e = this;
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "cannot replant at a value that is not in the tree");
                                h = [];
                                this.detach(f);
                                this.oUa(function(k) {
                                    e.W.delete(k);
                                    h.unshift(k);
                                    return true;
                                });
                                this.zF = f;
                            }
                            ;
                            g.prototype.clear = function() {
                                this.zF && this.remove(this.zF.value);
                                return this;
                            }
                            ;
                            g.prototype.clone = function() {
                                var f;
                                f = new g();
                                this.SL(function(e, h) {
                                    f.add(e, h);
                                    return true;
                                });
                                return f;
                            }
                            ;
                            g.prototype.HAb = function(f, e) {
                                var h, k;
                                h = this;
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "cannot iterate children of a value not in the tree");
                                null === (k = f.children) || undefined === k ? undefined : k.forEach(function(l) {
                                    return e(l.value, h);
                                });
                            }
                            ;
                            g.prototype.uZc = function(f, e) {
                                var h, k;
                                h = this;
                                f = this.W.get(f);
                                d.u && (0,
                                c.assert)(f, "cannot iterate children of a value not in the tree");
                                return !(null === (k = f.children) || undefined === k || !k.some(function(l) {
                                    return e(l.value, h);
                                }));
                            }
                            ;
                            g.prototype.SL = function(f) {
                                this.IAb(f, undefined);
                            }
                            ;
                            g.prototype.IAb = function(f, e, h, k) {
                                var l;
                                l = this;
                                undefined === k && (k = 0);
                                d.u && (0,
                                c.assert)(!this.empty || undefined === e, "cannot iterate from a value on an empty tree");
                                this.empty || (e = null !== e && undefined !== e ? e : this.zF.value,
                                f(e, h, this, k) && this.HAb(e, function(m) {
                                    return l.IAb(f, m, e, k + 1);
                                }));
                            }
                            ;
                            g.prototype.oUa = function(f, e) {
                                var h;
                                h = this;
                                d.u && (0,
                                c.assert)(!this.empty || undefined === e, "cannot iterate from a value on an empty tree");
                                this.empty || (null !== e && undefined !== e ? e : e = this.zF.value,
                                this.HAb(e, function(k) {
                                    return h.oUa(f, k);
                                }),
                                f(e, this));
                            }
                            ;
                            g.prototype.kAb = function(f, e) {
                                var h, k;
                                h = this;
                                d.u && (0,
                                c.assert)(!this.empty || undefined === e, "cannot iterate from a value on an empty tree");
                                if (!this.empty) {
                                    null !== e && undefined !== e ? e : e = this.zF.value;
                                    return this.uZc(e, function(l) {
                                        return !!(k = h.kAb(f, l));
                                    }) ? k : f(e, this) ? e : undefined;
                                }
                            }
                            ;
                            g.prototype.Gxb = function(f) {
                                var e, h, k, l;
                                e = this;
                                h = this.values;
                                k = h.filter(function(m) {
                                    return !f.has(m);
                                });
                                l = f.values.filter(function(m) {
                                    return !e.has(m);
                                });
                                h = h.filter(function(m) {
                                    return f.has(m) && e.parent(m) !== f.parent(m);
                                });
                                return {
                                    NY: k,
                                    mz: l,
                                    c4a: h
                                };
                            }
                            ;
                            g.prototype.compare = function(f) {
                                var e, h;
                                f = this.Gxb(f);
                                e = f.mz;
                                h = f.c4a;
                                return 0 === f.NY.length && 0 === e.length && 0 === h.length;
                            }
                            ;
                            g.prototype.woa = function(f, e) {
                                f.parent = e;
                                (e.children || (e.children = [])).push(f);
                            }
                            ;
                            g.prototype.detach = function(f) {
                                var e;
                                d.u && (0,
                                c.assert)(f.parent, "cannot detach the root");
                                d.u && (0,
                                c.assert)(undefined !== f.parent.children, "logic error: parent node does not have children");
                                e = f.parent.children.indexOf(f);
                                (0,
                                c.assert)(0 <= e, "logic error: node does not appear in the children of its parent");
                                f.parent.children.splice(e, 1);
                                f.parent = undefined;
                            }
                            ;
                            g.prototype.lDc = function(f, e) {
                                for (; undefined !== e; ) {
                                    if (e === f)
                                        return true;
                                    e = e.parent;
                                }
                                return false;
                            }
                            ;
                            return g;
                        }
                        )();
                        b.pma = t;
                    }
