export function createPlotRequest(values = {}) {
  return {
    source: values.source || "radar",
    tracks: values.tracks || [],
    plotType: values.plotType || null,
    offset: values.offset || { range: 0, azimuth: 0, elevation: 0, time: 0 },
  };
}
