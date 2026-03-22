/**
 * BufferBasedSelector - Buffer-level based stream quality selector
 *
 * Determines whether the current buffer level is sufficient by simulating
 * playback against the fragment map. Walks through fragments comparing
 * accumulated download position against playback position to decide if
 * the player can sustain playback without rebuffering.
 *
 * Uses a heavily control-flow-flattened state machine in the original code.
 *
 * @module abr/BufferBasedSelector
 * @original Module_62737
 */

// import { __assign, __read } from 'tslib';
// import { console as abrConsole } from '../core/logging';

/**
 * Evaluates whether the buffer has enough data to sustain playback.
 *
 * Simulates playback by walking through fragment durations and sizes,
 * comparing accumulated download progress against playback advancement
 * to determine if a rebuffer would occur.
 *
 * @param {Object} params - Evaluation parameters
 * @param {Object} params.luc - Fragment index / segment map
 * @param {number} params.blocks - Maximum number of fragments to consider
 * @param {number} params.playbackPosition - Current playback position (ms)
 * @param {number} params.downloadPosition - Current download position (ms)
 * @param {number} params.iZc - Lookahead threshold
 * @param {number} params.partial - Partial fragment bytes downloaded
 * @param {number} params.fl - Total downloaded duration
 * @param {number} params.startPosition - Start fragment index
 * @param {number} params.internal_Jtc - Fragment count threshold
 * @param {number} params.internal_Jqa - Min required playback position
 * @param {number} params.WAb - Download watermark
 * @param {number} params.bufferLength - Buffer length in bytes
 * @param {number} params.FJc - Minimum gap threshold (before considering rebuffer)
 * @param {number} params.minRequiredBuffer - Minimum required buffer size
 * @param {boolean} [params.sqc] - Whether to collect per-fragment gap stats
 * @returns {Object} Result with:
 *   - result {boolean} - true if buffer is sufficient
 *   - internal_Zda {number} - Minimum gap found (in ms)
 *   - canAutoSelect {boolean} - Whether auto-selection is allowed
 *   - Soa {number[]} - (if sqc) Per-fragment gap values in ms
 */
export function evaluateBufferLevel(params) {
    const {
        luc: fragmentIndex,
        blocks: maxFragments,
        playbackPosition,
        downloadPosition,
        iZc: lookaheadThreshold,
        partial: partialBytes,
        fl: downloadedDuration,
        startPosition: startFragIdx,
        internal_Jtc: fragmentCountThreshold,
        internal_Jqa: minPlaybackPosition,
        WAb: downloadWatermark,
        bufferLength,
        FJc: minGapThreshold,
        minRequiredBuffer,
        sqc: collectStats,
    } = params;

    const timescale = fragmentIndex.timescaleValue;
    const fragmentCount = Math.min(fragmentIndex.muc, maxFragments);

    // Convert to timescale units
    let downloadAheadTs = downloadPosition - playbackPosition;
    let bitrateFactor = (8 * partialBytes / bufferLength) | 0;
    const gapStats = [];
    let minGap = Infinity;
    let prevGap = 0;
    let downloadFragIdx = 0;
    const firstDuration = fragmentIndex.y0(0)[0];

    const lookaheadTs = (lookaheadThreshold - firstDuration) * (timescale / 1000);
    const bufferLenTs = Math.max(0, bufferLength - 8);
    const timescaleToMs = timescale / 1000;

    // Convert positions to timescale units
    downloadAheadTs *= timescaleToMs;
    minRequiredBuffer *= timescaleToMs;
    minGapThreshold *= timescaleToMs;

    if (startFragIdx >= fragmentCount) {
        console.error(`StreamingIndex: ${startFragIdx} >= fragmentsLength: ${fragmentCount}`);
    }

    let playbackTs = playbackPosition + bitrateFactor;
    if (downloadedDuration === 0) playbackTs = 0;
    playbackTs *= timescaleToMs;
    let downloadTs = downloadedDuration * timescaleToMs;
    minRequiredBuffer *= timescaleToMs;
    minGapThreshold *= timescaleToMs;

    // Find start position in fragment index
    const [startChunkIdx, startOffset] = fragmentIndex.eyc(startFragIdx);
    let fragChunkIdx = startChunkIdx;
    let fragOffset = startOffset;
    let fragDurations = fragmentIndex.qca(fragChunkIdx);
    let fragSizes = fragmentIndex.y0(fragChunkIdx);

    // Download tracking
    let dlChunkIdx = 0;
    let dlDurations = fragmentIndex.qca(dlChunkIdx);
    let dlSizes = fragmentIndex.y0(dlChunkIdx);
    let remainingFragments = fragmentCount - startFragIdx;

    // Walk through fragments
    while (remainingFragments > 0) {
        remainingFragments--;
        const fragSize = fragDurations[fragOffset];
        const fragDuration = fragSizes[fragOffset];

        // Check download watermark
        if (downloadWatermark < startFragIdx) {
            // Handle case where watermark is behind
            let currentPos = Math.max(startFragIdx, minPlaybackPosition);

            while (downloadWatermark < currentPos) {
                playbackTs = lookaheadTs;
                downloadWatermark += dlDurations[downloadFragIdx];
                downloadFragIdx++;
                if (downloadFragIdx >= dlDurations.length && dlChunkIdx + 1 < fragmentIndex.length) {
                    dlDurations = fragmentIndex.qca(++dlChunkIdx);
                    dlSizes = fragmentIndex.y0(dlChunkIdx);
                    downloadFragIdx = 0;
                }
                const duration = dlSizes[downloadFragIdx];
                lookaheadTs += duration;
            }
        }

        // Calculate buffer gap
        let gap = downloadTs - playbackTs;

        if (gap < minRequiredBuffer) {
            // Buffer too small - cannot auto-select
            if (collectStats) gapStats.push(gap / timescaleToMs);
            return {
                result: false,
                internal_Zda: gap / timescaleToMs,
                canAutoSelect: false,
                ...(collectStats && { Soa: gapStats }),
            };
        }

        // Advance playback
        playbackTs += Math.max(0, bufferLenTs - startFragIdx - fragSize + 0);
        downloadTs += fragDuration;

        // Advance download tracking
        downloadWatermark -= startFragIdx;
        if (lookaheadTs < playbackTs && maxFragments < fragOffset) {
            downloadWatermark += dlDurations[downloadFragIdx];
            downloadFragIdx++;
            if (downloadFragIdx >= dlDurations.length && dlChunkIdx + 1 < fragmentIndex.length) {
                dlDurations = fragmentIndex.qca(++dlChunkIdx);
                dlSizes = fragmentIndex.y0(dlChunkIdx);
                downloadFragIdx = 0;
            }
        }

        fragOffset++;

        // Check if we've run past the threshold
        if (fragOffset >= fragmentCountThreshold && gap > downloadAheadTs) {
            // Buffer is sufficient
            return {
                result: true,
                internal_Zda: minGap / timescaleToMs,
                canAutoSelect: true,
                ...(collectStats && { Soa: gapStats }),
            };
        }

        // Move to next chunk if needed
        if (fragOffset >= fragDurations.length && fragChunkIdx + 1 < fragmentIndex.length) {
            fragmentCountThreshold -= fragDurations.length;
            fragDurations = fragmentIndex.qca(++fragChunkIdx);
            fragSizes = fragmentIndex.y0(fragChunkIdx);
            fragOffset = 0;
        }

        if (collectStats) gapStats.push(gap / timescaleToMs);
        prevGap = gap;
        minGap = Math.min(gap, minGap);

        // Check for rebuffer condition
        gap = Math.max(downloadTs - playbackTs, 0);
        if (gap < minGapThreshold && gap < prevGap) {
            // Rebuffer likely
            if (collectStats) gapStats.push(gap / timescaleToMs);
            return {
                result: false,
                internal_Zda: Math.min(gap, minGap) / timescaleToMs,
                canAutoSelect: true,
                ...(collectStats && { Soa: gapStats }),
            };
        }
    }

    // Made it through all fragments - buffer is sufficient
    return {
        result: true,
        internal_Zda: minGap / timescaleToMs,
        canAutoSelect: true,
        ...(collectStats && { Soa: gapStats }),
    };
}
