/**
 * Netflix Cadmium Playercore - Module 44248
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: vma
 */

// Webpack module 44248
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const vma = undefined;
d = a(32296);  // import from Module_32296
t = (function() {
    function p(c) {
        undefined === c && (c = 1);
        this.Tb = new ArrayBuffer(c);
        this.view = new DataView(this.Tb);
        this.te = this.ey = this.nd = 0;
    }
    Object.defineProperties(p.prototype, {
        offset: {
            get: function() {
                return this.nd;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        buffer: {
            get: function() {
                return this.Tb.slice(0, this.offset);
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.YR = function(c) {
        var g, f;
        c = this.offset + c + 1;
        if (c > this.Tb.byteLength) {
            c = new ArrayBuffer(Math.max(2 * this.Tb.byteLength, c));
            g = new Uint8Array(c);
            f = new Uint8Array(this.Tb);
            g.set(f);
            this.Tb = c;
            this.view = new DataView(this.Tb);
        }
    }
    ;
    p.prototype.boa = function(c) {
        this.YR(c - this.offset);
        this.nd = c;
    }
    ;
    p.prototype.wbc = function() {
        this.YR(1);
        this.nd += 1;
    }
    ;
    p.prototype.$h = function(c) {
        this.YR(1);
        this.view.setUint8(this.offset, c);
        this.nd += 1;
    }
    ;
    p.prototype.rW = function(c, g) {
        this.YR(2);
        this.view.setUint16(this.offset, c, g);
        this.nd += 2;
    }
    ;
    p.prototype.fo = function(c, g) {
        this.YR(4);
        this.view.setUint32(this.offset, c, g);
        this.nd += 4;
    }
    ;
    p.prototype.jYb = function(c, g) {
        var f;
        f = Math.floor(c / 4294967296);
        c -= 4294967296 * f;
        this.YR(8);
        this.view.setUint32(this.offset + (g ? 4 : 0), f, g);
        this.view.setUint32(this.offset + (g ? 0 : 4), c, g);
        this.nd += 8;
    }
    ;
    p.prototype.a9a = function(c) {
        this.fo((0,
        d.jMa)(c));
    }
    ;
    p.prototype.c9a = function(c) {
        this.YR(c.length);
        new Uint8Array(this.Tb).set(c, this.offset);
        this.nd += c.length;
    }
    ;
    return p;
}
)();
b.vma =

// Detected exports: vma
