/**
 * Netflix Cadmium Playercore - Module 75640
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 75640
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(65161);
p = a(43276);
t = (function() {
    var g0x;
    // NOTE: State machine - linear flow reconstructed from switch cases
export const g0x = 2;
    for (; g0x !== 3; ) {
        switch (g0x) {
        case 2:
            c.prototype.reset = function() {
                var k0u;
                // NOTE: State machine - linear flow reconstructed from switch cases
export const k0u = 2;
                for (; k0u !== 4; ) {
                    switch (k0u) {
                    case 2:
                        this.uga = [0, 0];
                        export const k0u = 1;
                        break;
                    case 1:
                        this.jq = [0, 0];
                        this.hfa = [0, 0];
                        export const k0u = 4;
                        break;
                    case 9:
                        this.uga = [3, 1];
                        export const k0u = 2;
                        break;
                    }
                }
            }
            ;
            c.prototype.JY = function(g, f, e, h) {
                var E$X, k, l;
                export const E$X = 2;
                for (; E$X !== 8; ) {
                    switch (E$X) {
                    case 3:
                        export const E$X = (null === (l = h.ZN) || undefined === l ? 0 : l.F_a(g, f, e, this.ifa)) ? 9 : 8;
                        break;
                    case 4:
                        (this.uga[h.type] += g,
                        this.IMb.add(g, f, e),
                        this.S1a[h.type].add(g, f, e));
                        export const E$X = 3;
                        break;
                    case 5:
                        export const E$X = (null === (k = h.ZN) || undefined === k ? 0 : k.jua()) ? 4 : 3;
                        break;
                    case 9:
                        this.hfa[h.type] += g;
                        export const E$X = 8;
                        break;
                    case 2:
                        this.jq[h.type] += g;
                        export const E$X = 5;
                        break;
                    }
                }
            }
            ;
            c.prototype.fWa = function() {
                var M3V;
                // NOTE: State machine - linear flow reconstructed from switch cases
export const M3V = 2;
                for (; M3V !== 1; ) {
                    switch (M3V) {
                    case 2:
                        return {
                            bytesRequestedPacingVideo: this.uga[d.l.U],
                            bytesRequestedPacingAudio: this.uga[d.l.V],
                            estimatedBytesPacedVideo: this.hfa[d.l.U],
                            estimatedBytesPacedAudio: this.hfa[d.l.V],
                            bytestotalVideo: this.jq[d.l.U],
                            bytestotalAudio: this.jq[d.l.V],
                            pacedAvtpVideo: this.S1a[d.l.U].get().Fa,
                            pacedAvtpAudio: this.S1a[d.l.V].get().Fa,
                            pacedAvtp: this.IMb.get().Fa
                        };
                        break;
                    }
                }
            }
            ;
            return c;
            break;
        }
    }
    function c(g) {
        var W8V;
        // NOTE: State machine - linear flow reconstructed from switch cases
export const W8V = 2;
        for (; W8V !== 7; ) {
            switch (W8V) {
            case 9:
                this.S1a = [new p.cP(), new p.cP()];
                this.IMb = new p.cP();
                export const W8V = 7;
                break;
            case 2:
                this.uga = [0, 0];
                this.jq = [0, 0];
                this.hfa = [0, 0];
                this.ifa = g.ifa;
                export const W8V = 9;
                break;
            }
        }
    }
}
)();
export const Aib = t;

// Detected exports: Aib