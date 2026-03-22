# MSL (Message Security Layer) Deep Dive

Netflix's custom encrypted messaging protocol built on top of HTTP. MSL provides device/user authentication, key exchange, and encrypted communication for DRM license requests and other sensitive operations.

## Architecture Overview

**24 core files** in `msl/`, with support from `crypto/` (27 files), `network/` (41 files), and `drm/` (48 files).

| File | Role |
|------|------|
| `msl/MslControl.js` | Central orchestrator — concurrency, retries, token lifecycle |
| `msl/MessageHeader.js` | Builds/parses encrypted + signed message headers |
| `msl/MessageInputStream.js` | Decrypts and verifies inbound messages |
| `msl/MasterToken.js` | Session-level token (carries AES + HMAC keys) |
| `msl/UserIdToken.js` | User identity, bound to a master token |
| `msl/ServiceToken.js` | App-specific data (e.g., DRM licenses), optionally encrypted |
| `msl/MslTokenStore.js` | Persists/restores tokens across sessions |
| `msl/AsymmetricKeyExchangeFactory.js` | RSA-based key exchange |
| `msl/CiphertextEnvelope.js` | Wraps ciphertext with IV + version metadata |
| `msl/MslComponentInitializer.js` | Bootstraps MSL at player startup |
| `msl/MslObject.js` | JSON-like key-value data structure for serialization |
| `msl/MslMessageParser.js` | Parses raw MSL messages from transport |
| `msl/MslMessageStreamFactory.js` | Creates message input/output streams |
| `msl/KeyResponseData.js` | Wraps key exchange response data |

### Exception Hierarchy

- `MslException` (base)
- `MslEncodingException` (codec errors)
- `MslMessageException` (message structure errors)
- `MslEntityAuthException` (device auth failures)
- `MslCryptoException` (cryptographic operations)
- `MslInternalException` (internal invariant violations)
- `MslInterruptedException` (operation cancelled)

---

## Message Format

```
MSL Message
├── entityauthdata | mastertoken    ← device identity OR session token
├── headerdata (encrypted)          ← AES-CBC encrypted header fields
│   ├── messageId                   ← unique, anti-replay
│   ├── nonReplayableId             ← optional sequence counter
│   ├── renewable / handshake flags
│   ├── keyRequestData              ← initiates key exchange
│   ├── keyResponseData             ← wrapped session keys
│   ├── userAuthData                ← user credentials
│   ├── userIdToken                 ← bound user identity
│   ├── serviceTokens[]             ← app data (compressed, encrypted)
│   └── capabilities               ← compression algos, languages
└── signature                       ← HMAC-SHA256 over headerdata
```

### Header Construction (MessageHeader.js)

**Building a message:**
1. Validate message constraints
2. Resolve crypto context (entity auth or master token)
3. Encode all header fields into an MslObject
4. Encrypt with AES-CBC cipher
5. Sign with HMAC-SHA256
6. Wrap with entity auth data or master token

**Parsing a message:**
1. Resolve crypto context
2. Verify HMAC signature
3. Decrypt header data
4. Parse all fields asynchronously
5. Validate token bindings (user token → master token linkage)

### Ciphertext Envelope (CiphertextEnvelope.js)

Two envelope versions:

| Version | Fields |
|---------|--------|
| v1 (Legacy) | keyId + IV + ciphertext + SHA256 hash |
| v2 (Modern) | version + cipherSpec + IV + ciphertext |

---

## Token System

### Master Token

Session-level authentication token. Contains encrypted session data with the keys used for all subsequent message encryption/signing.

```
Master Token
├── Renewal window timestamp
├── Expiration timestamp
├── Sequence number          ← detects replay / out-of-order
├── Serial number            ← unique identifier
└── Encrypted session data:
    ├── AES encryption key   ← 128-bit, for AES-CBC
    ├── HMAC signature key   ← for HMAC-SHA256
    ├── Entity identity      ← device ESN
    └── Issuer data          ← optional
```

- Signed with HMAC-SHA256 over token data
- Has renewal windows — renewal occurs before expiration
- Sequence numbers prevent replay and detect out-of-order delivery

### User ID Token

Binds a user identity to a master token.

```
User ID Token
├── Renewal window + expiration
├── Encrypted user identity
├── Issuer-specific data (optional)
└── Bound to Master Token via serial number
```

- Cannot exist without a master token
- Cryptographically linked via master token serial number

### Service Tokens

Carry application-specific data (e.g., streaming licenses, DRM payloads).

- Optionally encrypted and compressed (LZW or GZIP)
- Signed with HMAC-SHA256
- Three binding levels:
  - **Unbound** — device-level
  - **Master-token-bound** — session-level
  - **User-token-bound** — user-level

### Token Store (MslTokenStore.js)

Persists and restores tokens across sessions.

**Restoration flow:**
1. Decode base64-encoded token data
2. Unwrap crypto keys (if AES-KW system-key-wrapped)
3. Parse and verify master token signature
4. Decrypt session data to extract AES + HMAC keys
5. Restore user ID tokens and service tokens

---

## Key Exchange

### Supported Schemes (AsymmetricKeyExchangeFactory.js)

| Scheme | Description |
|--------|-------------|
| RSA | Raw RSA key wrapping |
| JWE_RSA | JSON Web Encryption with RSA (A128GCM content encryption) |
| JWEJS_RSA | JSON Web Encryption JSON Serialization |
| JWK_RSA | JSON Web Key with RSA |
| JWK_RSAES | JSON Web Key with RSA-ES (Diffie-Hellman style) |

### Key Exchange Flow

```
Client                                          Server
  │                                               │
  │  1. Generate ephemeral RSA key pair           │
  │  2. Send public key in keyRequestData         │
  │─────────────────────────────────────────────▶│
  │                                               │
  │              3. Wrap AES key + HMAC key        │
  │                 with client's RSA public key   │
  │              4. Create new MasterToken         │
  │◀─────────────────────────────────────────────│
  │                                               │
  │  5. Unwrap session keys with RSA private key  │
  │  6. Store MasterToken + crypto context        │
  │                                               │
  │  ══ Session established (AES-CBC + HMAC) ══   │
```

### Key Response Data (KeyResponseData.js)

```
KeyResponseData:
  - masterToken        ← new session token from server
  - scheme             ← key exchange mechanism name
  - keydata:
    - encryptionKey    ← AES key, wrapped with client's RSA public key
    - hmacKey          ← HMAC key, wrapped with client's RSA public key
```

---

## Encryption Stack

| Layer | Algorithm | Purpose |
|-------|-----------|---------|
| Symmetric cipher | AES-128-CBC | Message encryption (per-message IV) |
| Integrity | HMAC-SHA256 | Message authentication |
| Asymmetric | RSA | Key exchange |
| Entity auth signatures | SHA256withRSA | Device authentication |
| Alternative MAC | AES-CMAC | AES-based MAC option |

### Crypto Context Hierarchy

Three context types, each providing `encrypt()`, `decrypt()`, `sign()`, `verify()`:

1. **Entity Auth Crypto Context** — derives from device-level entity authentication
2. **Master Token Crypto Context** — session-level crypto from master token's embedded keys
3. **Symmetric Crypto Context** — final per-request encryption/signature

### Web Crypto Abstraction (crypto/WebCryptoSubtle.js)

Handles multiple browser implementations:
- Standard `crypto.subtle` (modern browsers)
- Legacy IE11 `msCrypto.subtle` (event-based)
- Webkit prefixed APIs
- Normalizes key usages (`wrap` → `wrapKey`)

---

## DRM License Flow via MSL

```
LicenseBroker.startLicenseAcquisition()
  → tryUseCachedLicense()              // check local cache first
  → requestNewLicense()
    → licenseProvider.license(req)
      → sendSecure(licenseRequest)     // MSL-encrypted HTTP POST
        → MslControl builds message:
            1. Attach MasterToken (or entity auth)
            2. Encrypt headerdata with AES-CBC
            3. Sign with HMAC-SHA256
            4. Send over HTTP
        → Receive MSL response:
            1. Verify HMAC signature
            2. Decrypt header
            3. Extract license from service tokens
      → Set MediaKeys on <video> element
```

---

## Session Lifecycle

```
1. Bootstrap (MslComponentInitializer)
   │  Load persisted tokens from storage
   │  Init MSL context with device ESN + credentials
   │  Expose mslFetch() and sendSecure() on service bus
   │
2. First Request (no master token)
   │  → Key exchange handshake via RSA
   │  → Server returns MasterToken with wrapped session keys
   │  → Client unwraps and stores keys
   │
3. Steady State
   │  All requests use master token's AES/HMAC keys
   │  encrypt headerdata → sign → HTTP POST → verify → decrypt
   │
4. Token Renewal
   │  Before expiration, set renewable flag on request
   │  Server issues new MasterToken in response
   │  Client replaces old token seamlessly
   │
5. Error Recovery
   │  On 401 / expired token → automatic renewal
   │  Exponential backoff with jitter on retries
   │  Semaphore prevents concurrent token mutations
   │
6. Persistence
   Token store debounce-saves to local storage
   Optional AES-KW key wrapping for stored crypto keys
```

---

## Key Design Decisions

### Anti-Replay
- Every message carries a unique `messageId`
- Non-replayable messages use a monotonic counter (`nonReplayableId`)
- Master tokens have sequence numbers to detect replay/reorder

### Token Binding
- User ID tokens are cryptographically bound to master tokens via serial number
- Prevents token mix-and-match attacks (swapping a user token onto a different session)

### Concurrency Control (MslControl.js)
- Semaphore limits concurrent MSL requests
- Master token mutation lock prevents races during renewal
- Renewable token queue with retry backoff

### Compression
- Service token payloads support LZW and GZIP compression before encryption
- Reduces wire size for large payloads (e.g., license data)

### Service Bus Integration
```javascript
serviceBus.fD.UQ.mslFetch(url, options)   // MSL-encrypted fetch
serviceBus.fD.UQ.sendSecure(request)       // Generic secure send
```

---

## Summary

MSL is a full messaging security layer that sits between HTTP transport and application logic. It handles:

- **Device authentication** via entity auth data (ESN + RSA signatures)
- **Session establishment** via RSA key exchange → AES-128-CBC + HMAC-SHA256 session keys
- **Message confidentiality** via AES-CBC encryption of header data and payloads
- **Message integrity** via HMAC-SHA256 signatures
- **User binding** via User ID tokens linked to master tokens
- **Token lifecycle** with renewal windows, expiration, and persistent storage
- **DRM integration** as the secure transport for Widevine/PlayReady license requests
