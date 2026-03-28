/**
 * Netflix Cadmium Playercore - Module 59143
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: ajb
 * Dependencies: 4343, 22970, 49781, 62411, 64743, 94933
 * Purpose: Event handling, Configuration, Error handling, Class definition
 */

// import dep_4343 from './Module_4343.js';
// import dep_22970 from './Module_22970.js';
// import dep_49781 from './Module_49781.js';
// import dep_62411 from './Module_62411.js';
// import dep_64743 from './Module_64743.js';
// import dep_94933 from './Module_94933.js';

// Webpack module 59143
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(94933);
c = a(49781);
t = a(64743);
g = a(4343);
f = a(62411);
a = (function(e) {
    class h extends e {
    constructor(k) {
        var l;
        l = e.call(this, "PS", k.trace) || this;
        l.cRa = new c.rkb(l);
        l.FR = false;
        l.options = d.__assign({}, k);
        l.bRa = new g.fFa(k.connect).on("failed", function(m) {
            l.emit("failure", {
                Oe: "max-connect-failures",
                Wd: m.Wd,
                error: m.error
            });
        });
        l.Joc = new g.fFa(k.disconnect).on("failed", function(m) {
            var n;
            n = m.Wd;
            m = m.error;
            l.emit("failure", {
                Oe: "disconnect-failure",
                Wd: n,
                error: m
            });
            l.disconnect();
            l.bRa.failure("disconnect-failure", n, m);
        });
        l.trace("Opening initial connection");
        l.connect();
        return l;
    }
    kqb() {
        return !this.open || 1 < this.cRa.length || this.FR || this.pd;
    }
    connect() {
        var k;
        k = this;
        this.FR = false;
        return this.cRa.push("connect", function() {
            return d.__awaiter(k, undefined, undefined, function() {
                var l, m, n;
                n = this;
                return d.__generator(this, function(q) {
                    switch (q.label) {
                    case 0:
                        if (this.kqb())
                            return [2];
                        this.trace("Connecting...");
                        return [4, p.Zab.open(d.__assign(d.__assign({}, this.options), {
                            trace: this.trace
                        }))];
                    case 1:
                        l = q.T();
                        if (this.kqb())
                            return (l.close(),
                            [2]);
                        if (l.pd)
                            return (m = (0,
                            f.EO)(l.failure),
                            this.disconnect(),
                            this.emit("failure", {
                                Oe: "connect-failed",
                                Wd: l,
                                error: m
                            }),
                            "connection-disabled" !== m.type && this.bRa.failure("connect-failed", l, m),
                            [2]);
                        this.trace("Connected", ("").concat(l.id), l.timing.duration, "ms", l.timing.summary());
                        l.closed.then(function() {
                            var r, u, v;
                            n.iW(l) && n.open && !n.FR && !n.pd && (null !== (v = null === (u = (r = n.options).bJ) || undefined === u ? undefined : u.call(r)) && undefined !== v ? v : 1) && n.connect();
                        });
                        l.on("failure", function(r) {
                            return n.Joc.failure(r.Oe, l, r.error);
                        });
                        this.set(l);
                        return [2];
                    }
                });
            });
        });
    }
    isConnected() {
        return e.prototype.isConnected.call(this) && !this.FR;
    }
    refresh() {
        if (this.open && !this.pd)
            return this.connect();
    }
    bJ() {
        if (this.open && !this.pd)
            return (this.clear(),
            this.connect());
    }
    disconnect() {
        if (this.open && !this.FR)
            return (this.FR = true,
            this.clear(),
            true);
    }
}
d.Object.defineProperties(h.prototype, {
        dRa: {
            get: function() {
                return this.open && !this.FR && 0 < this.cRa.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(h.prototype, {
        pd: {
            get: function() {
                return this.bRa.rSc;
            },
            enumerable: false,
            configurable: true
        }
    });
    return h;
}
)(t.LDa);
export const ajb = a;

// Detected exports: ajb
