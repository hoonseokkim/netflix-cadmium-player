/**
 * Netflix Cadmium Player — Trusted Network Configuration
 *
 * Defines the trusted network mode enum used by the MSL (Message Security
 * Layer) transport to determine authentication behavior.
 *
 * @module TrustedNetworkConfig
 */

/**
 * Converts a numeric trusted config value to its string label.
 *
 * @param {number} value - The enum ordinal (0 = STANDARD, 1 = LIMITED).
 * @returns {string} The string label.
 */
export function getTrustedConfigLabel(value) {
  return ["STANDARD", "LIMITED"][value];
}

/**
 * Trusted network configuration modes.
 *
 * - **STANDARD** (0): Full trust — all key exchange and authentication
 *   mechanisms are available.
 * - **LIMITED** (1): Restricted trust — only a subset of authentication
 *   is permitted (e.g., for untrusted or shared devices).
 *
 * @enum {number}
 */
export const TrustedNetworkConfig = {
  STANDARD: 0,
  LIMITED: 1,
};
