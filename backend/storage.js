const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { outputDirectory } = require("./config");

function timestampParts(date = new Date()) {
  const stamp = date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "");
  return {
    date: stamp.slice(0, 8),
    time: stamp.slice(9, 15),
    iso: date.toISOString(),
  };
}

function uniqueBaseName(baseName) {
  let candidate = baseName;
  let suffix = 1;
  while (
    fs.existsSync(path.join(outputDirectory, `${candidate}.bin`)) ||
    fs.existsSync(path.join(outputDirectory, `${candidate}.pdf`))
  ) {
    candidate = `${baseName}_${String(suffix).padStart(3, "0")}`;
    suffix += 1;
  }
  return candidate;
}

class StreamStorage {
  constructor(streamId, config, format) {
    fs.mkdirSync(outputDirectory, { recursive: true });
    const now = timestampParts();
    this.streamId = streamId;
    this.config = config;
    this.format = format === "pdf" ? "pdf" : "bin";
    this.startTime = now.iso;
    this.lastPacketTime = null;
    this.packetCount = 0;
    this.totalBytes = 0;
    this.baseName = uniqueBaseName(
      `${config.name.replace(/[^A-Za-z0-9_]+/g, "_")}_${now.date}_${now.time}`,
    );
    this.binFile = `${this.baseName}.bin`;
    this.pdfFile = `${this.baseName}.pdf`;
    this.binPath = path.join(outputDirectory, this.binFile);
    this.pdfPath = path.join(outputDirectory, this.pdfFile);
    this.stream =
      this.format === "bin" ? fs.createWriteStream(this.binPath) : null;
    this.pdf = this.format === "pdf" ? this.createPdf() : null;
  }

  createPdf() {
    const pdf = new PDFDocument({ margin: 48 });
    pdf.pipe(fs.createWriteStream(this.pdfPath));
    pdf.fontSize(18).text(`${this.config.name} packet log`);
    pdf
      .moveDown()
      .fontSize(10)
      .text(
        `Source: ${this.config.source}    Destination: ${this.config.destination}`,
      );
    pdf.text(`Start time: ${this.startTime}`);
    pdf.moveDown();
    return pdf;
  }

  write(packet, receivedAt = new Date()) {
    const timestamp = BigInt(receivedAt.getTime());
    const header = Buffer.alloc(12);
    header.writeBigInt64BE(timestamp, 0);
    header.writeUInt32BE(packet.length, 8);
    if (this.stream) this.stream.write(Buffer.concat([header, packet]));
    if (this.pdf) {
      this.pdf
        .fontSize(8)
        .text(`${receivedAt.toISOString()} | ${packet.length} bytes`);
      this.pdf.fontSize(7).text(packet.toString("hex"), { width: 500 });
      this.pdf.moveDown(0.5);
    }
    this.packetCount += 1;
    this.totalBytes += packet.length;
    this.lastPacketTime = receivedAt.toISOString();
  }

  async close() {
    const stopTime = new Date().toISOString();
    await new Promise((resolve, reject) => {
      if (!this.stream) return resolve();
      this.stream.once("error", reject);
      this.stream.end(resolve);
    });
    if (this.pdf) {
      this.pdf.fontSize(10).moveDown().text(`Packets: ${this.packetCount}`);
      this.pdf.text(`Total bytes: ${this.totalBytes}`);
      this.pdf.end();
      await new Promise((resolve) => this.pdf.on("end", resolve));
    }
    const metadata = {
      stream: this.streamId,
      source: this.config.source,
      destination: this.config.destination,
      multicastAddress: this.config.multicastAddress || null,
      port: this.config.port || null,
      startTime: this.startTime,
      stopTime,
      packetCount: this.packetCount,
      totalBytes: this.totalBytes,
      binFile: this.format === "bin" ? this.binFile : null,
      pdfFile: this.format === "pdf" ? this.pdfFile : null,
    };
    const metadataFile = `${this.baseName}.json`;
    await fs.promises.writeFile(
      path.join(outputDirectory, metadataFile),
      JSON.stringify(metadata, null, 2),
      "utf8",
    );
    return metadata;
  }
}

module.exports = { StreamStorage, outputDirectory };
