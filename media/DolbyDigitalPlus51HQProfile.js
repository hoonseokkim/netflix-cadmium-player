/**
 * Netflix Cadmium Player - Dolby Digital Plus 5.1 HQ Audio Profile
 * Deobfuscated from Module_86252
 *
 * Audio codec profile definition for Dolby Digital Plus (DD+/EAC-3)
 * in 5.1 surround sound, high quality variant.
 *
 * Profile data includes:
 *   - Codec initialization data segments (base64-encoded)
 *   - Encryption session flags
 *   - Media key system factory parameters
 *   - Sample rates: 48000 Hz
 *   - Frame sizes: 1536 and 12288
 *   - Profile name: "ddplus-5.1hq-dash"
 *   - Bitrate: 384 kbps
 *   - Channel configuration: 5.1
 */

import { X as baseProfile } from "../media/BaseAudioProfile"; // Module 80463
import { X as codecProfiles } from "../media/CodecProfiles"; // Module 73502

const parentMediaAttribute = baseProfile[0];

export const X = [
    {
        data: "hMPLAMhMIMg8oBAFDcgGYCgEQChMJ3",
        encryptionSession: true,
        mediaKeySystemFactory: [176, 590],
        size: 610,
        mediaAttribute: parentMediaAttribute
    },
    {
        data: "wNY4gAYAwNYoAwwNYFACiNYLcEEB+6iNYxiHgviRwwicAwiWIwgYwSgnwCA2gGwCg14BdvHjx4DxDjDHCPgAwDgB4AgCYAhBoBhaABiM4EAABvgGYBg6oCgD4FgAwCgBoADfA+gD4DgAgDgEYBANgLQBhy4CgIwIgAwAcbbbfPhUQBgEYEiFQCADBrgP4BhFICgEgbgSQBhagCDegSQJB2gB4AgCYAgEYGhs4CAADZgXwCgJ4SAegB4AgV4AA1gFQGhhgCAGgd4BDNhSwBC8gJ4IDGgJ4PgZwAhiADC3gcQIgAwAgB4AgCYAgJAHhZ4BglwTgEgPA3gsQBhgoCgSQJA3glwQiE4Cgv3/gvz8gABZBYAGi///iQH/i///i///iQH/i///i///iQH/i///i///iQH/i///i///iQH/i///i///iQH/i///i///iQH/i//q",
        encryptionSession: true,
        mediaKeySystemFactory: [44],
        size: 12396,
        mediaAttribute: codecProfiles[1]
    },
    {
        frameSize: 1536,
        sampleRate: 48000
    },
    {
        frameSize: 12288,
        sampleRate: 48000
    },
    "ddplus-5.1hq-dash", // Profile name
    384,                   // Bitrate (kbps)
    "5.1"                  // Channel configuration
];
