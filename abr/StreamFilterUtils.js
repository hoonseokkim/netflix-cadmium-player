/**
 * Netflix Cadmium Player - StreamFilterUtils
 *
 * Utility functions for filtering and partitioning streams during adaptive
 * bitrate (ABR) selection. Produces allowed-range descriptors per profile,
 * tracks which streams were disallowed and why, and exposes a combined
 * "filter then build ranges" helper.
 *
 * Originally: Module 13494
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Given a full list of streams, a subset of allowed streams, and an optional
 * list of disallowed entries, builds per-profile bitrate range descriptors.
 *
 * Each descriptor contains:
 *   - `profile`  : the codec profile name
 *   - `ranges`   : array of `{ min, max }` bitrate bounds
 *   - `disallowed`: (optional) array of `{ stream: { bitrate }, disallowedBy }` entries
 *
 * @param {Array<{ profileName: string }>} allStreams - All candidate streams.
 * @param {Array<{ bitrate: number }>} allowedStreams - Streams that passed filtering.
 * @param {Array<{ stream: { profileName: string, bitrate: number }, disallowedBy: string }>} [disallowedEntries]
 *   Streams that were rejected, with the reason.
 * @returns {Array<{ profile: string, ranges: Array<{ min: number, max: number }>, disallowed?: Array }>}
 */
function buildProfileBitrateRanges(allStreams, allowedStreams, disallowedEntries) {
    // Collect unique profile names
    const profiles = [];
    allStreams.forEach((stream) => {
        if (profiles.indexOf(stream.profileName) === -1) {
            profiles.push(stream.profileName);
        }
    });

    // Determine min/max bitrate across allowed streams
    let minBitrate = null;
    let maxBitrate = null;
    allowedStreams.forEach((stream) => {
        if (minBitrate === null) {
            minBitrate = stream.bitrate;
            maxBitrate = stream.bitrate;
        } else {
            if (maxBitrate < stream.bitrate) {
                maxBitrate = stream.bitrate;
            }
            if (minBitrate > stream.bitrate) {
                minBitrate = stream.bitrate;
            }
        }
    });

    // Build per-profile range descriptors
    const result = [];
    profiles.forEach((profile) => {
        const descriptor = {
            ranges: [],
            profile,
        };

        if (minBitrate && maxBitrate) {
            descriptor.ranges.push({ min: minBitrate, max: maxBitrate });

            if (disallowedEntries) {
                descriptor.disallowed = disallowedEntries
                    .filter((entry) => entry.stream.profileName === profile)
                    .map((entry) => ({
                        stream: { bitrate: entry.stream.bitrate },
                        disallowedBy: entry.disallowedBy,
                    }));
            }

            result.push(descriptor);
        }
    });

    return result;
}

/**
 * Partitions a list of streams using a predicate function.
 *
 * The predicate should return a truthy string (the reason) if the stream is
 * disallowed, or a falsy value if the stream is allowed.
 *
 * @param {Array<Object>} streams - Candidate streams to partition.
 * @param {function(Object): string|null} disallowPredicate - Returns a reason
 *   string if the stream should be disallowed, or null/undefined if allowed.
 * @returns {{ allowedStreams: Array<Object>, disallowedEntries: Array<{ stream: Object, disallowedBy: string }>|undefined }}
 */
function partitionStreams(streams, disallowPredicate) {
    let disallowedEntries = undefined;

    const allowedStreams = streams.filter((stream) => {
        const reason = disallowPredicate(stream);
        if (reason) {
            disallowedEntries = disallowedEntries || [];
            disallowedEntries.push({
                stream,
                disallowedBy: reason,
            });
        }
        return !reason;
    });

    return {
        allowedStreams,
        disallowedEntries,
    };
}

/**
 * Filters streams using a predicate and builds per-profile bitrate range
 * descriptors from the allowed subset.
 *
 * Convenience wrapper combining {@link partitionStreams} and
 * {@link buildProfileBitrateRanges}.
 *
 * @param {Array<Object>} streams - All candidate streams.
 * @param {function(Object): string|null} disallowPredicate - Disallow predicate.
 * @returns {Array<{ profile: string, ranges: Array<{ min: number, max: number }>, disallowed?: Array }>}
 */
function filterAndBuildRanges(streams, disallowPredicate) {
    const { allowedStreams, disallowedEntries } = partitionStreams(streams, disallowPredicate);
    return buildProfileBitrateRanges(streams, allowedStreams, disallowedEntries);
}

export { filterAndBuildRanges, buildProfileBitrateRanges, partitionStreams };

// Legacy obfuscated-name aliases
export {
    filterAndBuildRanges as lAc,
    buildProfileBitrateRanges as buildProfileBitrateRanges,
    partitionStreams as SD,
};
