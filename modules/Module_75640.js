/**
 * Netflix Cadmium Playercore - Module 75640
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 75640
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Aib = void 0;
d = a(65161);
p = a(43276);
t = (function() {
    var g0x;
    g0x = 2;
    for (; g0x !== 3; ) {
        switch (g0x) {
        case 2:
            c.prototype.reset = function() {
                var k0u;
                k0u = 2;
                for (; k0u !== 4; ) {
                    switch (k0u) {
                    case 2:
                        this.uga = [0, 0];
                        k0u = 1;
                        break;
                    case 1:
                        this.jq = [0, 0];
                        this.hfa = [0, 0];
                        k0u = 4;
                        break;
                    case 9:
                        this.uga = [3, 1];
                        k0u = 2;
                        break;
                    }
                }
            }
            ;
            c.prototype.JY = function(g, f, e, h) {
                var E$X, k, l;
                E$X = 2;
                for (; E$X !== 8; ) {
                    switch (E$X) {
                    case 3:
                        E$X = (null === (l = h.ZN) || void 0 === l ? 0 : l.F_a(g, f, e, this.ifa)) ? 9 : 8;
                        break;
                    case 4:
                        (this.uga[h.type] += g,
                        this.IMb.add(g, f, e),
                        this.S1a[h.type].add(g, f, e));
                        E$X = 3;
                        break;
                    case 5:
                        E$X = (null === (k = h.ZN) || void 0 === k ? 0 : k.jua()) ? 4 : 3;
                        break;
                    case 9:
                        this.hfa[h.type] += g;
                        E$X = 8;
                        break;
                    case 2:
                        this.jq[h.type] += g;
                        E$X = 5;
                        break;
                    }
                }
            }
            ;
            c.prototype.fWa = function() {
                var M3V;
                M3V = 2;
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
        W8V = 2;
        for (; W8V !== 7; ) {
            switch (W8V) {
            case 9:
                this.S1a = [new p.cP(), new p.cP()];
                this.IMb = new p.cP();
                W8V = 7;
                break;
            case 2:
                var O__ = "1SIYb";
                O__ += "Zr";
                O__ += "NJCp";
                O__ += "9";
                this.uga = [0, 0];
                this.jq = [0, 0];
                this.hfa = [0, 0];
                O__;
                this.ifa = g.ifa;
                W8V = 9;
                break;
            }
        }
    }
}
)();
b.Aib = t;


// Detected exports: Aib