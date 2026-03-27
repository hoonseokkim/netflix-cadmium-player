/**
 * Netflix Cadmium Player — CDN Partitioner
 *
 * Partitions streaming URLs across CDN nodes for redundancy.
 * For each stream (video, audio, text), assigns a primary and secondary
 * CDN URL based on ranked CDN locations, ensuring the primary and
 * secondary come from different CDN nodes when possible.
 *
 * @module network/CdnPartitioner
 * @original Module_12394
 */

import { __decorate, __param } from '../ads/AdBreakMismatchLogger.js'; // tslib decorators
import { injectable, injectDecorator } from '../ads/AdBreakMismatchLogger.js'; // DI framework
import { LoggerToken } from '../ads/AdVisibilityTracker.js';

/**
 * Partitions CDN URLs across streams to maximize redundancy.
 *
 * Given a set of video, audio, and text streams each with multiple CDN URLs,
 * this class assigns a primary and secondary URL to each stream. It tries to
 * ensure the primary and secondary are served from different CDN nodes.
 */
class CdnPartitioner {
  /**
   * @param {object} logger - Logger service instance.
   */
  constructor(logger) {
    /** @private */
    this.logger = logger.createSubLogger('CdnPartitionerImpl');
  }

  /**
   * Partition CDN URLs for all media streams.
   *
   * For each stream, selects a primary and secondary URL from different
   * CDN nodes (when available), preferring higher-ranked CDNs.
   *
   * @param {object} manifest - The manifest containing stream information.
   * @param {Array} manifest.videoBufferedSegments - Video stream descriptors.
   * @param {Array} manifest.audioBufferedSegments - Audio stream descriptors.
   * @param {Array} manifest.TEXT_MEDIA_TYPE - Text/subtitle track descriptors.
   * @param {Array} manifest.$k - CDN location descriptors with id and rank.
   * @returns {Map<string, {primary: object, secondary: object}>} Map of stream ID to CDN assignments.
   */
  partitionCdnUrls(manifest) {
    const primaryNodes = new Set();
    const secondaryNodes = new Set();
    const partitionMap = new Map();

    const videoStreams = manifest.videoBufferedSegments;
    const audioStreams = manifest.audioBufferedSegments;
    const textTracks = manifest.TEXT_MEDIA_TYPE;

    // Build CDN rank lookup: urlId -> rank
    const cdnRanks = manifest.$k.reduce((ranks, cdn) => {
      ranks[cdn.id] = cdn.rank;
      return ranks;
    }, {});

    /**
     * Assign primary and secondary CDN URLs for a given stream.
     *
     * @param {Array} urls - Available CDN URLs for the stream.
     * @param {object} rankLookup - Map of urlId to rank (lower = better).
     * @param {string} streamId - Unique stream identifier.
     */
    function assignCdnPair(urls, rankLookup, streamId) {
      const urlIds = urls.map((url) => url.urlId);
      urlIds.sort((a, b) => rankLookup[a] - rankLookup[b]);

      if (urlIds.length === 1) {
        partitionMap.set(streamId, {
          primary: urls[0],
          secondary: urls[0],
        });
        return;
      }

      // Select primary: prefer an already-used primary node, else pick a fresh one
      let primaryId = urlIds.find((id) => primaryNodes.has(id));
      if (!primaryId) {
        primaryId = urlIds.find((id) => !secondaryNodes.has(id));
        if (primaryId) {
          primaryNodes.add(primaryId);
        } else {
          primaryId = urlIds[0];
        }
      }

      // Select secondary: prefer an already-used secondary node, else pick a fresh one
      let secondaryId = urlIds.find((id) => secondaryNodes.has(id) && id !== primaryId);
      if (!secondaryId) {
        secondaryId = urlIds.find((id) => !primaryNodes.has(id) && id !== primaryId);
        if (secondaryId) {
          secondaryNodes.add(secondaryId);
        } else {
          secondaryId = urlIds.find((id) => id !== primaryId);
        }
      }

      partitionMap.set(streamId, {
        primary: urls.find((u) => u.urlId === primaryId),
        secondary: urls.find((u) => u.urlId === secondaryId),
      });
    }

    // Partition video streams
    videoStreams.forEach((segment) => {
      const stream = segment.stream;
      assignCdnPair(stream.urls, cdnRanks, stream.sh);
    });

    // Partition audio streams
    audioStreams.forEach((segment) => {
      const stream = segment.stream;
      assignCdnPair(stream.urls, cdnRanks, stream.sh);
    });

    // Partition text tracks (skip disabled/empty tracks)
    textTracks.forEach((track) => {
      if (!track.track.isNone || track.track.mda) {
        const stream = track.stream;
        const trackId = track.id;
        // For text, rank by URL order (position-based)
        const positionRanks = stream.urls.reduce((ranks, url, index) => {
          ranks[url.urlId] = index + 1;
          return ranks;
        }, {});
        assignCdnPair(stream.urls, positionRanks, trackId);
      }
    });

    return partitionMap;
  }
}

export { CdnPartitioner };

// Apply DI decorators
const DecoratedCdnPartitioner = __decorate(
  [
    injectable(),
    __param(0, injectDecorator(LoggerToken)),
  ],
  CdnPartitioner,
);

export { DecoratedCdnPartitioner };
