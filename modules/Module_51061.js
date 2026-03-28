/**
 * Netflix Cadmium Playercore - Module 51061
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: bma
 */

// Webpack module 51061
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const bma = undefined;
d = a(93334);  // import from Module_93334
t = (function() {
    function p(c) {
        this.message = c;
    }
    p.prototype.encode = function(c) {
        var g, f, e, h, k;
        c.$h(252);
        c.rW(12288);
        g = c.offset;
        c.$h(0);
        c.$h(0);
        c.fo(0);
        c.$h(0);
        c.rW(65520);
        c.$h(0);
        c.$h(6);
        f = c.offset;
        this.c5c(c);
        e = c.offset;
        c.rW(0);
        c.$h(2);
        c.$h(0);
        this.b5c(c);
        h = c.offset;
        k = e - f;
        (0,
        d.assert)(256 > k);
        c.boa(f - 2);
        c.$h(k & 255);
        f = h - e - 4;
        k = h - e - 2;
        c.boa(e);
        c.rW(k);
        c.wbc();
        c.$h(f);
        e = h - g + 4;
        (0,
        d.assert)(256 > e);
        c.boa(g - 1);
        c.$h(e & 255);
        c.boa(h);
        c.fo(0);
    }
    ;
    p.prototype.c5c = function(c) {
        var g;
        g = this.message.JN & 4294967295;
        c.$h(254 + (this.message.JN - g) / 4294967296 % 2);
        c.fo(g);
    }
    ;
    p.prototype.b5c = function(c) {
        var g, f;
        c.fo(0);
        c.fo(this.message.id || 0);
        c.$h("cancel" === this.message.event ? 255 : 127);
        if ("cancel" !== this.message.event) {
            f = null !== (g = this.message.Tga) && undefined !== g ? g : p.f5a[this.message.event];
            c.$h(this.message.duration ? 255 : 191);
            this.message.duration && (g = this.message.duration & 4294967295,
            c.$h((this.message.duration - g) / 4294967296),
            c.fo(g));
            c.$h(undefined !== this.message.Uga ? this.message.Uga : 0);
            (g = this.message.X3) && 0 < g.byteLength ? (c.$h(g.byteLength),
            c.c9a(new Uint8Array(g))) : c.$h(0);
            c.$h(f);
            c.$h(1);
            c.$h(1);
            if (48 === f || 50 === f || 52 === f || 54 === f || 56 === f || 58 === f || 68 === f || 70 === f)
                (c.$h(0),
                c.$h(0));
        }
    }
    ;
    p.f5a = {
        programstart: 16,
        programend: 17,
        programbreakaway: 19,
        breakstart: 52,
        breakend: 53
    };
    return p;
}
)();
b.bma =

// Detected exports: bma
