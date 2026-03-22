/**
 * Netflix Cadmium Player - Initial Bitrate Selection
 *
 * Selects the initial video/audio bitrate for playback based on
 * historical throughput, buffer time, audio profile overrides,
 * and bitrate selection curves. Part of the ABR (Adaptive Bitrate) system.
 *
 * @module abr/InitialBitrateSelector
 */

/**
 * Interpolates the initial bitrate from a bitrate selection curve
 * at the given throughput rate using linear interpolation.
 *
 * @param {Object} config - Player configuration with initialBitrateSelectionCurve.
 * @param {number} throughputRate - Current throughput in kbps.
 * @returns {number} Interpolated bitrate value.
 */
function interpolateBitrateFromCurve(config, throughputRate) {
  if (!config.initialBitrateSelectionCurve) {
    return config.defaultInitBitrate;
  }

  const curve = config.initialBitrateSelectionCurve;
  const index = binarySearch(curve, (point) => throughputRate <= point.rate);

  if (index === 0) return curve[0].bitrate;
  if (index === -1) return curve[curve.length - 1].bitrate;

  const lower = curve[index - 1];
  const upper = curve[index];

  return Math.floor(
    lower.bitrate +
      ((upper.bitrate - lower.bitrate) * (throughputRate - lower.rate)) /
        (upper.rate - lower.rate)
  );
}

/**
 * Finds an audio profile override for the given profile name.
 *
 * @param {string} profileName - Audio profile identifier.
 * @param {Array<Object>} overrides - Array of profile override entries.
 * @returns {Object|undefined} The matching override configuration.
 */
function findAudioProfileOverride(profileName, overrides) {
  let result;
  overrides.some((entry) => {
    const profiles = entry.profiles;
    const matches = profiles && profiles.indexOf(profileName) >= 0;
    if (matches) result = entry.override;
    return matches;
  });
  return result;
}

/**
 * Selects the initial stream (audio + video) for playback startup.
 *
 * Uses historical throughput data, bitrate selection curves, buffer time
 * predictions, and audio profile constraints to pick the best starting
 * quality level.
 *
 * @param {Object} params - Selection parameters.
 * @param {Object} params.config - Player configuration.
 * @param {Object} params.player - Player state (playbackRate, etc.).
 * @param {boolean} params.shouldWaitForBuffer - Whether slow buffer filling is active.
 * @param {Object} params.streamList - Available stream element list.
 * @returns {Object} Selected stream with reason metadata.
 */
export function selectInitialStream({ config, player, shouldWaitForBuffer, streamList }) {
  const streams = streamList.first;
  const selector = new StreamSelector();
  const minBitrate = Math.max(
    config.minInitVideoBitrate,
    config.minAcceptableVideoBitrate
  );

  // Compute max bitrate based on slow buffer filling config
  const maxSlowBufferBitrate =
    getStreamOverrideValue(streams[0].viewableSession, config.liveSlowBufferFilling) &&
    shouldWaitForBuffer
      ? computeSlowBufferBitrate(streams, config)
      : Infinity;

  // Filter streams by audio/video bitrate constraints
  const eligibleStreams = streams
    .filter((stream) => {
      let maxAudioBitrate;
      const audioProfile = stream.getStreamsByType('audio');

      if (audioProfile) {
        const profileName = audioProfile.profileName;
        const override =
          config?.switchableAudioProfiles?.indexOf(profileName) >= 0
            ? findAudioProfileOverride(profileName, config.switchableAudioProfilesOverride)
            : findAudioProfileOverride(profileName, config.audioProfilesOverride);
        maxAudioBitrate = override?.maxInitAudioBitrate ?? config.maxInitAudioBitrate;
      } else {
        maxAudioBitrate = config.maxInitAudioBitrate;
      }

      const videoInRange = stream.videoBitrateKbps
        ? stream.videoBitrateKbps <= config.maxInitVideoBitrate
        : true;

      return (
        (stream.audioBitrateKbps ? stream.audioBitrateKbps <= maxAudioBitrate : true) &&
        videoInRange
      );
    })
    .filter(
      (stream) =>
        stream.videoBitrateKbps && stream.videoBitrateKbps <= maxSlowBufferBitrate
    );

  // Select the best stream based on historical throughput
  selector.selectedStream =
    eligibleStreams.reverse().find((stream) => {
      const historicalThroughput = stream.bufferLength;

      if (stream.bitrate > minBitrate) {
        const bitrateAtRate = stream.bitrate * player.playbackRate;

        if (historicalThroughput) {
          const interpolatedBitrate = interpolateBitrateFromCurve(config, bitrateAtRate);
          const prebufSize = computePrebufSize(
            config.minPrebufSize,
            bitrateAtRate * config.mediaRate
          );

          if (convertBpsToKbps(prebufSize, historicalThroughput) <= interpolatedBitrate) {
            selector.reason = 'hist_buftime';
            return true;
          }
          return false;
        }
        return false;
      }

      if (historicalThroughput && stream.bitrate * player.playbackRate <= historicalThroughput) {
        selector.reason = 'lt_hist_lte_minbitrate';
        return true;
      } else if (!historicalThroughput) {
        selector.reason = 'no_historical_lte_minbitrate';
        return true;
      }
      return false;
    }) || streams[0];

  return selector;
}
