/**
 * Netflix Cadmium Playercore - Module 17187
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t)
 */

// Webpack module 17187
// Parameters: t (module), exports (exports), N/A (require)


function b() {
    this.uc = this.uc || ({});
    this.pA = this.pA || void 0;
}
function a(p) {
    return "function" === typeof p;
}
function d(p) {
    return "object" === typeof p && null !== p;
}
t.exports = b;
b.EventEmitter = b;
b.prototype.uc = void 0;
b.prototype.pA = void 0;
b.hSa = 10;
b.prototype.setMaxListeners = function(p) {
    if ("number" !== typeof p || 0 > p || isNaN(p))
        throw TypeError("n must be a positive number");
    this.pA = p;
    return this;
}
;
b.prototype.emit = function(p) {
    var c, g, f, e;
    this.uc || (this.uc = {});
    if ("error" === p && (!this.uc.error || d(this.uc.error) && !this.uc.error.length)) {
        g = arguments[1];
        if (g instanceof Error)
            throw g;
        f = Error('Uncaught, unspecified "error" event. (' + g + ")");
        f.context = g;
        throw f;
    }
    f = this.uc[p];
    if (void 0 === f)
        return !1;
    if (a(f))
        switch (arguments.length) {
        case 1:
            f.call(this);
            break;
        case 2:
            f.call(this, arguments[1]);
            break;
        case 3:
            f.call(this, arguments[1], arguments[2]);
            break;
        default:
            (g = Array.prototype.slice.call(arguments, 1),
            f.apply(this, g));
        }
    else if (d(f)) {
        g = Array.prototype.slice.call(arguments, 1);
        e = f.slice();
        f = e.length;
        for (c = 0; c < f; c++)
            e[c].apply(this, g);
    }
    return !0;
}
;
b.prototype.addListener = function(p, c) {
    if (!a(c))
        throw TypeError("listener must be a function");
    this.uc || (this.uc = {});
    this.uc.CKc && this.emit("newListener", p, a(c.listener) ? c.listener : c);
    this.uc[p] ? d(this.uc[p]) ? this.uc[p].push(c) : this.uc[p] = [this.uc[p], c] : this.uc[p] = c;
    d(this.uc[p]) && !this.uc[p].X8a && (c = void 0 === this.pA ? b.hSa : this.pA) && 0 < c && this.uc[p].length > c && (this.uc[p].X8a = !0,
    console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this.uc[p].length),
    "function" === typeof console.trace && console.trace());
    return this;
}
;
b.prototype.on = b.prototype.addListener;
b.prototype.once = function(p, c) {
    var f;
    function g() {
        this.removeListener(p, g);
        f || (f = !0,
        c.apply(this, arguments));
    }
    if (!a(c))
        throw TypeError("listener must be a function");
    f = !1;
    g.listener = c;
    this.on(p, g);
    return this;
}
;
b.prototype.removeListener = function(p, c) {
    var g, f, e;
    if (!a(c))
        throw TypeError("listener must be a function");
    if (!this.uc || !this.uc[p])
        return this;
    g = this.uc[p];
    f = g.length;
    e = -1;
    if (g === c || a(g.listener) && g.listener === c)
        (delete this.uc[p],
        this.uc.removeListener && this.emit("removeListener", p, c));
    else if (d(g)) {
        for (; 0 < f--; )
            if (g[f] === c || g[f].listener && g[f].listener === c) {
                e = f;
                break;
            }
        if (0 > e)
            return this;
        1 === g.length ? (g.length = 0,
        delete this.uc[p]) : g.splice(e, 1);
        this.uc.removeListener && this.emit("removeListener", p, c);
    }
    return this;
}
;
b.prototype.removeAllListeners = function(p) {
    var c;
    if (!this.uc)
        return this;
    if (!this.uc.removeListener)
        return (0 === arguments.length ? this.uc = {} : this.uc[p] && delete this.uc[p],
        this);
    if (0 === arguments.length) {
        for (c in this.uc)
            "removeListener" !== c && this.removeAllListeners(c);
        this.removeAllListeners("removeListener");
        this.uc = {};
        return this;
    }
    c = this.uc[p];
    if (a(c))
        this.removeListener(p, c);
    else if (c)
        for (; c.length; )
            this.removeListener(p, c[c.length - 1]);
    delete this.uc[p];
    return this;
}
;
b.prototype.listeners = function(p) {
    return this.uc && this.uc[p] ? a(this.uc[p]) ? [this.uc[p]] : this.uc[p].slice() : [];
}
;
b.prototype.listenerCount = function(p) {
    if (this.uc) {
        p = this.uc[p];
        if (a(p))
            return 1;
        if (p)
            return p.length;
    }
    return 0;
}
;
b.listenerCount = function(p, c) {
    return p.listenerCount(c);
}
;


// Detected exports: EventEmitter, hSa, listenerCount