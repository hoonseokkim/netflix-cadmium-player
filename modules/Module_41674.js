/**
 * Netflix Cadmium Playercore - Module 41674
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 41674
// Parameters: t (module), b (exports), a (require)


Object.defineProperty(b, "__esModule", {
    value: !0
});
b.AbortSignal = b.AbortController = void 0;
b.AbortController = a.n0.AbortController;
b.AbortSignal = a.n0.AbortSignal;
b.AbortSignal.prototype.throwIfAborted || (b.AbortSignal.prototype.UUb = function() {
    if (this.aborted)
        throw this.reason;
}
);


// Detected exports: AbortSignal, AbortController