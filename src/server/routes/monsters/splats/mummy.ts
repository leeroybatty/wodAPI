export const buildHistoricalMummyExclusions = (
  year = 2025,
): string[] => {
  let exclusions: string[] = [];
  const ancientMummies = ['shemsu-heru', 'ishmaelites', 'cabiri'];
  const amentiDynasties = ['kher-minu', 'khri-habi', 'mesektet', 'sakhmu', 'sefekhi', 'udja-sen'];
  const wuTian = ['wu feng', 'xian lung'];
  const capacocha = ['pachamallki', 'intimallki', 'uchumallki', 'chaskimallki'];

  // Post-1999: Modern mummies available, ancient ones mostly converted
  if (year >= 1999) {
    exclusions = [...exclusions, ...ancientMummies];
  } else {
    // Pre-1999: Modern mummies don't exist yet
    exclusions = [...exclusions, ...amentiDynasties, ...wuTian];

    // Spanish conquest dead zone (1530-1999): Original Capacocha can't resurrect properly
    if (year >= 1530) {
      exclusions = [...exclusions, ...capacocha];
    }
  }

  // Pre-Inca period: Chaskimallki don't exist yet
  if (year < 1200) {
    exclusions.push('chaskimallki');
  }

  // Pre-Greek classical period: No Cabiri yet
  if (year < -500) {
    exclusions.push('cabiri');
  }

  // Pre-rainforest contact: Uchumallki don't exist yet
  if (year < -1770) {
    exclusions.push('uchumallki');
  }

  // Pre-Chimu contact: Only Pachamallki exist
  if (year < -1530) {
    exclusions.push('intimallki');
  }

  // Pre-ancient Egypt: No Egyptian mummies at all
  if (year < -3500) {
    exclusions = [...exclusions, ...ancientMummies, 'cabiri'];
  }

  // Pre-Chinchorro: No South American mummies at all
  if (year < -5050) {
    exclusions = [...exclusions, ...capacocha];
  }

  return exclusions
}
