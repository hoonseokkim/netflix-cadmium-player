/**
 * Netflix Cadmium Playercore - Module 70834
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: Tja
 * Purpose: Buffer/Segment management, Error handling, Playback control, UI components
 */

// Webpack module 70834
// Parameters: t (module), b (exports)

t = (function() {
    class a {
    constructor(d) {
        this.buffer = d;
        this.position = 0;
    }
    seek(d) {
        this.position = d;
    }
    skip(d) {
        this.position += d;
    }
    lca() {
        return this.buffer.length - this.position;
    }
    usa() {
        return this.buffer.length;
    }
    hv() {
        return this.buffer[this.position++];
    }
    Rn(d) {
        var p;
        p = this.position;
        this.position += d;
        return this.VEc(this.buffer) ? this.buffer.subarray(p, this.position) : this.buffer.slice(p, this.position);
    }
    VEc(d) {
        return undefined !== d.subarray;
    }
    hx(d) {
        for (var p = 0; d--; )
            p = 256 * p + this.buffer[this.position++];
        return p;
    }
    F3a(d) {
        for (var p = ""; d--; )
            p += String.fromCharCode(this.buffer[this.position++]);
        return p;
    }
    Fj() {
        return this.hx(2);
    }
    ix() {
        return this.hx(4);
    }
    u3() {
        return this.hx(8);
    }
    pF(d) {
        for (var p, c = ""; d--; )
            (p = this.hv(),
            c += ("0123456789ABCDEF")[p >>> 4] + ("0123456789ABCDEF")[p & 15]);
        return c;
    }
    G3a(d) {
        for (var p = 0, c = 0; c < d; c++)
            p += this.hv() << (c << 3);
        return p;
    }
    t3() {
        return this.G3a(4);
    }
    Nz(d) {
        this.buffer[this.position++] = d;
    }
    mYb(d, p) {
        this.position += p;
        for (var c = 1; c <= p; c++)
            (this.buffer[this.position - c] = d & 255,
            d = Math.floor(d / 256));
    }
    b9a(d) {
        for (var p = d.length, c = 0; c < p; c++)
            this.buffer[this.position++] = d[c];
    }
    w5(d, p) {
        this.b9a(d.Rn(p));
    }
    kYb(d) {
        d = new a(d);
        for (var p, c; ; )
            if ((p = d.lca(),
            c = p >>> 14))
                (c = Math.min(4, c),
                this.Nz(192 | c),
                this.w5(d, 16384 * c));
            else {
                128 > p ? this.Nz(p) : this.mYb(p | 32768, 2);
                this.w5(d, p);
                break;
            }
    }
    hPb() {
        var c;
        for (var d = [], p = new a(d); ; ) {
            c = this.hv();
            if (c & 128) {
                if (128 == (c & 192))
                    (c &= 63,
                    c = (c << 8) + this.hv(),
                    p.w5(this, c));
                else if ((c &= 63,
                0 < c && 4 >= c)) {
                    p.w5(this, 16384 * c);
                    continue;
                } else
                    throw Error("bad asn1");
            } else
                p.w5(this, c);
            break;
        }
        return new Uint8Array(d);
    }
}
return a;
}
)();
export const Tja = t;

// Detected exports: Tja
