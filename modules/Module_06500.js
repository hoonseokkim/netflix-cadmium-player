/**
 * Netflix Cadmium Playercore - Module 6500
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: Ieb
 */

// Webpack module 6500
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ieb = undefined;
d = a(91176);  // import from Module_91176
p = a(52571);  // import from Module_52571
t = (function() {
    function c(g) {
        this.console = g;
    }
    c.prototype.yt = function() {
        this.fea = this.a1 = undefined;
    }
    ;
    c.prototype.PEc = function() {
        return !(!this.fea || !this.a1 || this.fea.equal(this.a1));
    }
    ;
    c.prototype.eZa = function(g) {
        return Math.abs(g.$) > Math.pow(2, 31);
    }
    ;
    c.prototype.append = function(g) {
        var f, e, h, k, l, m;
        f = g.Na;
        e = g.offset;
        h = g.qf;
        k = g.Ih;
        g = g.Sh;
        if (this.a1 && this.fea && e.equal(this.a1))
            return {
                Na: f,
                offset: this.fea,
                qf: h,
                Ih: k,
                Sh: g
            };
        l = e;
        if (this.eZa(l)) {
            m = (0,
            d.VL)(l.$, l.O);
            l = l.Rc(l.O / m);
            this.console.info(("IntOffsetOverflowProtector: performing gcd on the offset to reduce the timescale. From ").concat(e.ca(), " to ").concat(l.ca()));
        }
        undefined === this.a1 ? this.eZa(l) && (l = e.Rc(1),
        this.console.info(("IntOffsetOverflowProtector: offset ticks too large, needs timescale reduction. From ").concat(e.ca(), " to ").concat(l.ca()))) : (0,
        p.assert)(!this.eZa(l) && !this.PEc(), ("IntOffsetOverflowProtector: splicing is not supported with large offsets ").concat(l.ca()));
        this.a1 = e;
        this.fea = l;
        return {
            Na: f,
            offset: l,
            qf: h,
            Ih: k,
            Sh: g
        };
    }
    ;
    return c;
}
)();
b.Ieb =

// Detected exports: Ieb
