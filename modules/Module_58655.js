/**
 * Netflix Cadmium Playercore - Module 58655
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Lnb
 */

// Webpack module 58655
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Lnb = undefined;
d = a(22970);  // import from Module_22970
p = a(62411);  // import from Module_62411
t = (function() {
    function c(g) {
        this.options = g;
        this.visible = g.Ni.visible;
    }
    Object.defineProperties(c.prototype, {
        context: {
            get: function() {
                return {
                    visible: ("").concat(this.visible.sW)
                };
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.Foa = function(g) {
        var f;
        g = "string" === typeof g ? {
            message: g
        } : g;
        f = this.options.Foa;
        return f ? d.__assign(d.__assign({}, g || ({})), f()) : g;
    }
    ;
    c.prototype.send = function(g, f, e, h) {
        f = {
            Oe: f,
            context: this.context,
            Of: this.options.Of.values,
            error: h ? (0,
            p.EO)(h) : undefined,
            gl: this.Foa(e)
        };
        this.options.Ni.sT(g, f);
        this.options.trace(g, f);
    }
    ;
    c.prototype.error = function(g, f, e) {
        this.send("error", g, e, f);
    }
    ;
    c.prototype.warn = function(g, f) {
        this.send("warn", g, f);
    }
    ;
    c.prototype.v2 = function(g, f) {
        this.send("info", g, f);
    }
    ;
    c.prototype.Bdc = function(g) {
        var f;
        f = this.options.Foa;
        this.options.Foa = f ? function() {
            return d.__assign(d.__assign({}, f()), g());
        }
        : g;
        return this;
    }
    ;
    return c;
}
)();
b.Lnb =

// Detected exports: Lnb
