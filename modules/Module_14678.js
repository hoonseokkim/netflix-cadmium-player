/**
 * Netflix Cadmium Playercore - Module 14678
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Knb
 * Dependencies: 22970, 28951, 33993, 58655, 59143, 62411, 70402, 71385, 78710
 * Purpose: Logging, Event handling, Configuration, Timing/Scheduling
 */

// import dep_22970 from './Module_22970.js';
// import dep_28951 from './Module_28951.js';
// import dep_33993 from './Module_33993.js';
// import dep_58655 from './Module_58655.js';
// import dep_59143 from './Module_59143.js';
// import dep_62411 from './Module_62411.js';
// import dep_70402 from './Module_70402.js';
// import dep_71385 from './Module_71385.js';
// import dep_78710 from './Module_78710.js';

// Webpack module 14678
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k;

d = a(22970);
p = a(59143);
t = a(70402);
c = a(28951);
g = a(71385);
f = a(33993);
e = a(62411);
h = a(58655);
k = a(78710);
a = (function(l) {
    class m extends l {
    constructor(n) {
        var q, r, u;
        q = l.call(this) || this;
        q.trace = n.trace.extend("common");
        r = q.trace;
        q.Of = n.Of;
        q.va = new h.Lnb({
            Of: n.Of,
            trace: n.trace,
            Ni: n.Ni
        });
        u = new p.ajb((0,
        k.p_b)(n));
        q.Wd = u;
        u.on("connected", function(v) {
            q.emit("connected", v);
            q.va.v2("connected", {
                umd: v.Wd.duration,
                bV: v.Wd.H4a
            });
        });
        u.on("disconnected", function(v) {
            q.emit("disconnected", v);
            q.va.v2("disconnected", {
                smd: v.Wd.ZUb,
                rmd: v.Wd.i1c,
                bV: v.Wd.H4a
            });
        });
        u.on("failure", function(v) {
            var w, x;
            w = v.Wd;
            x = v.Oe;
            v = v.error;
            if ("connection-disabled" === v.type)
                return (r.console.warn("Connection disabled", v.reason),
                q.emit("disabled", v));
            r.console.warn(v);
            q.emit("failure", {
                Oe: x,
                Wd: w,
                error: e.EO(v)
            });
            q.va.error(x, v, {
                tmd: w.ZUb,
                bV: w.H4a
            });
        });
        q.We = new c.BHa(u,[g.rX.CLOSE, g.rX.WS_ECHO]).on("ignored", function(v) {
            v = v.message;
            v === g.rX.CLOSE ? (r("Restarting after server", g.rX.CLOSE, "message"),
            u.refresh(),
            q.emit("serverClose")) : v === g.rX.WS_ECHO && (q.emit("ping"),
            r("Metrics", q.Of.values));
        }).on("message", function(v) {
            q.emit("message", {
                message: v.message
            });
        });
        new f.bjb({
            trace: r,
            interval: n.BN,
            client: q
        }).on("timeout", function() {
            return q.emit("pingTimeout");
        });
        if (n = n.Ni.events)
            (n.on("cookies-changed", function() {
                r("Cookies changed, reconnecting");
                q.bJ();
            }),
            n.on("cookies-refreshed", function() {
                r("Cookies refreshed");
                q.refresh();
            }));
        return q;
    }
    send(n) {
        return this.Wd.send(n);
    }
    refresh() {
        this.Wd.refresh();
    }
    bJ() {
        this.Wd.bJ();
    }
    disconnect() {
        this.Wd.disconnect();
    }
    request(n) {
        return d.__awaiter(this, undefined, undefined, function() {
            var q, r;
            return d.__generator(this, function(u) {
                switch (u.label) {
                case 0:
                    if (!this.send(n.body))
                        throw e.$Fa("Socket.send returned false");
                    q = this.Wd.YHb("disconnected");
                    r = q.then(function() {
                        throw e.$Fa("Socket disconnected while waiting for a response");
                    });
                    u.label = 1;
                case 1:
                    return (u.ac.push([1, , 3, 4]),
                    [4, this.We.T8a(n.timeout, n.filter, r)]);
                case 2:
                    return [2, u.T()];
                case 3:
                    return (q.clear(),
                    [7]);
                case 4:
                    return [2];
                }
            });
        });
    }
}
d.Object.defineProperties(m.prototype, {
        connected: {
            get: function() {
                return this.Wd.connected;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(m.prototype, {
        dRa: {
            get: function() {
                return this.Wd.dRa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(m.prototype, {
        pd: {
            get: function() {
                return this.Wd.pd;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(m.prototype, {
        A1a: {
            get: function() {
                var n;
                n = this;
                return new Promise(function(q) {
                    return n.connected ? q() : n.once("connected", function() {
                        return q();
                    });
                }
                );
            },
            enumerable: false,
            configurable: true
        }
    });
    return m;
}
)(t.EventEmitter);
export const Knb = a;

// Detected exports: Knb
