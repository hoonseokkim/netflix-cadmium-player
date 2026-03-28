/**
 * Netflix Cadmium Playercore - Module 42933
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: OLa
 * Dependencies: 9568
 * Purpose: Event handling, Error handling, Class definition
 */

// import dep_9568 from './Module_9568.js';

// Webpack module 42933
// Parameters: t (module), b (exports), a (require)

var c;
class d extends c.i8 {
    constructor(g, f) {
    var e;
    e = c.i8.call(this, "WSS", g.trace) || this;
    e.options = g;
    e.e9a = f;
    f.onmessage = function(h) {
        h = h.data;
        "string" === typeof h ? (e.trace("Received", h),
        e.emit("message", {
            Wd: e,
            message: h
        }),
        g.Of.uPb(h.length)) : e.trace("Received non-string message", h);
    }
    ;
    f.onclose = function(h) {
        e.trace("Received close event", h);
        e.options.Of.$hc();
        e.Zhc = h;
        e.close();
    }
    ;
    f.onerror = function(h) {
        e.trace("Received error, closing", h);
        e.options.Of.error();
        e.failure = {
            type: "ws-native-error",
            url: g.url,
            event: null !== h && undefined !== h ? h : "undefined"
        };
        e.emit("failure", {
            Oe: "ws.onerror",
            Wd: e,
            error: e.failure
        });
        e.close();
    }
    ;
    e.closed.then(function() {
        e.e9a = undefined;
        f.onopen = p;
        f.onclose = p;
        f.onerror = p;
        f.onmessage = p;
        f.close();
    });
    return e;
}
    close() {
    if (c.i8.prototype.close.call(this))
        return (this.options.Of.closed(),
        true);
}
    send(g) {
    if (this.open && this.e9a)
        return (this.trace("Sending", g),
        this.e9a.send(g),
        this.options.Of.T(g.length),
        true);
}
}
function p() {}

c = a(9568);
d.open = function(g) {
    return new Promise(function(f, e) {
        var h, k, l, m, n, q;
        k = new URL(g.url);
        new URLSearchParams(g.Xa).forEach(function(r, u) {
            k.searchParams.append(u, r);
        });
        l = k.toString();
        m = null === (h = g.timing) || undefined === h ? undefined : h.AAa(["network", "web.WebSocket"] /* network */);
        g.Of.uNc();
        n = new WebSocket(l);
        q = new d(g,n);
        q.trace("Connecting with", l);
        n.onopen = function() {
            n.onopen = function() {}
            ;
            q.trace("Connected");
            null === m || undefined === m ? undefined : m.end();
            g.Of.Ww();
            f(q);
        }
        ;
        q.closed.then(function() {
            var r, u, v;
            v = null !== (r = q.failure) && undefined !== r ? r : {
                type: "ws-did-not-open",
                url: g.url,
                event: null !== (u = q.Zhc) && undefined !== u ? u : undefined
            };
            null === m || undefined === m ? undefined : m.end(v);
            e(v);
        });
    }
    );
}
;
export const OLa = d;
d.supported = "function" === typeof globalThis.WebSocket;

// Detected exports: OLa
