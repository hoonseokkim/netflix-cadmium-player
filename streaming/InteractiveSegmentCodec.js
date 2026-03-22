/**
 * Netflix Cadmium Player — InteractiveSegmentCodec
 *
 * Encoder/decoder for interactive (branching narrative) content segment maps.
 * Handles serialization between the internal player representation and the
 * compact wire format used by Netflix's interactive content system
 * (e.g., Bandersnatch-style choose-your-own-adventure content).
 *
 * Wire format uses short property names (J, fe, Ef, eb, Oc, km, etc.)
 * which are expanded to human-readable names on decode and compressed on encode.
 *
 * @module streaming/InteractiveSegmentCodec
 * @original Module_42405
 */

/**
 * Codec for interactive content segment data.
 * Converts between compact wire format and expanded player-internal format.
 */
export class InteractiveSegmentCodec {
    /**
     * Decode a wire-format interactive content manifest into player format.
     * @param {Object} wireData - Compact wire-format data
     * @param {*} wireData.initialSegment - The initial segment identifier
     * @param {Object} wireData.segments - Map of segment IDs to compact segment data
     * @param {string} [wireData.fe] - Transition type (optional)
     * @returns {Object} Expanded segment manifest
     */
    static decode(wireData) {
        return Object.assign(
            {
                initialSegment: wireData.initialSegment,
                segments: InteractiveSegmentCodec.#decodeSegmentsMap(wireData.segments),
            },
            wireData.fe !== undefined ? { transitionType: wireData.fe } : {}
        );
    }

    /**
     * Encode a player-format interactive content manifest to wire format.
     * @param {Object} playerData - Expanded player-format data
     * @param {*} playerData.initialSegment - The initial segment identifier
     * @param {Object} playerData.segments - Map of segment IDs to expanded segment data
     * @param {string} [playerData.transitionType] - Transition type (optional)
     * @returns {Object} Compact wire-format data
     */
    static encode(playerData) {
        return Object.assign(
            {
                Ef: playerData.initialSegment,
                segments: InteractiveSegmentCodec.#encodeSegmentsMap(playerData.segments),
            },
            playerData.transitionType !== undefined
                ? { fe: playerData.transitionType }
                : {}
        );
    }

    /**
     * Encode a map of segments from player format to wire format.
     * @param {Object} segments - Map of segment ID to expanded segment objects
     * @returns {Object} Map of segment ID to compact segment objects
     */
    static #encodeSegmentsMap(segments) {
        return Object.keys(segments).reduce((result, key) => {
            result[key] = InteractiveSegmentCodec.#encodeSegment(segments[key]);
            return result;
        }, {});
    }

    /**
     * Encode a single segment from player format to wire format.
     * @param {Object} segment - Expanded segment data
     * @returns {Object} Compact wire-format segment
     */
    static #encodeSegment(segment) {
        return Object.assign(
            {
                J: segment.viewableId,
                startTimeMs: segment.startTimeMs,
            },
            segment.endTimeMs ? { eb: segment.endTimeMs } : {},
            segment.defaultNext ? { Oc: segment.defaultNext } : {},
            segment.weight ? { weight: segment.weight } : {},
            segment.transitionType ? { fe: segment.transitionType } : {},
            segment.next
                ? { next: InteractiveSegmentCodec.#encodeNextMap(segment.next) }
                : {},
            segment.exitZones ? { km: segment.exitZones } : {},
            segment.playbackRate ? { playbackRate: segment.playbackRate } : {},
            segment.uxSegment ? { J8a: segment.uxSegment } : {},
            segment.type ? { type: segment.type } : {},
            segment.fadeIn !== undefined ? { Ls: segment.fadeIn } : {},
            segment.fadeOut !== undefined ? { Sq: segment.fadeOut } : {},
            segment.main !== undefined ? { Mp: segment.main } : {}
        );
    }

    /**
     * Encode the "next" choices map from player to wire format.
     * @param {Object} nextMap - Map of choice ID to expanded choice data
     * @returns {Object} Map of choice ID to compact choice data
     */
    static #encodeNextMap(nextMap) {
        return Object.keys(nextMap).reduce((result, key) => {
            result[key] = InteractiveSegmentCodec.#encodeNextEntry(nextMap[key]);
            return result;
        }, {});
    }

    /**
     * Encode a single "next" choice entry.
     * @param {Object} entry - { weight?, transitionType? }
     * @returns {Object} Compact format
     */
    static #encodeNextEntry(entry) {
        return Object.assign(
            {},
            entry.weight !== undefined ? { weight: entry.weight } : {},
            entry.transitionType ? { fe: entry.transitionType } : {}
        );
    }

    /**
     * Decode a map of segments from wire format to player format.
     * @param {Object} wireSegments - Map of segment ID to compact segment objects
     * @returns {Object} Map of segment ID to expanded segment objects
     */
    static #decodeSegmentsMap(wireSegments) {
        return Object.keys(wireSegments).reduce((result, key) => {
            result[key] = InteractiveSegmentCodec.#decodeSegment(wireSegments[key]);
            return result;
        }, {});
    }

    /**
     * Decode a single segment from wire format to player format.
     * @param {Object} wire - Compact wire-format segment
     * @returns {Object} Expanded segment data
     */
    static #decodeSegment(wire) {
        return Object.assign(
            {
                viewableId: wire.J,
                startTimeMs: wire.startTimeMs,
            },
            wire.contentEndPts ? { endTimeMs: wire.contentEndPts } : {},
            wire.defaultNext ? { defaultNext: wire.defaultNext } : {},
            wire.weight ? { weight: wire.weight } : {},
            wire.fe ? { transitionType: wire.fe } : {},
            wire.next
                ? { next: InteractiveSegmentCodec.#decodeNextMap(wire.next) }
                : {},
            wire.km ? { exitZones: wire.km } : {},
            wire.playbackRate ? { playbackRate: wire.playbackRate } : {},
            wire.uxSegment ? { uxSegment: wire.uxSegment } : {},
            wire.type ? { type: wire.type } : {},
            wire.fadeIn !== undefined ? { fadeIn: wire.fadeIn } : {},
            wire.fadeOut !== undefined ? { fadeOut: wire.fadeOut } : {},
            wire.main !== undefined ? { main: wire.main } : {}
        );
    }

    /**
     * Decode the "next" choices map from wire to player format.
     * @param {Object} wireNext - Map of choice ID to compact choice data
     * @returns {Object} Map of choice ID to expanded choice data
     */
    static #decodeNextMap(wireNext) {
        return Object.keys(wireNext).reduce((result, key) => {
            result[key] = InteractiveSegmentCodec.#decodeNextEntry(wireNext[key]);
            return result;
        }, {});
    }

    /**
     * Decode a single "next" choice entry.
     * @param {Object} wire - { weight?, fe? }
     * @returns {Object} Expanded format { weight?, transitionType? }
     */
    static #decodeNextEntry(wire) {
        return Object.assign(
            {},
            wire.weight !== undefined ? { weight: wire.weight } : {},
            wire.fe ? { transitionType: wire.fe } : {}
        );
    }
}
