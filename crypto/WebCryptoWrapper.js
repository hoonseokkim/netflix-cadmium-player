/**
 * Netflix Cadmium Player — WebCryptoWrapper
 *
 * Thin subclass of {@link WebCryptoBase} that binds to the browser's
 * native `window.crypto` (via the global `Da.crypto` reference used
 * inside the Cadmium player runtime).
 *
 * @module crypto/WebCryptoWrapper
 */

import { WebCryptoBase } from './WebCryptoBase.js';

/**
 * Browser-specific Web Crypto wrapper.
 *
 * Passes `Da.crypto` (the platform Crypto object exposed by Cadmium)
 * to the base class so that all subsequent SubtleCrypto calls use the
 * browser's native implementation.
 */
export class WebCryptoWrapper extends WebCryptoBase {
  constructor() {
    super(Da.crypto);
  }
}
