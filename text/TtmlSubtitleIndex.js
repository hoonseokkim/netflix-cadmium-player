/**
 * TTML Subtitle Index
 *
 * Parses TTML (Timed Text Markup Language) subtitle documents and builds
 * an index of all <p> elements with their start/end times. Supports both
 * tick-based (integer) and clock-time (HH:MM:SS.mmm) timestamp formats.
 *
 * Provides methods to query subtitle ranges, check overlap, and extract
 * subtitle text for a given playback time.
 *
 * @module TtmlSubtitleIndex
 * @source Module_96379
 */
export default function TtmlSubtitleIndex(module, exports, require) {
    var parseClockTime;

    /**
     * Builds a subtitle index from a TTML document string.
     *
     * @param {string} ttmlText - Raw TTML XML text
     * @param {number} tickRate - The tick rate for tick-based timestamps
     */
    function TtmlSubtitleIndexClass(ttmlText, tickRate) {
        var firstParagraphPos, entries, currentPos, latestEnd, entry,
            beginPos, endPos, timeStr;

        this.isTickBased = true;
        firstParagraphPos = ttmlText.indexOf("<p");
        entries = [];
        currentPos = firstParagraphPos;
        latestEnd = -1;

        do {
            entry = {};
            entry.paragraphStartOffset = currentPos;

            beginPos = ttmlText.indexOf("begin=", currentPos) + 7;
            endPos = ttmlText.indexOf("end=", currentPos) + 5;
            timeStr = ttmlText.substr(beginPos, 12);

            // Detect format on first paragraph: if contains ":", it's clock time
            if (currentPos === firstParagraphPos && -1 !== timeStr.indexOf(":")) {
                this.isTickBased = false;
            }

            var startTimeMs, endTimeMs;
            if (this.isTickBased) {
                // Tick-based: convert ticks to milliseconds using tickRate
                startTimeMs = Math.floor(parseInt(ttmlText.substr(beginPos, 25), 10) / tickRate * 1000);
                endTimeMs = Math.floor(parseInt(ttmlText.substr(endPos, 25), 10) / tickRate * 1000);
            } else {
                // Clock time format (HH:MM:SS.mmm)
                startTimeMs = parseClockTime(ttmlText.substr(beginPos, 12));
                endTimeMs = parseClockTime(ttmlText.substr(endPos, 12));
            }

            latestEnd = endTimeMs > latestEnd ? endTimeMs : latestEnd;

            entry.startTime = startTimeMs;
            entry.endTime = endTimeMs;
            entry.latestEndSoFar = latestEnd;
            entry.paragraphEndOffset = ttmlText.indexOf("/p>", currentPos) + 3;

            currentPos = entry.paragraphEndOffset;
            entries.push(entry);
            currentPos = ttmlText.indexOf("<p", currentPos);
        } while (-1 !== currentPos);

        this.subtitleTrackList = entries;
        this.rawTtmlText = ttmlText;
    }

    parseClockTime = require(4574).wL;

    /**
     * Returns the end time of the last subtitle entry.
     * @returns {number} End time in milliseconds
     */
    TtmlSubtitleIndexClass.prototype.getLastEndTime = function () {
        return this.subtitleTrackList[this.subtitleTrackList.length - 1].endTime;
    };

    /**
     * Counts how many subtitle entries overlap the given time range.
     *
     * @param {number} startMs - Range start in milliseconds
     * @param {number} endMs - Range end in milliseconds
     * @returns {number} Number of overlapping subtitle entries
     */
    TtmlSubtitleIndexClass.prototype.overlapsRange = function (startMs, endMs) {
        return this.subtitleTrackList.filter(function (entry) {
            return entry.startTime <= endMs && entry.endTime >= startMs;
        }).length;
    };

    /**
     * Extracts the TTML paragraph text for subtitles visible at the given time.
     * Returns up to 5 visible paragraphs (plus any that share the same start time
     * as the 5th).
     *
     * @param {number} timeMs - Current playback time in milliseconds
     * @returns {string} Raw TTML paragraph text for visible subtitles
     */
    TtmlSubtitleIndexClass.prototype.getVisibleSubtitles = function (timeMs) {
        var result = "";
        var visibleEntries = this.subtitleTrackList.filter(function (entry) {
            return (entry.startTime <= timeMs && timeMs < entry.endTime) ||
                   entry.startTime >= timeMs;
        });

        // Include up to 5 entries, extending to include all with same start time as 5th
        var lastIndex = 4;
        while (lastIndex + 1 < visibleEntries.length &&
               visibleEntries[lastIndex + 1].startTime === visibleEntries[4].startTime) {
            lastIndex++;
        }
        visibleEntries = visibleEntries.slice(0, lastIndex + 1);

        if (visibleEntries.length > 0) {
            result = this.rawTtmlText.slice(
                visibleEntries[0].paragraphStartOffset,
                visibleEntries[visibleEntries.length - 1].paragraphEndOffset
            );
        }

        return result;
    };

    module.exports = TtmlSubtitleIndexClass;
}
