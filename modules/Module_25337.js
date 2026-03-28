/**
 * Netflix Cadmium Playercore - Module 25337
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: uma
 * Dependencies: 2050, 32296
 * Purpose: Buffer/Segment management, Logging, Configuration, UI components
 */

// import dep_2050 from './Module_2050.js';
// import dep_32296 from './Module_32296.js';

// Webpack module 25337
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(2050);
a(2050);
p = a(32296);
t = (function() {
    class c {
    constructor(g, f, e) {
        undefined === e && (e = {});
        this.view = g;
        this.console = f;
        this.config = e;
        this.view = g;
        this.console = f;
        this.te = this.ey = this.offset = 0;
    }
    LBb(g) {
        return new DataView(this.view.buffer,this.view.byteOffset + this.offset,g);
    }
    ib(g) {
        if (24 < g)
            return 16777216 * this.ib(g - 24) + this.ib(24);
        for (; this.te < g; )
            (this.ey = (this.ey << 8) + this.Hd(),
            this.te += 8);
        this.te -= g;
        return this.ey >>> this.te & (1 << g) - 1;
    }
    Hd() {
        var g;
        g = this.view.getUint8(this.offset);
        this.offset += 1;
        return g;
    }
    sg(g) {
        g = this.view.getUint16(this.offset, g);
        this.offset += 2;
        return g;
    }
    dc(g) {
        g = this.view.getUint32(this.offset, g);
        this.offset += 4;
        return g;
    }
    Ufa() {
        var g;
        g = this.view.getInt32(this.offset, undefined);
        this.offset += 4;
        return g;
    }
    UOc(g, f) {
        var e;
        e = this.view.getUint32(this.offset + (g ? 4 : 0), g);
        g = this.view.getUint32(this.offset + (g ? 0 : 4), g);
        f || 0 === (e & 4278190080) || this.console.warn("Warning: read unsigned value > 56 bits");
        return 4294967296 * e + g;
    }
    Am(g, f) {
        g = this.UOc(g, f);
        this.offset += 8;
        return g;
    }
    VOc() {
        var g, f;
        g = this.view.getInt32(this.offset + 0, undefined);
        f = this.view.getUint32(this.offset + 4, undefined);
        0 === ((0 < g ? g : -g) & 4278190080) || this.console.warn("Warning: read signed value > 56 bits");
        return 4294967296 * g + f;
    }
    mPb() {
        var g;
        g = this.VOc();
        this.offset += 8;
        return g;
    }
    gC() {
        return (0,
        p.wK)(this.dc());
    }
    Mya() {
        var f, e, h, k, l, m;
        function g(n, q) {
            return ("000000" + n.toString(16)).slice(2 * -q);
        }
        f = this.dc(true);
        e = this.sg(true);
        h = this.sg(true);
        k = this.sg();
        l = this.sg();
        m = this.dc();
        return [g(f, 4), g(e, 2), g(h, 2), g(k, 2), g(l, 2) + g(m, 4)].join("-");
    }
    s3(g) {
        var f;
        f = this.view.byteOffset + this.offset;
        f = this.view.buffer.slice(f, f + g);
        this.offset += g;
        return f;
    }
    E3a(g) {
        var f;
        f = [];
        if (0 === g)
            return "";
        g = g || Number.MAX_SAFE_INTEGER;
        for (var e = this.Hd(); 0 !== e && 0 <= --g; )
            (f.push(e),
            e = this.Hd());
        return String.fromCharCode.apply(null, f);
    }
    KU(g) {
        var f, e;
        undefined === f && (f = 1);
        undefined === e && (e = true);
        return this.Rn(this.config.l5 && d.aAc || d.Q0, 1, g, f, e);
    }
    tSc(g) {
        var f, e, h;
        f = 10;
        e = false;
        undefined === f && (f = 2);
        undefined === e && (e = true);
        undefined === h && (h = false);
        return this.Rn(this.config.l5 && d.Zzc || d.Usa, 2, g, f, e, h);
    }
    Kya(g, f, e) {
        var h;
        undefined === f && (f = 4);
        undefined === e && (e = true);
        undefined === h && (h = false);
        return this.Rn(this.config.l5 && d.$zc || d.uca, 4, g, f, e, h);
    }
    xSc() {
        for (var g = this.Hd(), f = g & 127; g & 128; )
            (g = this.Hd(),
            f = f << 7 | g & 127);
        return f;
    }
    Rn(g, f, e, h, k, l) {
        undefined === k && (k = true);
        undefined === l && (l = false);
        g = g(this.view, this.offset, e, h, l);
        this.offset = k || !h || h === f ? this.offset + e * (h || f) : this.offset + f;
        return g;
    }
}
return c;
}
)();
export const uma = t;

// Detected exports: uma
