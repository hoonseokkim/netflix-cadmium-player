/**
 * Netflix Cadmium Player — StreamSelectionLogger
 *
 * Debug logging utility for the ABR stream selection process.
 * Outputs detailed information about the current player state, buffer levels,
 * available bitrates, and recent stream switches to aid in debugging
 * adaptive bitrate decisions.
 *
 * @module abr/StreamSelectionLogger
 * @original Module_87775
 */

// import { playerPhase } from '../media/MediaType'; // Module 65161

/**
 * Log detailed stream selection debug information.
 *
 * @param {Object} logger - Console-like logger instance
 * @param {Object} playerState - Current player state
 * @param {number} playerState.state - Player phase enum value
 * @param {number} playerState.startPosition - Current streaming index
 * @param {Object} bufferInfo - Buffer status information
 * @param {number} bufferInfo.ru - Buffer capacity
 * @param {number} bufferInfo.startPts - Buffer start PTS
 * @param {number} bufferInfo.playbackPosition - Current playback position
 * @param {number} bufferInfo.downloadPosition - Download head position
 * @param {number} bufferInfo.fl - Streaming PTS
 * @param {number} bufferInfo.partial - Partial bytes count
 * @param {Array} bufferInfo.fragmentIndex - Fragment index array
 * @param {Array} availableStreams - List of available stream objects
 * @param {Array} recentSelections - Recent stream selection history
 * @param {Object|null} currentStream - Currently selected stream
 * @param {number|null} lastDownSwitchTime - Time of last downward bitrate switch
 * @param {number|null} lastUpSwitchTime - Time of last upward bitrate switch
 */
export function logStreamSelection(
    logger,
    playerState,
    bufferInfo,
    availableStreams,
    recentSelections,
    currentStream,
    lastDownSwitchTime,
    lastUpSwitchTime
) {
    const selectionCount = recentSelections.length;

    logger.log(
        '=================================================================================='
    );
    logger.log(
        `Selecting stream : state = ${playerPhase[playerState.state]}` +
        ` : stream list length = ${availableStreams.length}` +
        ` : current bitrate = ${selectionCount > 0 ? recentSelections[selectionCount - 1].bitrate : currentStream?.bitrate}` +
        ` : streaming index = ${playerState.startPosition}` +
        ` : currentSelectedStream = ${currentStream}`
    );
    logger.log(
        `  Buffer : capacity = ${bufferInfo.ru}` +
        ` : startPts = ${bufferInfo.startPts}` +
        ` : currentPts = ${bufferInfo.playbackPosition}` +
        ` : completePts = ${bufferInfo.downloadPosition}` +
        ` : streamingPts = ${bufferInfo.fl}` +
        ` : level = ${bufferInfo.downloadPosition - bufferInfo.playbackPosition}` +
        ` : partial bytes = ${bufferInfo.partial}` +
        ` : fragment count = ${bufferInfo.fragmentIndex.length}`
    );

    if (lastDownSwitchTime && (!lastUpSwitchTime || lastDownSwitchTime > lastUpSwitchTime)) {
        logger.log(`  Last switch was DOWN, ${bufferInfo.fl - lastDownSwitchTime}ms ago`);
    }
    if (lastUpSwitchTime && (!lastDownSwitchTime || lastDownSwitchTime < lastUpSwitchTime)) {
        logger.log(`  Last switch was UP, ${bufferInfo.fl - lastUpSwitchTime}ms ago`);
    }

    logger.log(
        `  Available bitrates ${availableStreams.map((stream) => stream.DPa())}`
    );
}
