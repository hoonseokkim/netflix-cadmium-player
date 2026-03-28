/**
 * Netflix Cadmium Playercore - Module 25078
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: wja
 */

// Webpack module 25078
// Parameters: t (module), b (exports), a (require)

var d;
export const wja = undefined;
d = a(22970).__importDefault(a(48795));
t = (function() {
    function p() {
        this.Xl = false;
        this.sA = new Uint8Array(0);
        this.$La = [];
    }
    p.prototype.abort = function() {}
    ;
    p.prototype.close = function(c, g) {
        this.Xl = true;
        g.result(true);
    }
    ;
    p.prototype.write = function(c, g, f, e, h) {
        var k;
        try {
            if (this.Xl)
                throw new d.default("Stream is already closed.");
            if (0 > g)
                throw new RangeError("Offset cannot be negative.");
            if (0 > f)
                throw new RangeError("Length cannot be negative.");
            if (g + f > c.length)
                throw new RangeError("Offset plus length cannot be greater than the array length.");
            k = c.subarray(g, Math.min(c.length, g + f));
            this.$La.push(k);
            h.result(k.length);
        } catch (l) {
            h.error(l);
        }
    }
    ;
    p.prototype.flush = function(c, g) {
        var f, e;
        try {
            for (; 0 < this.$La.length; ) {
                f = this.$La.shift();
                if (this.sA) {
                    e = new Uint8Array(this.sA.length + f.length);
                    e.set(this.sA);
                    e.set(f, this.sA.length);
                    this.sA = e;
                } else
                    this.sA = new Uint8Array(f);
            }
            g.result(true);
        } catch (h) {
            g.error(h);
        }
    }
    ;
    p.prototype.size = function() {
        this.flush(1, {
            result: function() {},
            error: function() {}
        });
        return this.sA.length;
    }
    ;
    p.prototype.T4 = function() {
        this.flush(1, {
            result: function() {},
            error: function() {}
        });
        return this.sA;
    }
    ;
    return p;
}
)();
b.wja =

// Detected exports: wja
