const path = require("path");
const net = require("net");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const toPort = (value) => (value ? Number(value) : 0);

const STREAM_CONFIG = {
  track: {
    name: "Track",
    source: "RDP",
    destination: "DWS",
    multicastAddress: process.env.TRACK_MULTICAST_ADDRESS,
    port: toPort(process.env.TRACK_MULTICAST_PORT),
  },
  plot: {
    name: "Plot",
    source: "MBP",
    destination: "RDP",
    multicastAddress: process.env.PLOT_MULTICAST_ADDRESS,
    port: toPort(process.env.PLOT_MULTICAST_PORT),
  },
  detection: {
    name: "Detection",
    source: "SP",
    destination: "MBP",
    multicastAddress: process.env.DETECTION_MULTICAST_ADDRESS,
    port: toPort(process.env.DETECTION_MULTICAST_PORT),
  },
  dwellPlayedStatus: {
    name: "Dwell Played Status",
    source: "RRM",
    destination: "DEBUG",
    multicastAddress: process.env.DWELL_PLAYED_MULTICAST_ADDRESS,
    port: toPort(process.env.DWELL_PLAYED_MULTICAST_PORT),
  },
  dwellRequest: {
    name: "Dwell Request",
    source: "RDP",
    destination: "RRM",
    multicastAddress: process.env.DWELL_REQUEST_MULTICAST_ADDRESS,
    port: toPort(process.env.DWELL_REQUEST_MULTICAST_PORT),
  },
  spSyncError: {
    name: "SP Sync Error",
    source: "SP",
    destination: "DEBUG",
    multicastAddress: process.env.SP_SYNC_MULTICAST_ADDRESS,
    port: toPort(process.env.SP_SYNC_MULTICAST_PORT),
  },
  stmSp: {
    name: "STM_SP",
    source: "STM",
    destination: "SP",
    multicastAddress: process.env.STM_SP_MULTICAST_ADDRESS,
    port: toPort(process.env.STM_SP_MULTICAST_PORT),
  },
};

const outputDirectory = path.resolve(
  process.cwd(),
  process.env.DATA_READER_OUTPUT_DIR || "./DataReader",
);
const testMode =
  String(process.env.DATA_READER_TEST_MODE).toLowerCase() === "true";

function validateStreamConfig(streamId) {
  const config = STREAM_CONFIG[streamId];
  if (!config) throw new Error(`Unknown stream: ${streamId}`);
  if (testMode) return config;
  if (!config.multicastAddress || !config.port)
    throw new Error(`Multicast configuration missing for ${config.name}.`);
  if (net.isIP(config.multicastAddress) !== 4)
    throw new Error(`Invalid multicast IP for ${config.name}.`);
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
    throw new Error(`Invalid UDP port for ${config.name}.`);
  return config;
}

module.exports = {
  STREAM_CONFIG,
  outputDirectory,
  testMode,
  validateStreamConfig,
};
