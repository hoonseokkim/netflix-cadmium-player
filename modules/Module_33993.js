/**
 * Netflix Cadmium Playercore - Module 33993
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: bjb
 */

// Webpack module 33993
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const bjb = b.g5b = undefined;
d = a(22970);  // import from Module_22970
t = a(70402);  // import from Module_70402
p = a(71385);  // import from Module_71385
b.g5b = (function() {
    return function() {}
    ;
}
)();
a = (function(c) {
    function g(f) {
        var e;
        e = c.call(this) || this;
        e.trace = f.trace.extend("ping");
        e.start(f);
        return e;
    }
    d.__extends(g, c);
    g.prototype.start = function(f) {
        return d.__awaiter(this, undefined, undefined, function() {
            var e, h, k, l;
            l = this;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    return [4, f.interval];
                case 1:
                    e = m.T();
                    if (0 === e)
                        return (this.trace("Disabled"),
                        [2]);
                    this.trace("Pinging every", e, "ms");
                    h = f.client;
                    k = true;
                    h.on("ping", function() {
                        k = true;
                        l.trace("Received response");
                    }).on("disconnected", function() {
                        k = true;
                    });
                    setInterval(function() {
                        if (h.connected) {
                            if (!k)
                                return (l.trace("Timed out, restarting"),
                                l.emit("timeout"),
                                h.bJ());
                            l.trace("Sending");
                            h.send(p.rX.WS_ECHO) && (k = false);
                        }
                    }, e);
                    return [2];
                }
            });
        });
    }
    ;
    return g;
}
)(t.EventEmitter);
b.bjb =

// Detected exports: bjb
