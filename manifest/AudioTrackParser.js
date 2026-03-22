/**
 * Netflix Cadmium Player — AudioTrackParser
 *
 * Parses and transforms raw audio track data from Netflix manifests into
 * the internal audio-track model used by the playback pipeline.
 *
 * Responsibilities:
 *   - Filter out tracks with missing streams or unsupported languages.
 *   - Map BCP-47 language codes to internal language enums.
 *   - Associate each audio track with its allowed timed-text (subtitle) tracks.
 *   - Handle auxiliary manifest stream reconciliation for HE-AAC profiles.
 *   - Select a preferred/default audio track based on config or prior state.
 *
 * @module manifest/AudioTrackParser
 */

// ─── Dependencies ──────────────────────────────────────────
// import { AudioProfileCodecMap } from '../modules/Module_29670';         // cZb
// import { BaseTrackParser } from '../modules/Module_28518';              // E7
// import { partition } from '../modules/Module_45266';                    // zN
// import { TrackType } from '../modules/Module_51344';                    // mj.audioBufferedSegments
// import { languageMap, fragmentValidator } from '../modules/Module_35128'; // nma, FX
// import { CommandCategory, EventTypeEnum } from '../modules/Module_36129';
// import { PlayerError } from '../modules/Module_31149';                  // we

// ─── AudioTrackParser ──────────────────────────────────────

export class AudioTrackParser /* extends BaseTrackParser */ {
  /**
   * @param {Object} baseParams  - Shared track parser parameters.
   * @param {Object} config      - Audio-specific configuration.
   * @param {Object} playerState - Current player state (e.g. last selected audio track).
   */
  constructor(baseParams, config, playerState) {
    // super(baseParams);
    this.config = config;
    this.playerState = playerState;
  }

  // ─── Initial Manifest Parsing ────────────────────────────

  /**
   * Parse audio tracks from a fresh manifest response.
   * Filters out tracks without streams and unsupported languages.
   *
   * @param {Object} context       - Logging/correlation context.
   * @param {Array}  rawTracks     - Raw audio track objects from the manifest.
   * @param {Array}  timedTextTracks - Parsed timed-text tracks for association.
   * @returns {Array} Parsed audio track models.
   * @throws {Error} If no valid audio tracks remain after filtering.
   */
  parseFromManifest(context, rawTracks, timedTextTracks) {
    const self = this;
    const supportedLanguages = this.config.supportedAudioLanguages;

    rawTracks = rawTracks.filter(function (track) {
      const hasStreams = track.isNone || !track.isMissing || (track.streams && track.streams.length > 0);
      if (!hasStreams) {
        self.log.warn('Audio track is missing streams', self._trackInfo(track));
      }

      const isLanguageSupported =
        supportedLanguages.length === 0 || supportedLanguages.indexOf(track.language) >= 0;
      if (!isLanguageSupported) {
        self.log.warn('Audio track is not supported', self._trackInfo(track));
      }

      return hasStreams && isLanguageSupported;
    });

    if (!rawTracks.length) {
      throw Error('no valid audio tracks');
    }

    const parsed = rawTracks.map(function (track) {
      return self._buildTrackModel(context, track, self._findAllowedTextTracks(track, timedTextTracks));
    });

    this.log.trace('Parsed audio tracks', { Count: parsed.length });
    return parsed;
  }

  // ─── Supplemental / Transform Parsing ────────────────────

  /**
   * Transform audio tracks from a supplemental (auxiliary) manifest,
   * partitioning by "none" tracks, stream availability, and language support.
   *
   * @param {Object} context       - Logging/correlation context.
   * @param {Array}  rawTracks     - Raw audio track objects.
   * @param {Array}  mediaBindings - Audio ↔ text track association bindings.
   * @param {Array}  timedTextTracks
   * @returns {Array} Transformed audio track models.
   */
  transformFromSupplemental(context, rawTracks, mediaBindings, timedTextTracks) {
    const self = this;

    // Partition: "none" tracks vs. the rest
    const [noneTracks, remaining] = partition(function (t) {
      return t.isNone;
    }, rawTracks);

    // Partition remaining: has streams vs. missing streams
    const [withStreams, missingStreams] = partition(function (t) {
      return t.streams && t.streams.length > 0;
    }, remaining);

    missingStreams.forEach(function (track) {
      self.log.warn('Audio track is missing streams', self._trackInfo(track));
    });

    // Partition by supported languages
    const supportedLanguages = this.config.supportedAudioLanguages;
    const [supported, unsupported] = partition(function (t) {
      return supportedLanguages.length === 0 || supportedLanguages.indexOf(t.language) >= 0;
    }, withStreams);

    unsupported.forEach(function (track) {
      self.log.warn('Audio track is not supported', self._trackInfo(track));
    });

    const parsed = [...supported, ...noneTracks].map(function (track) {
      return self._buildTrackModel(
        context,
        track,
        self._findAllowedTextTracksByBinding(track.trackId, mediaBindings, timedTextTracks)
      );
    });

    if (!parsed.length) {
      throw Error('no valid audio tracks');
    }

    this.log.trace('Transformed audio tracks', { Count: parsed.length });
    return parsed;
  }

  // ─── Default Track Selection ─────────────────────────────

  /**
   * Select a preferred audio track based on user configuration or
   * the previously playing track ID.
   *
   * @param {Array} tracks - Parsed audio track models.
   * @returns {Object|undefined} The preferred track, or undefined.
   */
  selectPreferredTrack(tracks) {
    const self = this;
    const preferredAudioId = this.config.preferredAudioTrackId;

    if (preferredAudioId) {
      const match = tracks.find(function (t) {
        return t.languageCode === preferredAudioId || t.trackId === preferredAudioId;
      });
      if (match) return match;
    } else if (this.playerState.lastSelectedAudioTrackId) {
      const match = tracks.find(function (t) {
        return t.trackId === self.playerState.lastSelectedAudioTrackId;
      });
      if (match) return match;
    }
  }

  // ─── Auxiliary Manifest Stream Reconciliation ────────────

  /**
   * Reconcile HE-AAC audio streams between the primary and auxiliary
   * manifests, filtering out streams with non-matching bitrates.
   *
   * @param {Object} primaryManifest   - The primary parsed manifest.
   * @param {Object} auxiliaryManifest - The auxiliary manifest content.
   * @returns {Object} Updated primary manifest.
   * @throws {PlayerError} If no matching HE-AAC audio streams are found.
   */
  reconcileAuxiliaryStreams(primaryManifest, auxiliaryManifest) {
    this.config.heaacProfiles.forEach(function (profileName) {
      // Collect valid bitrates from the auxiliary manifest for this profile
      const validBitrates = auxiliaryManifest.audio_tracks
        .filter(function (t) { return t.profile === profileName; })
        .reduce(function (set, track) {
          track.streams
            .map(function (s) { return s.bitrate; })
            .forEach(function (br) { set.add(br); });
          return set;
        }, new Set());

      let modified = false;

      const updatedTracks = primaryManifest.manifestContent.audio_tracks.map(function (track) {
        if (track.profile === profileName) {
          const matchingStreams = track.streams.filter(function (s) {
            return validBitrates.has(s.bitrate);
          });

          if (matchingStreams.length === track.streams.length) {
            return track;
          }

          modified = true;

          if (matchingStreams.length === 0) {
            throw new PlayerError(
              CommandCategory.MANIFEST_VERIFY,
              EventTypeEnum.AUXILIARY_MANIFEST_NO_MATCHING_HEACC_AUDIO_STREAM_FOUND
            );
          }

          return Object.assign({}, track, { streams: matchingStreams });
        }
        return track;
      });

      if (modified) {
        primaryManifest.manifestContent = Object.assign({}, primaryManifest.manifestContent, {
          audio_tracks: updatedTracks,
        });
      }
    });

    return primaryManifest;
  }

  // ─── Private Helpers ─────────────────────────────────────

  /**
   * Build an internal audio track model from raw manifest data.
   * @private
   */
  _buildTrackModel(context, rawTrack, allowedTextTracks) {
    const language = rawTrack.language;

    const model = Object.assign({}, context, {
      type: TrackType.AUDIO,
      spatialAudio: rawTrack.spatialAudio,
      variant: rawTrack.variant,
      trackId: rawTrack.trackId,
      language: languageMap[language.toLowerCase()] || fragmentValidator.DEFAULT_LANGUAGE,
      rawTrackType: language,
      languageCode: rawTrack.language,
      displayName: rawTrack.name,
      rank: rawTrack.rank ?? -1,
      isMissing: rawTrack.isMissing ?? true,
      channels: rawTrack.channels,
      originalChannels: rawTrack.channels,
      allowedTextTracks,
      playbackInfo: {
        Bcp47: rawTrack.language,
        TrackId: rawTrack.trackId,
      },
      streams: [],
      isNative: rawTrack.isNative,
      isNone: rawTrack.isNone,
      assistiveAudio: rawTrack.assistiveAudio,
    });

    model.streams = this.parseStreams(rawTrack.streams, model);

    this.log.trace('Transformed audio track', model, {
      StreamCount: model.streams.length,
      AllowedTimedTextTracks: model.allowedTextTracks.length,
    });

    model.codecFamily = AudioProfileCodecMap[model.streams[0]?.profileName];
    return model;
  }

  /**
   * Filter timed-text tracks allowed for a given audio track (initial manifest).
   * @private
   */
  _findAllowedTextTracks(audioTrack, timedTextTracks) {
    const self = this;

    return timedTextTracks.filter(function (textTrack) {
      // Exclude explicitly disallowed text tracks
      if (audioTrack.excludedTextTrackIds?.indexOf(textTrack.trackId) >= 0) {
        return false;
      }

      // If forced-only filtering is not enabled, allow non-forced/non-CC tracks
      if (!self.config.allowForcedNarrativeOnly || !textTrack.isNone() || textTrack.isClosedCaption()) {
        if (audioTrack.forcedTextTrackId) {
          if (audioTrack.forcedTextTrackId !== textTrack.trackId && (textTrack.isNone() || textTrack.isClosedCaption())) {
            return false;
          }
        } else if (audioTrack.excludeNonForcedText) {
          if (textTrack.isNone() || textTrack.isClosedCaption()) {
            return false;
          }
        } else if (textTrack.isClosedCaption()) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Find allowed text tracks by media binding associations (supplemental manifest).
   * @private
   */
  _findAllowedTextTracksByBinding(audioTrackId, mediaBindings, timedTextTracks) {
    const self = this;

    let result = mediaBindings
      .filter(function (binding) { return binding.tracks.AUDIO === audioTrackId; })
      .map(function (binding) { return binding.tracks.TEXT; })
      .map(function (textId) {
        return timedTextTracks.find(function (t) { return t.trackId === textId; });
      })
      .filter(Boolean);

    // Ensure at least one "none" (forced-narrative) track is included
    if (this.config.allowForcedNarrativeOnly && !result.find(function (t) {
      return t.isNone() && !t.isClosedCaption();
    })) {
      const forcedTrack = timedTextTracks.find(function (t) {
        return t.isNone() && !t.isClosedCaption();
      });
      if (forcedTrack) result.push(forcedTrack);
    }

    return result;
  }

  /**
   * Build a debug-friendly summary of a raw audio track.
   * @private
   */
  _trackInfo(track) {
    return {
      language: track.name,
      bcp47: track.language,
      type: track.language,
    };
  }
}
