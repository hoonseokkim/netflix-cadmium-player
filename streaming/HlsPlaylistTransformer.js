/**
 * Netflix Cadmium Player — HLS Playlist Transformer
 *
 * Transforms Netflix's internal manifest representation into HLS (HTTP Live
 * Streaming) M3U8 playlists.  Generates a multivariant playlist with audio,
 * video, and subtitle renditions plus per-stream variant playlists using
 * data-URI encoding.
 *
 * Used when the platform's media pipeline expects HLS input (e.g., Safari /
 * AVPlayer on Apple devices).
 *
 * @module HlsPlaylistTransformer
 */

// Dependencies
// import { __decorate, __param } from 'tslib';
// import { injectable, injectDecorator } from './modules/Module_22674';  // IoC
// import { LoggerToken } from './modules/Module_87386';
// import { fragmentValidator } from './modules/Module_35128';
// import { jEa as VideoCodecMap } from './modules/Module_48617';
// import { iEa as AudioCodecMap } from './modules/Module_12187';

/**
 * CDN index pairs used for primary (0) and backup (1) URLs.
 * @type {number[]}
 */
const CDN_INDICES = [0, 1];

/**
 * Builds HLS M3U8 playlists from Netflix internal manifest data.
 *
 * @injectable
 */
export class HlsPlaylistTransformer {
  /**
   * @param {object} logger - Logger instance (injected via LoggerToken).
   */
  constructor(logger) {
    /** @private */
    this.logger = logger.createSubLogger("HLSPlaylistTransformerImpl");

    /** @private @type {Object<string, string>} Video codec to HLS codec string map. */
    this.videoCodecMap = VideoCodecMap.loadAvailable();

    /** @private @type {Object<string, string>} Audio profile to HLS codec string map. */
    this.audioCodecMap = AudioCodecMap.loadAvailable();
  }

  /**
   * Transforms manifest data into an HLS multivariant playlist data-URI.
   *
   * @param {object} manifestData - Internal manifest representation.
   * @param {Array} manifestData.TEXT_MEDIA_TYPE - Subtitle track descriptors.
   * @param {Array} manifestData.audioBufferedSegments - Audio track descriptors.
   * @param {Array} manifestData.videoBufferedSegments - Video track descriptors.
   * @param {number} manifestData.duration - Content duration in milliseconds.
   * @param {string} manifestData.$wb - Default audio track identifier.
   * @param {string} manifestData.internal_Gnc - Default subtitle track identifier.
   * @param {object} cdnUrls - CDN URL resolver (keyed by stream/track ID).
   * @returns {string} Data-URI containing the encoded M3U8 playlist.
   */
  transform(manifestData, cdnUrls) {
    const lines = [
      "#EXTM3U",
      "#EXT-X-VERSION:8",
      "#EXT-X-INDEPENDENT-SEGMENTS",
    ];

    const { TEXT_MEDIA_TYPE: textTracks, audioBufferedSegments: audioTracks,
            videoBufferedSegments: videoTracks, duration,
            $wb: defaultAudioId, internal_Gnc: defaultSubtitleId } = manifestData;

    // --- Subtitle renditions ---
    textTracks.forEach((textEntry) => {
      CDN_INDICES.forEach((cdnIndex) => {
        const isPrimary = cdnIndex === 0;
        const { stream, track } = textEntry;
        const cdnEntry = cdnUrls.key(textEntry.id);
        const cdn = isPrimary ? cdnEntry.m3 : cdnEntry.internal_Gza;

        const variantLines = this.#buildSubtitleVariantPlaylist({
          url: cdn.url,
          duration: duration / 1000,
          size: stream.size,
          nodeQuery: `Manifest for subtitles ${track.language} stream "${track.name}", ${track.ff}, cdn ${cdn.urlId}`,
        });

        this.logger.pauseTrace("Text variant manifest", variantLines.join("\n"));

        const mediaTag = this.#buildSubtitleMediaTag({
          groupId: cdnIndex,
          name: track.name,
          isDefault: track.ff === defaultSubtitleId,
          isForced: track.mda,
          isAccessibility: track.language === fragmentValidator.cCa,
          language: track.language,
          uri: this.#encodePlaylist(variantLines),
        });

        lines.push(mediaTag);
      });
    });

    // --- Audio renditions ---
    audioTracks.forEach((audioEntry) => {
      CDN_INDICES.forEach((cdnIndex) => {
        const isPrimary = cdnIndex === 0;
        const { stream, track, fragmentIndex, IV } = audioEntry;
        const cdnEntry = cdnUrls.key(stream.sh);
        const cdn = isPrimary ? cdnEntry.m3 : cdnEntry.internal_Gza;

        const variantLines = this.#buildSegmentedVariantPlaylist({
          url: cdn.url,
          length: stream.sidx.offset + stream.sidx.size,
          fragmentIndex,
          targetDuration: Math.floor(IV / 1000),
          nodeQuery: `Manifest for audio ${track.language} stream "${track.name}", ${track.ff}, cdn ${cdn.urlId}`,
        });

        this.logger.pauseTrace("Audio variant manifest", variantLines.join("\n"));

        const mediaTag = this.#buildAudioMediaTag({
          groupId: cdnIndex,
          language: track.language,
          name: track.name,
          isDefault: track.ff === defaultAudioId,
          uri: this.#encodePlaylist(variantLines),
        });

        lines.push(mediaTag);
      });
    });

    // Resolve audio codec for the stream-inf tags
    const audioCodec = this.audioCodecMap[audioTracks[0].track.profile];
    const hasSubtitles = textTracks.length > 0;

    // --- Video stream-inf entries ---
    videoTracks.forEach((videoEntry) => {
      CDN_INDICES.forEach((cdnIndex) => {
        const isPrimary = cdnIndex === 0;
        const { stream, track, fragmentIndex, IV } = videoEntry;
        const cdnEntry = cdnUrls.key(stream.sh);
        const cdn = isPrimary ? cdnEntry.m3 : cdnEntry.internal_Gza;

        const variantLines = this.#buildSegmentedVariantPlaylist({
          url: cdn.url,
          length: stream.sidx ? stream.sidx.offset + stream.sidx.size : stream.ATb,
          fragmentIndex,
          targetDuration: Math.floor(IV / 1000),
          nodeQuery: `Manifest for video bitrate ${stream.bitrate}, stream ${track.ff}, cdn ${cdn.urlId}`,
        });

        this.logger.pauseTrace("Video variant manifest", variantLines.join("\n"));

        const isHdr =
          stream.profileNameRef.indexOf("-hdr-") >= 0 ||
          stream.profileNameRef.indexOf("-dv5-") >= 0;

        const streamInf = this.#buildStreamInfTag({
          groupId: cdnIndex,
          bandwidth: 1000 * stream.bitrate,
          averageBandwidth: 1000 * stream.bitrate,
          isHdr,
          framerate: (stream.FUa / stream.EUa).toFixed(3),
          resolution: `${stream.gza}x${stream.u4a}`,
          videoCodec: this.videoCodecMap[stream.profileNameRef],
          audioCodec,
          hasSubtitles,
        });

        lines.push(streamInf);
        lines.push(this.#encodePlaylist(variantLines));
      });
    });

    this.logger.pauseTrace("Primary manifest", lines.join("\n"));
    return this.#encodePlaylist(lines);
  }

  /**
   * Builds an #EXT-X-MEDIA tag for an audio rendition.
   * @private
   */
  #buildAudioMediaTag({ groupId, language, name, isDefault, uri }) {
    return [
      "#EXT-X-MEDIA:TYPE=AUDIO",
      `GROUP-ID="group_${groupId}"`,
      'CHANNELS="2"',
      `LANGUAGE="${language}"`,
      `NAME="${name}"`,
      `DEFAULT=${isDefault ? "YES" : "NO"}`,
      `AUTOSELECT=${isDefault ? "YES" : "NO"}`,
      `URI="${uri}"`,
    ].join(", ");
  }

  /**
   * Builds a segmented VOD variant playlist (audio or video).
   * @private
   */
  #buildSegmentedVariantPlaylist({ url, length, fragmentIndex, targetDuration, nodeQuery }) {
    const lines = [
      "#EXTM3U",
      `# ${nodeQuery}`,
      "#EXT-X-VERSION:8",
      `#EXT-X-TARGETDURATION:${targetDuration}`,
      "#EXT-X-MEDIA-SEQUENCE:0",
      "#EXT-X-PLAYLIST-TYPE:VOD",
      `#EXT-X-DEFINE:NAME="U", VALUE="${url}"`,
      `#EXT-X-MAP:URI="{$U}",BYTERANGE="${fragmentIndex[0].byteOffset}@0"`,
      "#EXT-X-PROGRAM-DATE-TIME:2021-07-20T08:19:00.000-07:00",
    ];

    fragmentIndex.forEach((fragment, index) => {
      lines.push(`#EXTINF:${fragment.duration.toFixed(3)},${fragment.startPts.toFixed(3)}`);
      lines.push(`#EXT-X-BYTERANGE:${fragment.afc}@${fragment.byteOffset}`);
      lines.push(`{$U}&fi=${index}`);
    });

    lines.push("#EXT-X-ENDLIST");
    return lines;
  }

  /**
   * Builds an #EXT-X-STREAM-INF tag for a video variant.
   * @private
   */
  #buildStreamInfTag({ groupId, bandwidth, averageBandwidth, isHdr, framerate, resolution, videoCodec, audioCodec, hasSubtitles }) {
    const parts = [
      `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth}`,
      `AVERAGE-BANDWIDTH=${averageBandwidth}`,
      `VIDEO-RANGE=${isHdr ? "PQ" : "SDR"}`,
      `FRAME-RATE=${framerate}`,
      `AUDIO="group_${groupId}"`,
      `RESOLUTION=${resolution}`,
      `CODECS="${videoCodec},${audioCodec}"`,
    ];
    if (hasSubtitles) {
      parts.push(`SUBTITLES="subs_${groupId}"`);
    }
    return parts.join(", ");
  }

  /**
   * Builds a simple single-segment subtitle variant playlist.
   * @private
   */
  #buildSubtitleVariantPlaylist({ url, duration, size, nodeQuery }) {
    return [
      "#EXTM3U",
      `# ${nodeQuery}`,
      "#EXT-X-VERSION:8",
      `#EXT-X-TARGETDURATION:${Math.floor(duration)}`,
      "#EXT-X-MEDIA-SEQUENCE:0",
      "#EXT-X-PLAYLIST-TYPE:VOD",
      `#EXT-X-DEFINE:NAME="U", VALUE="${url}"`,
      '#EXT-X-MAP:URI="{$U}"',
      "#EXT-X-PROGRAM-DATE-TIME:2021-07-20T08:19:00.000-07:00",
      `#EXTINF:${duration.toFixed(3)}`,
      `#EXT-X-BYTERANGE:${size}@0`,
      "{$U}",
      "#EXT-X-ENDLIST",
    ];
  }

  /**
   * Builds an #EXT-X-MEDIA tag for a subtitle rendition.
   * @private
   */
  #buildSubtitleMediaTag({ groupId, name, isDefault, isForced, isAccessibility, language, uri }) {
    const parts = [
      "#EXT-X-MEDIA:TYPE=SUBTITLES",
      `GROUP-ID="subs_${groupId}"`,
      `NAME="${name}"`,
      `DEFAULT=${isDefault ? "YES" : "NO"}`,
      `AUTOSELECT=${isDefault ? "YES" : "NO"}`,
      `FORCED=${isForced ? "YES" : "NO"}`,
    ];
    if (isAccessibility) {
      parts.push('CHARACTERISTICS="public.accessibility.transcribes-spoken-dialog,public.accessibility.describes-music-and-sound"');
    }
    parts.push(`LANGUAGE="${language}"`);
    parts.push(`URI="${uri}"`);
    return parts.join(", ");
  }

  /**
   * Encodes an array of playlist lines as an HLS data-URI.
   * @private
   * @param {string[]} lines - The playlist lines.
   * @returns {string} A data-URI with the encoded M3U8.
   */
  #encodePlaylist(lines) {
    return "data:application/vnd.apple.mpegurl;charset=utf-8," + encodeURIComponent(lines.join("\n"));
  }
}
