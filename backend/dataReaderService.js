const { EventEmitter } = require("events");
const MulticastReceiver = require("./multicastReceiver");
const { STREAM_CONFIG, testMode, validateStreamConfig } = require("./config");
const { StreamStorage } = require("./storage");

class DataReaderService extends EventEmitter {
  constructor() {
    super();
    this.active = new Map();
    this.lastSession = null;
  }

  snapshot() {
    const streams = {};
    for (const [id, item] of this.active) streams[id] = this.stats(item);
    return { running: this.active.size > 0, testMode, streams };
  }

  stats(item) {
    const elapsed = Math.max((Date.now() - item.startedAt) / 1000, 0.001);
    return {
      status: item.status,
      packetCount: item.storage.packetCount,
      bytes: item.storage.totalBytes,
      packetsPerSecond: Number((item.storage.packetCount / elapsed).toFixed(2)),
      bytesPerSecond: Number((item.storage.totalBytes / elapsed).toFixed(2)),
      startTime: item.storage.startTime,
      lastPacketTime: item.storage.lastPacketTime,
      error: item.error || null,
    };
  }

  async start(streamIds, format = "bin") {
    if (!Array.isArray(streamIds) || streamIds.length === 0)
      throw new Error("Select at least one stream.");
    const uniqueIds = [...new Set(streamIds)];
    uniqueIds.forEach(validateStreamConfig);
    await Promise.all(uniqueIds.map((id) => this.stopStream(id)));

    const results = await Promise.all(
      uniqueIds.map((id) => this.startStream(id, format)),
    );
    this.emit("recordingStarted", this.snapshot());
    return {
      status: "started",
      streams: Object.fromEntries(
        results.map(({ id }) => [id, this.stats(this.active.get(id))]),
      ),
    };
  }

  async startStream(id, format) {
    const config = STREAM_CONFIG[id];
    const storage = new StreamStorage(id, config, format);
    const receiver = new MulticastReceiver(id, config, testMode);
    const item = {
      id,
      config,
      storage,
      receiver,
      startedAt: Date.now(),
      status: "starting",
      error: null,
    };
    this.active.set(id, item);
    receiver.on("started", () => {
      item.status = "receiving";
      this.emit("receiverStarted", { stream: id, ...this.stats(item) });
    });
    receiver.on("packet", (packet) => {
      try {
        storage.write(packet, new Date());
        this.emit("packetReceived", { stream: id, ...this.stats(item) });
      } catch (error) {
        item.status = "error";
        item.error = error.message;
        this.emit("receiverError", { stream: id, ...this.stats(item) });
      }
    });
    receiver.on("error", (error) => {
      item.status = "error";
      item.error = error.message;
      this.emit("receiverError", { stream: id, ...this.stats(item) });
    });
    try {
      await receiver.start();
      return { id };
    } catch (error) {
      item.status = "error";
      item.error = error.message;
      this.emit("receiverError", { stream: id, ...this.stats(item) });
      await this.stopStream(id);
      throw new Error(`${config.name}: ${error.message}`);
    }
  }

  async stopStream(id) {
    const item = this.active.get(id);
    if (!item) return null;
    item.status = "stopping";
    await item.receiver.stop();
    const metadata = await item.storage.close();
    this.active.delete(id);
    this.emit("receiverStopped", { stream: id, ...metadata });
    return metadata;
  }

  async stop() {
    const ids = [...this.active.keys()];
    const metadata = await Promise.all(ids.map((id) => this.stopStream(id)));
    this.lastSession = metadata;
    this.emit("recordingStopped", {
      status: "stopped",
      streams: Object.fromEntries(
        metadata
          .filter(Boolean)
          .map((item) => [
            item.stream,
            { packetCount: item.packetCount, bytes: item.totalBytes },
          ]),
      ),
    });
    return this.lastSession;
  }
}

module.exports = DataReaderService;
