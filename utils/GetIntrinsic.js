/**
 * @file GetIntrinsic.js
 * @description Implementation of the ES spec's GetIntrinsic abstract operation.
 * Provides safe, tamper-proof access to JavaScript built-in objects and their
 * properties using `%Name%` syntax (e.g., `%Array.prototype.push%`).
 * This is a third-party polyfill (get-intrinsic) used for security hardening,
 * ensuring that built-in references cannot be overridden by user code.
 * @module utils/GetIntrinsic
 * @see Module_67286
 *
 * This module builds a registry (K) of all JavaScript intrinsic objects
 * (%Array%, %Object%, %Promise%, etc.) and lazily resolves async/generator
 * intrinsics. It supports dot-notation paths like "%Array.prototype.push%"
 * for accessing nested properties safely.
 *
 * The module resolves aliases (O) such as "%ArrayPrototype%" -> ["Array", "prototype"]
 * and caches results to avoid repeated lookups.
 *
 * @param {string} name - Intrinsic name in `%Name%` or `%Name.property%` format
 * @param {boolean} [allowMissing=false] - If true, returns undefined for missing intrinsics
 *   instead of throwing
 * @returns {*} The intrinsic value
 * @throws {SyntaxError} If the intrinsic name is malformed
 * @throws {TypeError} If the intrinsic is not available and allowMissing is false
 */

// NOTE: This is a third-party module (get-intrinsic) bundled into the player.
// It has been left largely in its original form as deobfuscation would not
// improve readability - the original source is already a low-level utility.
// See: https://github.com/ljharb/get-intrinsic

export { default } from './GetIntrinsic.original.js';
