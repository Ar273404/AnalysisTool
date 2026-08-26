const dgram = require("dgram");
const { EventEmitter } = require("events");

class MulticastReceiver extends EventEmitter {
  constructor(streamId, config, testMode = false) {
    super();
    this.streamId = streamId;
    this.config = config;
    this.testMode = testMode;
    this.socket = null;
    this.timer = null;
    this.closed = false;
  }

  start() {
    if (this.testMode) {
      this.timer = setInterval(
        () => this.emit("packet", Buffer.from(`test packet ${Date.now()}`)),
        250,
      );
      this.emit("started");
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.socket = dgram.createSocket("udp4");
      const fail = (error) => {
        this.emit("error", error);
        if (!this.closed) reject(error);
      };
      this.socket.once("error", fail);
      this.socket.on("message", (packet) => this.emit("packet", packet));
      this.socket.on("close", () => this.emit("closed"));
      this.socket.bind(this.config.port, () => {
        try {
          this.socket.addMembership(this.config.multicastAddress);
          this.socket.removeListener("error", fail);
          this.socket.on("error", (error) => this.emit("error", error));
          this.emit("started");
          resolve();
        } catch (error) {
          fail(error);
        }
      });
    });
  }

  async stop() {
    this.closed = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.emit("closed");
      return;
    }
    if (!this.socket) return;
    try {
      this.socket.dropMembership(this.config.multicastAddress);
    } catch {
      // The socket may already be closed after an error.
    }
    await new Promise((resolve) => {
      this.socket.close(resolve);
    });
    this.socket = null;
  }
}

module.exports = MulticastReceiver;
