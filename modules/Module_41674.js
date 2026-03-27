/**
 * Netflix Cadmium Playercore - Module 41674
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 41674
// Parameters: t (module), b (exports), a (require)

export const AbortController = a.n0.AbortController;
export const AbortSignal = a.n0.AbortSignal;
AbortSignal.prototype.throwIfAborted || (AbortSignal.prototype.UUb = function() {
    if (this.aborted)
        throw this.reason;
}
);

// Detected exports: AbortSignal, AbortController