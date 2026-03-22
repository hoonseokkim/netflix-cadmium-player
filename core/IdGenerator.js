/**
 * @module IdGenerator
 * @description Generates unique identifiers for player sessions and requests.
 * Produces time-based numeric IDs and random 32-character hex strings.
 * Decorated as an injectable service depending on PlayerCore and a Random provider.
 *
 * @original Module 11629
 */

import { __decorate, __param } from '../utils/TsLibHelpers.js';
import { injectable, inject } from '../core/DependencyInjection.js';
import { MILLISECONDS as millisecondsUnit } from '../timing/TimeUnit.js';
import { PlayerCoreToken } from '../core/PlayerCoreToken.js';
import { RandomToken } from '../core/RandomToken.js';

/**
 * Multiplier for converting milliseconds to a higher-resolution ID space.
 * @type {number}
 */
const ID_MULTIPLIER = 1e8;

/**
 * Generates unique IDs for tracking player sessions, requests, and events.
 */
export class IdGenerator {
    /**
     * @param {Object} playerCore - The player core instance (provides system clock)
     * @param {Object} random - Random number generator
     */
    constructor(playerCore, random) {
        this.playerCore = playerCore;
        this.random = random;
    }

    /**
     * Generates a unique numeric ID based on the current system time
     * combined with a random component.
     *
     * @returns {number} A unique numeric identifier
     */
    generateNumericId() {
        return (
            this.playerCore.systemClock.toUnit(millisecondsUnit) * ID_MULTIPLIER +
            Math.floor(this.random.random() * ID_MULTIPLIER)
        );
    }

    /**
     * Generates a random 32-character hexadecimal string.
     * Suitable for use as a session ID, request ID, or correlation ID.
     *
     * @returns {string} A 32-character hex string
     */
    generateHexId() {
        const chars = [];
        for (let i = 0; i < 32; i++) {
            chars.push(Math.floor(16 * this.random.random()).toString(16));
        }
        return chars.join("");
    }
}
