/**
 * Netflix Cadmium Playercore - Module 43276
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: cP
 * Purpose: Utility module
 */

// Webpack module 43276
// Parameters: t (module), b (exports)

t = (function() {
    class a {
    constructor() {
        var E8A;
        E8A = 2;
        for (; E8A !== 3; ) {
            switch (E8A) {
            case 2:
                var S0n = "1SIYb";
                S0n += "Zr";
                S0n += "NJ";
                S0n += "C";
                S0n += "p9";
                this.active = false;
                this.LU = this.la = 0;
                this.yL = this.b_ = undefined;
                S0n;
                E8A = 3;
                break;
            }
        }
    }
    start(d) {
                var p0D;
                p0D = 2;
                for (; p0D !== 5; ) {
                    switch (p0D) {
                    case 2:
                        this.active = true;
                        this.b_ ? d < this.b_ ? (this.LU += this.b_ - d,
                        this.b_ = d) : this.yL && d > this.yL && (this.yL = this.b_ = d) : this.yL = this.b_ = d;
                        p0D = 5;
                        break;
                    }
                }
            }
    stop(d) {
                var r$X;
                r$X = 2;
                for (; r$X !== 1; ) {
                    switch (r$X) {
                    case 2:
                        this.active && (this.active = false,
                        this.yL && d > this.yL && (this.LU += d - this.yL,
                        this.yL = d));
                        r$X = 1;
                        break;
                    }
                }
            }
    add(d, p, c) {
                var Y80;
                Y80 = 2;
                for (; Y80 !== 4; ) {
                    switch (Y80) {
                    case 2:
                        this.start(p);
                        this.stop(c);
                        this.la += d;
                        Y80 = 4;
                        break;
                    }
                }
            }
    get() {
                var K6n;
                K6n = 2;
                for (; K6n !== 1; ) {
                    switch (K6n) {
                    case 2:
                        return {
                            Fa: this.LU ? Math.floor(8 * this.la / this.LU) : null,
                            HSa: this.LU || 0
                        };
                        break;
                    }
                }
            }
}
var c6Z;
    c6Z = 2;
    for (; c6Z !== 9; ) {
        switch (c6Z) {
        case 2:
            c6Z = 3;
            break;
        case 3:
            return a;
            break;
        case 12:
            return a;
            break;
        }
    }
}
)();
export const cP = t;

// Detected exports: cP
