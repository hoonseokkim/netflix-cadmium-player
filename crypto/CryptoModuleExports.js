/**
 * @module CryptoModuleExports
 * @description Barrel module that re-exports the two primary crypto
 * sub-modules used by the Cadmium player's encryption/DRM subsystem.
 * @origin Module_35558
 */

export { default as CryptoProvider } from '../crypto/CryptoProvider.js';
export { default as KeyDerivation } from '../crypto/KeyDerivation.js';
