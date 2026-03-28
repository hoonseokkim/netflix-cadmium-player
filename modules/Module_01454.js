/**
 * Netflix Cadmium Playercore - Module 1454
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: nhb
 */

// Webpack module 1454
// Parameters: t (module), b (exports), a (require)

var d, p;
export const nhb = undefined;
t = a(22970);  // import from Module_22970
d = t.__importDefault(a(79804));
p = t.__importDefault(a(10690));
a = (function() {
    function c() {
        this.OG = null;
        this.Xl = this.Mg = false;
    }
    c.prototype.close = function(g, f) {
        this.Xl = true;
        f.result(true);
    }
    ;
    c.prototype.abort = function() {
        this.Mg = true;
    }
    ;
    c.prototype.zKb = function(g) {
        var f;
        f = this;
        d.default(g, function() {
            if (f.Mg || f.Xl)
                return false;
            if (f.OG)
                return true;
            f.s0a({
                result: function(e) {
                    d.default(g, function() {
                        f.OG = e;
                        return null != f.OG;
                    });
                },
                timeout: g.timeout,
                error: g.error
            });
        });
    }
    ;
    c.prototype.next = function(g, f) {
        d.default(f, function() {
            throw new p.default("MslTokenizer.next() must be implemented by a subclass.");
        });
    }
    ;
    c.prototype.s0a = function(g) {
        var f;
        f = this;
        d.default(g, function() {
            var e;
            if (f.Mg || f.Xl)
                return null;
            if (null != f.OG) {
                e = f.OG;
                f.OG = null;
                return e;
            }
            f.next(-1, g);
        });
    }
    ;
    return c;
}
)();
b.nhb =

// Detected exports: nhb
