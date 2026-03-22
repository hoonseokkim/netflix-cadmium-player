/**
 * @file VideoCodecMap.js
 * @description Maps video profile identifiers to their codec strings (e.g., AVC, HEVC, AV1,
 *   Dolby Vision). Used to build MediaSource codec capability queries.
 * @module media/VideoCodecMap
 * @original Module_48617 (jEa)
 */

import { VideoProfile } from '../types/VideoProfile.js'; // Module 75568 (onHealthChange)
import { CodecStrings } from '../types/CodecStrings.js';  // Module 73796 (zc)

/**
 * Provides the mapping between Netflix video profile identifiers and
 * their corresponding codec MIME-type strings used for MediaSource
 * capability queries (e.g., `MediaSource.isTypeSupported()`).
 */
export class VideoCodecMap {
    /**
     * Builds and returns the full codec map for all supported video profiles.
     * Includes AVC (H.264), HEVC (H.265), AV1, and Dolby Vision profiles.
     *
     * @returns {Object<string, string>} Map of profile identifier to codec string
     */
    static loadAvailable() {
        const map = {};

        // ─── AVC (H.264) Baseline/Main profiles ───
        map[VideoProfile.wP]  = 'avc1.4D401E';  // AVC Main L3.0
        map[VideoProfile.$W]  = 'avc1.4D401F';  // AVC Main L3.1
        map[VideoProfile.nka] = 'avc1.4D4028';  // AVC Main L4.0
        map[VideoProfile.tFa] = 'avc1.4D401E';  // AVC Main L3.0 (alt)
        map[VideoProfile.uFa] = 'avc1.4D401F';  // AVC Main L3.1 (alt)
        map[VideoProfile.vFa] = 'avc1.4D4028';  // AVC Main L4.0 (alt)

        // ─── HEVC (H.265) Main 10 profiles (various levels) ───
        // HEVC Main10 L3.0
        map[VideoProfile.pka] = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.L6]  = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.M6]  = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.K6]  = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.u6]  = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.v6]  = 'hev1.2.6.L90.timerHandle';
        map[VideoProfile.t6]  = 'hev1.2.6.L90.timerHandle';

        // HEVC Main10 L3.1
        map[VideoProfile.qka] = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.O6]  = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.P6]  = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.N6]  = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.x6]  = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.y6]  = 'hev1.2.6.L93.timerHandle';
        map[VideoProfile.w6]  = 'hev1.2.6.L93.timerHandle';

        // HEVC Main10 L4.0
        map[VideoProfile.rka] = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.R6]  = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.S6]  = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.Q6]  = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.cX]  = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.A6]  = 'hev1.2.6.L120.timerHandle';
        map[VideoProfile.z6]  = 'hev1.2.6.L120.timerHandle';

        // HEVC Main10 L4.1
        map[VideoProfile.ska] = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.U6]  = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.V6]  = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.T6]  = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.C6]  = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.D6]  = 'hev1.2.6.L123.timerHandle';
        map[VideoProfile.B6]  = 'hev1.2.6.L123.timerHandle';

        // HEVC Main10 L5.0
        map[VideoProfile.dX]  = 'hev1.2.6.L150.timerHandle';
        map[VideoProfile.X6]  = 'hev1.2.6.L150.timerHandle';
        map[VideoProfile.W6]  = 'hev1.2.6.L150.timerHandle';
        map[VideoProfile.F6]  = 'hev1.2.6.L150.timerHandle';
        map[VideoProfile.G6]  = 'hev1.2.6.L150.timerHandle';
        map[VideoProfile.E6]  = 'hev1.2.6.L150.timerHandle';

        // HEVC Main10 L5.1
        map[VideoProfile.eX]  = 'hev1.2.6.L153.timerHandle';
        map[VideoProfile.Z6]  = 'hev1.2.6.L153.timerHandle';
        map[VideoProfile.Y6]  = 'hev1.2.6.L153.timerHandle';
        map[VideoProfile.I6]  = 'hev1.2.6.L153.timerHandle';
        map[VideoProfile.J6]  = 'hev1.2.6.L153.timerHandle';
        map[VideoProfile.H6]  = 'hev1.2.6.L153.timerHandle';

        // ─── Dolby Vision profiles ───
        map[VideoProfile.Y5]            = CodecStrings.XDa;
        map[VideoProfile.a6]            = CodecStrings.YDa;
        map[VideoProfile.SW]            = CodecStrings.ZDa;
        map[VideoProfile.d6]            = CodecStrings.$Da;
        map[VideoProfile.f6]            = CodecStrings.aEa;
        map[VideoProfile.h6]            = CodecStrings.bEa;
        map[VideoProfile.internal_Pja]  = CodecStrings.ZDa;
        map[VideoProfile.internal_Qja]  = CodecStrings.$Da;
        map[VideoProfile.internal_Rja]  = CodecStrings.aEa;
        map[VideoProfile.internal_Sja]  = CodecStrings.bEa;
        map[VideoProfile.Z5]            = CodecStrings.XDa;
        map[VideoProfile.b6]            = CodecStrings.YDa;
        map[VideoProfile.c6]            = CodecStrings.ZDa;
        map[VideoProfile.e6]            = CodecStrings.$Da;
        map[VideoProfile.g6]            = CodecStrings.aEa;
        map[VideoProfile.i6]            = CodecStrings.bEa;

        // ─── AVC High profiles ───
        map[VideoProfile.rFa] = 'avc1.640016';  // AVC High L2.2
        map[VideoProfile.YJ]  = 'avc1.64001E';  // AVC High L3.0
        map[VideoProfile.ZJ]  = 'avc1.64001F';  // AVC High L3.1
        map[VideoProfile.$J]  = 'avc1.640028';  // AVC High L4.0
        map[VideoProfile.sFa] = 'avc1.640016';  // AVC High L2.2 (alt)
        map[VideoProfile.uP]  = 'avc1.64001E';  // AVC High L3.0 (alt)
        map[VideoProfile.vP]  = 'avc1.64001F';  // AVC High L3.1 (alt)
        map[VideoProfile.ZW]  = 'avc1.640028';  // AVC High L4.0 (alt)

        // ─── AV1 Main profiles ───
        map[VideoProfile.jCa]                    = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.kCa]                    = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.zx]                     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL31DashProtected] = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL40DashProtected] = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL41DashProtected] = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.G5]                     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.I5]                     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.yx]                     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL31DashLive]     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL40DashLive]     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.av1MainL41DashLive]     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.F5]                     = CodecStrings.av1MainCodecRegex;
        map[VideoProfile.H5]                     = CodecStrings.av1MainCodecRegex;

        // ─── AV1 Main 10 (HDR) profiles ───
        map[VideoProfile.YO] = CodecStrings.xx;
        map[VideoProfile.ZO] = CodecStrings.xx;
        map[VideoProfile.$O] = CodecStrings.xx;
        map[VideoProfile.aP] = CodecStrings.xx;
        map[VideoProfile.D5] = CodecStrings.xx;
        map[VideoProfile.E5] = CodecStrings.xx;

        return map;
    }
}

export default VideoCodecMap;
