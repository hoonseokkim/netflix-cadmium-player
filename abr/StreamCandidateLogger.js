/**
 * Stream Candidate Logger
 *
 * Debug utility that logs the full list of candidate streams during
 * ABR stream selection, highlighting the currently selected stream
 * with ">>". For each stream entry it prints: stream ID, bitrate,
 * availability, filter status, readiness for selection, auto-select
 * eligibility, CDN location, and buffer length.
 *
 * @module StreamCandidateLogger
 * @source Module_79257
 */

import { i0 as forEachWithIndex } from '../core/Asejs';

/**
 * Log all candidate streams to the console, marking the selected one.
 *
 * @param {Object} console        - Logger instance with pauseTrace().
 * @param {Object} streamList     - Stream list object with TL() iterator.
 * @param {Object} selectedStream - The currently selected stream to highlight.
 */
export function logStreamCandidates(console, streamList, selectedStream) {
    streamList.TL(function (stream) {
        forEachWithIndex(stream, function (entry, index) {
            console.pauseTrace(
                `${entry === selectedStream ? ">>" : "  "}` +
                `[${index}] ${entry.selectedStreamId}` +
                ` b(${entry.bitrate})` +
                ` avail(${entry.isPlayable})` +
                ` failed(${entry.isFiltered})` +
                ` isUsable(${entry.isReadyForSelection})` +
                ` fittable(${entry.canAutoSelect})` +
                ` loc(${entry.location})` +
                ` tp(${entry.bufferLength})`
            );
        });
    });
}

export { logStreamCandidates };
