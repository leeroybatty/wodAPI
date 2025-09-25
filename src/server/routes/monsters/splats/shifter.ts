export const buildHistoricalFeraExclusions = (
  year = 2025,
): string[] => {
  let exclusions = [];
  if (year > 1500) {
    exclusions.push('apis');
    if (year > 1697) {
      exclusions.push('camazotz');
      if (year > 1100) {
        exclusions.push('kitsune');
        if (year > -10000) {
          exclusions.push('grondr');
        }
      }
    }
  }
  return exclusions
}