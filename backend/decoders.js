function rawMetadata(buffer) {
  return { length: buffer.length, hex: buffer.toString("hex") };
}

const decodeTrack = rawMetadata;
const decodePlot = rawMetadata;
const decodeDetection = rawMetadata;
const decodeDwellPlayedStatus = rawMetadata;
const decodeDwellRequest = rawMetadata;
const decodeSPSyncError = rawMetadata;
const decodeSTM_SP = rawMetadata;

module.exports = {
  decodeTrack,
  decodePlot,
  decodeDetection,
  decodeDwellPlayedStatus,
  decodeDwellRequest,
  decodeSPSyncError,
  decodeSTM_SP,
};
