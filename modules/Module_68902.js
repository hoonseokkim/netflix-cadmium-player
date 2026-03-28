/**
 * Netflix Cadmium Playercore - Module 68902
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: tcb
 */

// Webpack module 68902
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const tcb = undefined;
d = a(26388);  // import from Module_26388
p = new (a(66164).platform.Console)("ASEJS_ELLA_NETWORK_MONITOR","media|asejs");
t = (function() {
    function c(g) {
        this.$c = g;
        this.Sqa = 0;
        this.Yva = Infinity;
        this.Uha = this.bytesReceived = 0;
        this.xp = {
            rF: 0,
            RE: 0,
            yN: 0,
            $I: 0
        };
    }
    c.prototype.LSc = function(g, f, e, h, k) {
        var l, m;
        m = k.bytesReceived;
        p.trace(("receiveChannelInfoUpdate for ").concat(e, ": relayNode=").concat(g, ",\n                 channelName=").concat(f, ", bytes=").concat(m, ", packet delay=").concat(k.JMb, ",\n                 packets received=").concat(k.nVb, ", packets lost=").concat(k.mVb));
        e === d.l.U && (g = h.$b - h.nb,
        this.bytesReceived += m,
        this.Uha += g,
        this.Sqa = 8 * this.bytesReceived / this.Uha,
        this.xp.RE += Math.abs(k.mVb),
        this.xp.rF += k.nVb,
        this.xp.yN = this.xp.RE / (this.xp.RE + this.xp.rF),
        k = null !== (l = k.JMb) && undefined !== l ? l : this.Yva,
        this.Yva = Math.min(k, this.Yva),
        this.xp.$I = k - this.Yva,
        p.trace(("ELLA Network stats updated for ").concat(e, ": throughput=").concat(this.Sqa.toFixed(2), "kbps, packet loss rate=").concat((100 * this.xp.yN).toFixed(2), "%, queueing delay=").concat(this.xp.$I.toFixed(2), "ms")));
    }
    ;
    c.prototype.Z4c = function() {
        this.Uha = this.bytesReceived = 0;
        this.xp.rF = 0;
        this.xp.RE = 0;
        p.trace("wrapUpMeasurement: Network stats", (100 * this.xp.yN).toFixed(2), this.xp.$I);
    }
    ;
    c.prototype.Bl = function() {
        var g;
        g = this.$c.get().sb.Fa;
        return 0 !== this.Sqa ? this.Sqa : g;
    }
    ;
    c.prototype.J0 = function() {
        return {
            requestId: "0",
            im: undefined,
            type: undefined,
            la: undefined
        };
    }
    ;
    return c;
}
)();
b.tcb =

// Detected exports: tcb
