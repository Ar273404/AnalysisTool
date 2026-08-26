# Data Reader BIN format

Each stream has its own `.bin` file. Records are appended sequentially and never combine packets from different streams.

Each record is:

1. 8 bytes: signed big-endian 64-bit Unix timestamp in milliseconds (`BigInt64BE`).
2. 4 bytes: unsigned big-endian packet length in bytes (`UInt32BE`).
3. N bytes: the original UDP payload, unchanged.

The timestamp is captured by the Node.js receiver when the `message` event is handled. There is no padding or delimiter between records; the length field determines the payload boundary. A reader should reject a record when fewer than 12 header bytes or fewer than N payload bytes remain.
