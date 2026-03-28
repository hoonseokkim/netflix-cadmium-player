/**
 * Netflix Cadmium Playercore - Module 5641
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: uja
 * Purpose: Buffer/Segment management, Configuration, UI components, Enum definitions
 */

// Webpack module 5641
// Parameters: t (module), b (exports)

t = (function() {
    class a {
    constructor(d) {
        this.data = d;
        this.ey = this.nd = this.te = 0;
        this.view = new DataView(d.buffer,d.byteOffset,d.byteLength);
    }
    read(d) {
        if (0 === this.te) {
            if (8 === d)
                return this.data[this.nd++];
            if (16 === d)
                return (d = this.view.getUint16(this.nd),
                this.nd += 2,
                d);
            if (32 === d)
                return (d = this.view.getUint32(this.nd),
                this.nd += 4,
                d);
        }
        for (; this.te < d; )
            (this.ey = (this.ey << 8) + this.data[this.nd++],
            this.te += 8);
        this.te -= d;
        return this.ey >>> this.te & (1 << d) - 1;
    }
    advance(d) {
        var p;
        if (d <= this.te)
            this.te -= d;
        else {
            d -= this.te;
            p = Math.floor(d / 8);
            this.nd += p;
            this.ey = this.data[this.nd++];
            this.te = 8 - (d - 8 * p);
        }
    }
    write(d, p) {
        var c, g;
        p &= (1 << d) - 1;
        if (0 === this.te) {
            if (8 === d) {
                this.data[this.nd++] = p;
                return;
            }
            if (16 === d) {
                this.view.setUint16(this.nd, p);
                this.nd += 2;
                return;
            }
            if (32 === d) {
                this.view.setUint32(this.nd, p);
                this.nd += 4;
                return;
            }
        }
        if (0 < this.te) {
            c = Math.min(d, this.te);
            g = this.data[this.nd - 1] & (~((1 << this.te) - 1) ^ (1 << this.te - c) - 1);
            this.data[this.nd - 1] = g ^ (d >= c ? p >>> d - c : p << this.te - c);
            this.te -= c;
            d -= c;
        }
        for (; 8 <= d; )
            (d -= 8,
            this.data[this.nd++] = p >>> d & 255);
        0 < d && (this.te = 8 - d,
        g = this.data[this.nd] & (1 << this.te) - 1,
        this.ey = this.data[this.nd++] = g ^ (p & (1 << d) - 1) << 8 - d);
    }
    reverse(d) {
        0 !== this.te && d <= 8 - this.te ? this.te += d : (0 !== this.te && (d -= 8 - this.te,
        --this.nd),
        this.nd -= Math.floor(d / 8),
        this.ey = this.data[this.nd - 1],
        this.te = d % 8);
    }
    Zec() {
        0 !== this.te && (this.te = 0);
    }
}
Object.defineProperty(a.prototype, "offset", {
        get: function() {
            return this.nd;
        },
        enumerable: false,
        configurable: true
    });
    return a;
}
)();
export const uja = t;

// Detected exports: uja
