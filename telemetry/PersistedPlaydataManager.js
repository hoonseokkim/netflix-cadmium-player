/**
 * Netflix Cadmium Player — PersistedPlaydataManager
 *
 * Manages persisted playback data (playdata) that survives across sessions.
 * Handles loading, saving, upgrading, and encoding/decoding of playdata
 * across multiple format versions:
 *   - Version 0 (legacy): Raw JSON with flat fields
 *   - Version 1: Structured playdata array
 *   - Version 2: Current format with codec-based serialization
 *
 * Playdata includes playback position, timestamps, media IDs, session
 * parameters, and play time statistics. It is persisted to local storage
 * and used to resume playback, report telemetry, and manage DRM sessions.
 *
 * Decorated with `@injectable` for the IoC container.
 *
 * @module telemetry/PersistedPlaydataManager
 * @original Module_95480
 */

// import { __decorate, __param } from 'tslib';                   // Module 22970
// import { injectable, inject } from 'inversify';                 // Module 22674
// import { ConfigToken } from '../core/AseConfig';                // Module 4203
// import { ea, EventTypeEnum } from '../core/ErrorCodeEnums';     // Module 36129
// import { symbolMarker } from '../utils/TypeCheckers';           // Module 42207
// import { we as CadmiumError } from '../core/CadmiumError';     // Module 31149
// import { internal_Aeb as PersistableStore } from '../player/PersistableStore'; // Module 52657
// import { PJ as StorageSymbol } from '../player/StorageSymbols'; // Module 17892
// import { QC as DeviceConfigSymbol } from '../core/DeviceConfig';// Module 33554
// import { qla as PlaydataCodec } from '../telemetry/PlaydataCodec'; // Module 23048
// import { internal_Wib as ValidatorSymbol } from '../telemetry/ValidatorSymbol'; // Module 36258

/**
 * Codec for individual playdata entries.
 * @private
 */
class PlaydataEntryCodec {
    /**
     * Encode an array of playdata entries using the PlaydataCodec.
     * @param {Array<Object>} entries
     * @returns {Array<Object>} Encoded entries
     */
    encode(entries) {
        const codec = new PlaydataCodec();
        return entries.map(codec.encode);
    }

    /**
     * Decode an array of encoded playdata entries.
     * @param {Array<Object>} entries
     * @returns {Array<Object>} Decoded entries
     */
    decode(entries) {
        const codec = new PlaydataCodec();
        return entries.map(codec.decode);
    }
}

/**
 * Codec for the top-level playdata wrapper (version + data array).
 * @private
 */
class PlaydataVersionedCodec {
    /**
     * Encode versioned playdata.
     * @param {Object} playdata - { version: number, data: Array }
     * @returns {Object} Encoded versioned playdata
     */
    encode(playdata) {
        return {
            version: playdata.version,
            data: new PlaydataEntryCodec().encode(playdata.data),
        };
    }

    /**
     * Decode versioned playdata.
     * @param {Object} encoded - { version: number, data: Array }
     * @returns {Object} Decoded versioned playdata
     */
    decode(encoded) {
        return {
            version: encoded.version,
            data: new PlaydataEntryCodec().decode(encoded.data),
        };
    }
}

/**
 * Manages persisted playback data across sessions.
 */
export class PersistedPlaydataManager {
    /**
     * @param {Object} typeChecker - Type checking/validation utilities
     * @param {Object} storageProvider - Storage initialization provider
     * @param {Function} config - Config callback returning playdata settings
     * @param {Function} deviceConfig - Device config callback (ESN, etc.)
     * @param {Object} validator - Playdata format validator
     */
    constructor(typeChecker, storageProvider, config, deviceConfig, validator) {
        /** @private */
        this.typeChecker = typeChecker;

        /** @private */
        this.storageProvider = storageProvider;

        /** @private */
        this.config = config;

        /** @private */
        this.deviceConfig = deviceConfig;

        /** @private */
        this.validator = validator;

        /**
         * Encode current playdata for persistence.
         * @returns {Object} Encoded versioned playdata
         */
        this._encode = () => {
            return new PlaydataVersionedCodec().encode({
                version: this.version,
                data: this.playdata,
            });
        };

        /**
         * Validate and upgrade raw loaded data.
         * @param {Object} rawData - Raw data from storage
         * @returns {Object} Validated version-2 playdata
         */
        this._validateAndUpgrade = (rawData) => {
            const upgraded = this.upgrade(rawData);
            this.validator.validate(upgraded);
            return upgraded;
        };

        /**
         * Upgrade playdata from any supported version to version 2.
         * @param {Object} rawData - Raw playdata in any supported format
         * @returns {Object} Version-2 playdata
         * @throws {CadmiumError} If format is unsupported or corrupted
         */
        this.upgrade = (rawData) => {
            // Version 0: legacy flat JSON string
            if (this.typeChecker.isValidInterval(rawData)) {
                return this._upgradeLegacyV0(rawData);
            }

            const version = rawData.version;

            // Version 1: structured array
            if (version !== undefined && this.typeChecker.mapTransform(version) && version === 1) {
                return this._upgradeV1(rawData);
            }

            // Version 2: current format
            if (version !== undefined && this.typeChecker.mapTransform(version) && version === 2) {
                return new PlaydataVersionedCodec().decode(rawData);
            }

            // Known version but unsupported
            if (rawData.version && this.typeChecker.mapTransform(rawData.version)) {
                throw new CadmiumError(
                    ErrorCodes.INIT_COMPONENT_PERSISTEDPLAYDATA,
                    EventTypeEnum.CACHEDDATA_UNSUPPORTED_VERSION,
                    undefined, undefined, undefined,
                    `Version number is not supported. Version: ${rawData.version}`,
                    undefined,
                    rawData
                );
            }

            // Unknown format
            throw new CadmiumError(
                ErrorCodes.INIT_COMPONENT_PERSISTEDPLAYDATA,
                EventTypeEnum.CACHEDDATA_INVALID_FORMAT,
                undefined, undefined, undefined,
                'The format of the playdata is inconsistent with what is expected.',
                undefined,
                rawData
            );
        };

        /** @type {PersistableStore} Underlying persistent store */
        this.store = new PersistableStore(
            2,
            this.config().playdataPersistKey,
            this.config().playdataPersistKey !== '' &&
                this.config().playdataPersistIntervalMilliseconds > 0,
            this.storageProvider,
            this._encode
        );
    }

    /**
     * Current playdata format version.
     * @type {number}
     */
    get version() {
        return this.store.version;
    }

    /**
     * Current playdata entries.
     * @type {Array<Object>}
     */
    get playdata() {
        return this.store.pendingItems;
    }

    /**
     * Load persisted playdata from storage, upgrading from older formats.
     * @returns {Promise<Object>} Loaded and upgraded playdata
     * @throws {CadmiumError} On load or format errors
     */
    load() {
        return this.store.loading(this._validateAndUpgrade).catch((error) => {
            throw new CadmiumError(
                ErrorCodes.INIT_COMPONENT_PERSISTEDPLAYDATA,
                error.errorcode || error.errorSubCode,
                undefined, undefined, undefined,
                'Unable to load persisted playdata.',
                undefined,
                error
            );
        });
    }

    /**
     * Add a new playdata entry to the store.
     * @param {Object} entry - Playdata entry to add
     * @returns {*}
     */
    addEntry(entry) {
        return this.store.item(entry);
    }

    /**
     * Add a playdata entry, deduplicating by sourceTransactionId.
     * @param {Object} entry - Playdata entry to add
     * @returns {*}
     */
    addEntryDeduped(entry) {
        return this.store.item(entry, (existing, incoming) => {
            return existing.sourceTransactionId === incoming.sourceTransactionId;
        });
    }

    /**
     * Update an existing playdata entry, matched by sourceTransactionId.
     * @param {Object} entry - Updated playdata entry
     * @returns {*}
     */
    updateEntry(entry) {
        return this.store.update(entry, (existing, incoming) => {
            return existing.sourceTransactionId === incoming.sourceTransactionId;
        });
    }

    /**
     * Serialize the current playdata as a formatted JSON string.
     * @returns {string}
     */
    toFormattedJSON() {
        return JSON.stringify(this._encode(), null, '  ');
    }

    /**
     * Build the events endpoint URL for the given playback context.
     * @param {string} playbackContextId - Playback context identifier
     * @returns {string} Events endpoint URL, or empty string if no context
     */
    buildEventsUrl(playbackContextId) {
        if (!playbackContextId) return '';
        return `/events?playbackContextId=${playbackContextId}&esn=${this.deviceConfig().wj}`;
    }

    /**
     * Convert buffered segments to the compact { downloadableId, duration } format.
     * @param {Array<Object>} segments
     * @returns {Array<{ob: string, duration: number}>}
     */
    _mapBufferedSegments(segments) {
        return segments.map((segment) => ({
            ob: segment.downloadableId,
            duration: segment.duration,
        }));
    }

    /**
     * Extract play time statistics from a playback record.
     * @param {Object|null} playbackRecord - Record containing playTimes
     * @returns {Object} Normalized play time statistics
     */
    _extractPlayTimes(playbackRecord) {
        if (!playbackRecord) {
            return {
                total: 0,
                totalContentTime: 0,
                totalCombinedDuration: 0,
                totalAdDuration: 0,
                totalOtherDuration: 0,
                totalLiveEdgeDuration: 0,
                totalLiveEdgeAdDuration: 0,
                totalStartSlateDuration: 0,
                audioBufferedSegments: [],
                videoBufferedSegments: [],
                TEXT_MEDIA_TYPE: [],
                programMap: {},
            };
        }

        return {
            total: playbackRecord.playTimes.total,
            totalContentTime:
                playbackRecord.playTimes.totalContentTime ?? playbackRecord.playTimes.total,
            totalCombinedDuration: playbackRecord.playTimes.total,
            totalAdDuration: 0,
            totalOtherDuration: 0,
            totalLiveEdgeDuration: 0,
            totalLiveEdgeAdDuration: 0,
            totalStartSlateDuration: 0,
            audioBufferedSegments: this._mapBufferedSegments(
                playbackRecord.playTimes.audioBufferedSegments || []
            ),
            videoBufferedSegments: this._mapBufferedSegments(
                playbackRecord.playTimes.videoBufferedSegments || []
            ),
            TEXT_MEDIA_TYPE: this._mapBufferedSegments(
                playbackRecord.playTimes.timedtext || []
            ),
            programMap: {},
        };
    }

    /**
     * Upgrade legacy version-0 (flat JSON string) playdata to version 2.
     * @param {string} rawJson - Raw JSON string from legacy storage
     * @returns {Object} Version-2 playdata
     * @throws {CadmiumError} If the format is invalid
     * @private
     */
    _upgradeLegacyV0(rawJson) {
        const parsed = JSON.parse(rawJson);

        const entry = {
            rf: 'VOD',
            toString: this.buildEventsUrl(parsed.playbackContextId),
            sourceTransactionId: parsed.xid ? parsed.xid.toString() : '',
            R: parsed.movieId,
            position: parsed.position,
            clientTime: parsed.timestamp,
            defaultTimeOffset: parsed.playback ? 1000 * parsed.playback.startEpoch : -1,
            mediaId: parsed.mediaId,
            XB: this._extractPlayTimes(parsed.playback),
            trackId: '',
            sessionParams: {},
            o3: parsed.accountKey,
        };

        // Save DRM-related data to separate storage
        const drmData = JSON.stringify({
            keySessionIds: parsed.keySessionIds,
            movieId: parsed.movieId,
            xid: parsed.xid,
            licenseContextId: parsed.licenseContextId,
            profileId: parsed.profileId,
        });

        this.storageProvider.create().then((storage) => {
            storage.save(this.config().NSa, drmData, false);
        });

        if (entry.toString === '' || entry.sourceTransactionId === '') {
            throw new CadmiumError(
                ErrorCodes.INIT_COMPONENT_PERSISTEDPLAYDATA,
                EventTypeEnum.CACHEDDATA_INVALID_FORMAT
            );
        }

        return { version: 2, data: [entry] };
    }

    /**
     * Upgrade version-1 playdata to version 2.
     * @param {Object} v1Data - Version-1 playdata
     * @returns {Object} Version-2 playdata
     * @throws {CadmiumError} If the v1 data is corrupted
     * @private
     */
    _upgradeV1(v1Data) {
        if (!v1Data.playdata || !this.typeChecker.SQ(v1Data.playdata)) {
            throw new CadmiumError(
                ErrorCodes.INIT_COMPONENT_PERSISTEDPLAYDATA,
                EventTypeEnum.CACHEDDATA_INVALID_FORMAT,
                undefined, undefined, undefined,
                'The version 1 playdata is corrupted.',
                undefined,
                v1Data
            );
        }

        return {
            version: 2,
            data: v1Data.playdata.map((entry) => ({
                rf: entry.streamingType ?? 'VOD',
                toString: this.buildEventsUrl(entry.playbackContextId),
                sourceTransactionId: entry.xid ? entry.xid.toString() : '',
                R: entry.movieId,
                position: entry.position,
                clientTime: entry.timestamp,
                defaultTimeOffset: entry.playback ? 1000 * entry.playback.startEpoch : -1,
                mediaId: entry.mediaId,
                XB: this._extractPlayTimes(entry.playback),
                trackId: '',
                sessionParams: {},
                o3: entry.profileId,
            })),
        };
    }
}
