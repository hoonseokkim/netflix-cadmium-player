/**
 * Netflix Cadmium Player — ManifestTransformer
 *
 * Orchestrates the full transformation of a raw parsed manifest into the
 * internal playback model. Combines the work of the CDN filter, timed-text
 * parser, audio track parser, video track parser, and trickplay parser to
 * produce a unified `ParsedManifest` object with default track selections.
 *
 * Also handles auxiliary (supplemental) manifest merging: when an auxiliary
 * manifest is fetched, it reconciles tracks, CDN locations, and stream data
 * with the primary manifest.
 *
 * @module manifest/ManifestTransformer
 */

// import { asMutable } from '../modules/Module_64274';

export class ManifestTransformer {
  /**
   * @param {Object} cdnFilter          - Filters and reorders CDN endpoints.
   * @param {Object} timedTextParser    - Parses timed-text (subtitle) tracks.
   * @param {Object} trickplayParser    - Parses trickplay (thumbnail) tracks.
   * @param {Object} audioTrackParser   - Parses audio tracks.
   * @param {Object} videoTrackParser   - Parses video tracks.
   */
  constructor(cdnFilter, timedTextParser, trickplayParser, audioTrackParser, videoTrackParser) {
    this.cdnFilter = cdnFilter;
    this.timedTextParser = timedTextParser;
    this.trickplayParser = trickplayParser;
    this.audioTrackParser = audioTrackParser;
    this.videoTrackParser = videoTrackParser;
  }

  /**
   * Transform a parsed manifest response into the full playback model.
   *
   * @param {Object} parsedManifest - The raw parsed manifest from the API.
   * @returns {Object} Complete playback model with selected defaults:
   *   - `cdnEndpoints`, `audioTracks`, `videoTracks`, `timedTextTracks`,
   *     `trickplayTracks`, `defaultVideoTrack`, `defaultAudioTrack`,
   *     `defaultTextTrack`, `playbackContextId`, etc.
   */
  transformManifest(parsedManifest) {
    const manifest = parsedManifest.manifestContent;
    const correlationContext = {
      correlationId: manifest.cdnResponseData?.pbcid ?? '',
      contentType: manifest.execPointer ? 'ads' : 'content',
    };

    const isRecommendedMedia = !!manifest.recommendedMedia;

    // 1. Filter CDN endpoints
    const cdnEndpoints = this.cdnFilter.filterCDNs(manifest.cdnEndpointsList, manifest.locations);

    // 2. Parse timed-text tracks
    const timedTextTracks = this.timedTextParser.parse(correlationContext, manifest.timedtexttracks);

    // 3. Parse trickplay tracks
    const trickplayTracks = this.trickplayParser.parseTrickplayTracks(manifest.trickplays);

    // 4. Parse audio tracks (method depends on whether this is a recommended-media manifest)
    const audioTracks = isRecommendedMedia
      ? this.audioTrackParser.parseFromManifest(correlationContext, manifest.audio_tracks, timedTextTracks)
      : this.audioTrackParser.transformFromSupplemental(
          correlationContext,
          manifest.audio_tracks,
          manifest.media,
          timedTextTracks
        );

    // 5. Parse video tracks
    const videoTracks = this.videoTrackParser.parseVideoTracks(correlationContext, manifest.video_tracks);

    // 6. Select default tracks
    const defaultVideoTrack =
      videoTracks.find(function (t) {
        return isRecommendedMedia
          ? t.trackId === manifest.recommendedMedia.trackIdentifier
          : t.trackId === manifest.defaultTrackOrderList[0].trackIdentifier;
      }) || videoTracks[0];

    const defaultAudioTrack =
      this.audioTrackParser.selectPreferredTrack(audioTracks) ||
      audioTracks.find(function (t) {
        return isRecommendedMedia
          ? t.trackId === manifest.recommendedMedia.audioTrackId
          : t.trackId === manifest.defaultTrackOrderList[0].audioTrackId;
      }) ||
      audioTracks[0];

    const defaultTextTrack =
      this.timedTextParser.selectPreferredTrack(defaultAudioTrack.allowedTextTracks) ||
      timedTextTracks.find(function (t) {
        return isRecommendedMedia
          ? t.trackId === manifest.recommendedMedia.timedTextTrackId
          : t.trackId === manifest.defaultTrackOrderList[0].timedTextTrackId;
      }) ||
      defaultAudioTrack.allowedTextTracks[0];

    // 7. Gather supplemental metadata
    const videoQualityScores = this.videoTrackParser.computeQualityScores(manifest.video_tracks);

    const audioTrackIndex = manifest.audio_tracks.findIndex(function (t) {
      return t.trackId === defaultAudioTrack.trackId;
    });
    const videoTrackIndex = manifest.video_tracks.findIndex(function (t) {
      return t.trackId === defaultVideoTrack.trackId;
    });
    const textTrackIndex = manifest.timedtexttracks.findIndex(function (t) {
      return t.trackId === defaultTextTrack.trackId;
    });

    return {
      videoQualityScores,
      cdnEndpoints,
      audioTracks,
      videoTracks,
      timedTextTracks,
      trickplayTracks,
      playbackContextId: manifest.playbackContextId,
      auxiliaryManifestToken: manifest.auxiliaryManifestToken,
      networkType: manifest.clientIpAddress,
      serverAddress: manifest.serverAddress,
      sessionInfoId: manifest.sessionInfoId,
      audioTrackIndex,
      videoTrackIndex,
      textTrackIndex,
      defaultVideoTrack,
      defaultAudioTrack,
      defaultTextTrack,
    };
  }

  /**
   * Merge an auxiliary manifest into the primary manifest, reconciling
   * CDN locations, tracks, and streams.
   *
   * @param {Object} primaryManifest  - The primary parsed manifest wrapper.
   * @param {Object} parsedModel      - The current parsed playback model.
   * @param {Object} auxiliaryManifest - The auxiliary manifest wrapper.
   * @returns {{ manifest: Object, parsedManifest: Object }}
   */
  mergeAuxiliaryManifest(primaryManifest, parsedModel, auxiliaryManifest) {
    const self = this;

    // Reconcile CDN locations
    const locationResult = this.cdnFilter.reorderLocations(
      primaryManifest.manifestContent.cdnEndpointsList,
      primaryManifest.manifestContent.locations,
      auxiliaryManifest.manifestContent.cdnEndpointsList,
      auxiliaryManifest.manifestContent.locations
    );

    // Update primary manifest with reordered CDNs
    asMutable(primaryManifest.manifestContent).cdnEndpointsList = locationResult.cdnEndpointsList;
    asMutable(primaryManifest.manifestContent).locations = locationResult.filteredLocationsList;
    parsedModel.cdnEndpoints = this.cdnFilter.filterCDNs(
      locationResult.cdnEndpointsList,
      locationResult.filteredLocationsList
    );

    const auxCorrelation = {
      correlationId: auxiliaryManifest.manifestContent.cdnResponseData?.pbcid ?? '',
      contentType: auxiliaryManifest.manifestContent.execPointer ? 'ads' : 'content',
    };

    const auxContent = auxiliaryManifest.manifestContent;

    // Merge missing timed-text tracks
    auxContent.timedtexttracks.forEach(function (auxTrack) {
      if (auxTrack.isMissing) {
        const replacement = self._replaceTrack(
          primaryManifest.manifestContent.timedtexttracks,
          parsedModel.timedTextTracks,
          auxTrack,
          function (t) { return self.timedTextParser.parse(auxCorrelation, [t])[0]; }
        );

        if (replacement) {
          parsedModel.audioTracks.forEach(function (audioTrack) {
            const textTracks = audioTrack.allowedTextTracks;
            const idx = textTracks.findIndex(function (tt) {
              return tt.trackId === replacement.trackId;
            });
            if (idx !== -1) {
              textTracks[idx] = replacement;
            }
          });
        }
      }
    });

    // Merge missing audio tracks
    auxContent.audio_tracks.forEach(function (auxTrack) {
      if (auxTrack.isMissing) {
        self._replaceTrack(
          primaryManifest.manifestContent.audio_tracks,
          parsedModel.audioTracks,
          auxTrack,
          function (t) {
            return self.audioTrackParser.parseFromManifest(auxCorrelation, [t], parsedModel.timedTextTracks)[0];
          }
        );
      }
    });

    // Merge missing video tracks
    auxContent.video_tracks.forEach(function (auxTrack) {
      if (auxTrack.isMissing) {
        self._replaceTrack(
          primaryManifest.manifestContent.video_tracks,
          parsedModel.videoTracks,
          auxTrack,
          function (t) {
            return self.videoTrackParser.parseVideoTracks(auxCorrelation, [t])[0];
          }
        );
      }
    });

    return {
      manifest: primaryManifest,
      parsedManifest: parsedModel,
    };
  }

  /**
   * Delegate HE-AAC stream reconciliation to the audio track parser.
   *
   * @param {Object} primaryManifest   - Primary manifest.
   * @param {Object} auxiliaryManifest - Auxiliary manifest content.
   * @returns {Object} Updated primary manifest.
   */
  reconcileAuxiliaryAudio(primaryManifest, auxiliaryManifest) {
    return this.audioTrackParser.reconcileAuxiliaryStreams(primaryManifest, auxiliaryManifest);
  }

  /**
   * Replace a track in both the raw manifest array and the parsed model
   * array when the auxiliary manifest provides an updated version.
   *
   * @private
   * @param {Array}    rawTracks    - Raw tracks from the primary manifest.
   * @param {Array}    parsedTracks - Parsed track models.
   * @param {Object}   auxTrack     - The auxiliary track (with isMissing=true).
   * @param {Function} parseTrack   - Parser function for the replacement.
   * @returns {Object|undefined} The replacement parsed track, or undefined.
   */
  _replaceTrack(rawTracks, parsedTracks, auxTrack, parseTrack) {
    const rawIdx = rawTracks.findIndex(function (t) {
      return t.trackId === auxTrack.trackId;
    });
    const rawEntry = rawIdx !== -1 ? rawTracks[rawIdx] : undefined;

    const parsedIdx = parsedTracks.findIndex(function (t) {
      return t.trackId === auxTrack.trackId;
    });
    const parsedEntry = parsedIdx !== -1 ? parsedTracks[parsedIdx] : undefined;

    if (rawEntry && !rawEntry.isMissing && parsedEntry && !parsedEntry.isMissing) {
      const replacement = parseTrack(auxTrack);
      rawTracks[rawIdx] = auxTrack;
      parsedTracks[parsedIdx] = replacement;
      return replacement;
    }
  }
}
