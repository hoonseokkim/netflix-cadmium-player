/**
 * Netflix Cadmium Player — IpAddressUtils
 *
 * Utilities for validating, parsing, and comparing IPv4 and IPv6 addresses.
 * Used for CDN/network selection and subnet matching in the streaming pipeline.
 *
 * @module utils/IpAddressUtils
 * @original Module_37353
 */

// import { lgb as MAX_IPV6_SEGMENT } from './Constants';   // Module 33096
// import { jaa as assertString } from './Assertions';       // Module 45146
// import { uX as ceilDiv } from './MathUtils';              // Module 22365
// import { arrayCheck as isString, EM as isInRange } from './TypeCheckers'; // Module 32687
// import { parseInteger } from './NumberUtils';              // Module 3887

/** @type {RegExp} Pattern matching IPv4-like strings (digits and dots only) */
export const IPV4_PATTERN = /^[0-9.]*$/;

/** @type {RegExp} Pattern matching IPv6-like strings */
export const IPV6_PATTERN = /^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/;

/** @type {string} 16-bit zero-padded binary template for IPv6 group comparison */
export const IPV6_ZERO_PAD = '0000000000000000';

/**
 * Validate and normalize an IPv4 address string.
 * @param {string} address - Candidate IPv4 address
 * @returns {string|undefined} The validated IPv4 string, or undefined if invalid
 */
export function validateIPv4(address) {
    assertString(address);

    if (!isString(address) || !IPV4_PATTERN.test(address)) {
        return undefined;
    }

    const octets = address.split('.');
    if (octets.length !== 4) {
        return undefined;
    }

    for (let i = 0; i < octets.length; i++) {
        const value = parseInteger(octets[i]);
        if (
            value < 0 ||
            !isInRange(value, 0, 255) ||
            (octets[i].length !== 1 && octets[i].indexOf('0') === 0)
        ) {
            return undefined;
        }
    }

    return address;
}

/**
 * Convert an IPv4 address string to a 32-bit integer.
 * @param {string} address - Valid IPv4 address
 * @returns {number|undefined} 32-bit integer representation, or undefined if invalid
 */
export function ipv4ToInt(address) {
    if (validateIPv4(address) !== address) {
        return undefined;
    }

    const octets = address.split('.');
    let result = 0;
    result += parseInteger(octets[0]) << 24;
    result += parseInteger(octets[1]) << 16;
    result += parseInteger(octets[2]) << 8;
    result += parseInteger(octets[3]);
    return result;
}

/**
 * Validate and normalize an IPv6 address string.
 * Handles :: shorthand expansion and embedded IPv4 suffixes.
 * @param {string} address - Candidate IPv6 address
 * @returns {string|undefined} The validated and expanded IPv6 string, or undefined if invalid
 */
export function validateIPv6(address) {
    assertString(address);

    if (!isString(address) || !address.match(IPV6_PATTERN)) {
        return undefined;
    }

    let groups = address.split(':');

    // Handle embedded IPv4 in last group (e.g., ::ffff:192.168.1.1)
    if (groups[groups.length - 1].indexOf('.') !== -1) {
        const ipv4Groups = ipv4ToHexGroups(groups[groups.length - 1]);
        groups.pop();
        groups.push(ipv4Groups[0]);
        groups.push(ipv4Groups[1]);
        address = groups.join(':');
    }

    // Expand :: shorthand
    const parts = address.split('::');
    if (parts.length > 2) {
        return undefined;
    }
    if (parts.length === 1 && groups.length !== 8) {
        return undefined;
    }

    groups = parts.length > 1 ? expandDoubleColon(parts) : groups;

    if (groups.length !== 8) {
        return undefined;
    }

    // Validate each 16-bit group
    for (let i = groups.length; i--; ) {
        const value = parseInt(groups[i], 16);
        if (!isInRange(value, 0, MAX_IPV6_SEGMENT)) {
            return undefined;
        }
    }

    return groups.join(':');
}

/**
 * Convert an IPv4 integer to two 16-bit hex groups for IPv6 embedding.
 * @param {string} ipv4Address - IPv4 address string
 * @returns {string[]} Two hex strings representing the IPv4 address
 */
export function ipv4ToHexGroups(ipv4Address) {
    const intValue = ipv4ToInt(ipv4Address) >>> 0;
    const groups = [];
    groups.push(((intValue >>> 16) & 0xffff).toString(16));
    groups.push((intValue & 0xffff).toString(16));
    return groups;
}

/**
 * Expand :: notation in IPv6 into full 8-group representation.
 * @param {string[]} parts - The two halves split by ::
 * @returns {string[]} Expanded array of 8 groups
 */
export function expandDoubleColon(parts) {
    const left = parts[0].split(':');
    const right = parts[1].split(':');

    const leftGroups = left.length === 1 && left[0] === '' ? [] : left;
    const rightGroups = right.length === 1 && right[0] === '' ? [] : right;

    const missingCount = 8 - (leftGroups.length + rightGroups.length);
    if (missingCount < 1) {
        return [];
    }

    const result = [...leftGroups];
    for (let i = 0; i < missingCount; i++) {
        result.push('0');
    }
    for (let i = 0; i < rightGroups.length; i++) {
        result.push(rightGroups[i]);
    }
    return result;
}

/**
 * Check if two IP addresses are in the same subnet.
 * Works for both IPv4 and IPv6 addresses.
 * @param {string} address1 - First IP address
 * @param {string} address2 - Second IP address
 * @param {number} prefixLength - CIDR prefix length (subnet mask bits)
 * @returns {boolean} Whether both addresses are in the same subnet
 */
export function isInSameSubnet(address1, address2, prefixLength) {
    const isIPv4_1 = validateIPv4(address1);
    const isIPv6_1 = validateIPv6(address1);
    const isIPv4_2 = validateIPv4(address2);
    const isIPv6_2 = validateIPv6(address2);

    // Both must be valid and same type
    if ((!isIPv4_1 && !isIPv6_1) || (!isIPv4_2 && !isIPv6_2)) return false;
    if (isIPv4_1 && !isIPv4_2) return false;
    if (isIPv6_1 && !isIPv6_2) return false;

    // IPv4 subnet comparison
    if (address1 === isIPv4_1) {
        const mask = createIPv4Mask(prefixLength);
        return (ipv4ToInt(address1) & mask) === (ipv4ToInt(address2) & mask);
    }

    // IPv6 subnet comparison
    if (address1 === isIPv6_1) {
        const groups1 = address1.split(':');
        const groups2 = address2.split(':');

        // Compare full 16-bit groups
        let groupIndex = ceilDiv(prefixLength / IPV6_ZERO_PAD.length);
        for (; groupIndex--; ) {
            if (groups1[groupIndex] !== groups2[groupIndex]) {
                return false;
            }
        }

        // Compare remaining bits within a partial group
        const remainingBits = prefixLength % IPV6_ZERO_PAD.length;
        if (remainingBits !== 0) {
            const binary1 = parseInt(groups1[groupIndex], 16).toString(2);
            const binary2 = parseInt(groups2[groupIndex], 16).toString(2);
            const padded1 =
                IPV6_ZERO_PAD.substring(0, IPV6_ZERO_PAD.length - binary1.length) + binary1;
            const padded2 =
                IPV6_ZERO_PAD.substring(0, IPV6_ZERO_PAD.length - binary2.length) + binary2;

            for (let i = 0; i < remainingBits; i++) {
                if (padded1[i] !== padded2[i]) {
                    return false;
                }
            }
        }

        return true;
    }

    return false;
}

/**
 * Create a 32-bit subnet mask from a CIDR prefix length.
 * @param {number} prefixLength - Number of leading 1-bits (0-32)
 * @returns {number} 32-bit mask
 */
export function createIPv4Mask(prefixLength) {
    return -1 << (32 - prefixLength);
}
