/**
 * Netflix Cadmium Playercore - Module 64743
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: LDa
 */

// Webpack module 64743
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const LDa = undefined;
d = a(22970);  // import from Module_22970
t = (function(p) {
    function c(g, f) {
        var e;
        e = p.call(this, g, f) || this;
        e.closed.then(function() {
            return e.clear();
        });
        return e;
    }
    d.__extends(c, p);
    c.prototype.clear = function() {
        var g;
        g = this.Wd;
        if (g)
            return (this.Wd = undefined,
            g.open && (this.trace("Closing", g.id),
            g.close()),
            this.emit("disconnected", {
                Wd: g
            }),
            g);
    }
    ;
    c.prototype.set = function(g) {
        var f, e;
        f = this;
        if (this.open && this.Wd !== g) {
            e = this.clear();
            g.open && (this.Wd = g,
            g.closed.then(function() {
                f.iW(g) && f.clear();
            }),
            g.on("message", function(h) {
                h = h.message;
                f.iW(g) && f.emit("message", {
                    Wd: g,
                    message: h
                });
            }),
            g.on("failure", function(h) {
                var k;
                k = h.Oe;
                h = h.error;
                f.iW(g) && f.emit("failure", {
                    Oe: k,
                    error: h,
                    Wd: g
                });
            }),
            this.trace("Connected to", g.id),
            this.emit("connected", {
                Wd: g
            }));
            return e;
        }
    }
    ;
    c.prototype.isConnected = function() {
        var g;
        return this.open && (null === (g = this.Wd) || undefined === g ? undefined : g.open);
    }
    ;
    c.prototype.iW = function(g) {
        return this.open && g === this.Wd;
    }
    ;
    Object.defineProperties(c.prototype, {
        connected: {
            get: function() {
                return this.isConnected();
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.send = function(g) {
        var f;
        if (this.open && (null === (f = this.Wd) || undefined === f ? 0 : f.open))
            return this.Wd.send(g);
    }
    ;
    return c;
}
)(a(9568).i8);
b.LDa =

// Detected exports: LDa
