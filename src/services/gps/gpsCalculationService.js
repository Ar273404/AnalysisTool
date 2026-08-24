// Engineering formulas are intentionally placeholders until the approved project equations are supplied.
export function calculateRange() {
  return null;
}
export function calculateAzimuth() {
  return null;
}
export function calculateElevation() {
  return null;
}

export function calculateGpsParameters(gpsRecord, referenceData) {
  return {
    ...gpsRecord,
    range: calculateRange(gpsRecord, referenceData),
    azimuth: calculateAzimuth(gpsRecord, referenceData),
    elevation: calculateElevation(gpsRecord, referenceData),
    sensorReference: referenceData.sensorReference,
  };
}
