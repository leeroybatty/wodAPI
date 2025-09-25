export const buildHistoricalCraftExclusions = (
  year = 2025,
): string[] => {
  let exclusions: string[] = [];
  if (year < 1914) {
    exclusions.push('new world order');
    if (year < 1897) {
      exclusions = [...exclusions, ...['iteration x', 'progenitors', 'void engineers']];
      if (year < 1851) {
        exclusions.push('syndicate');
        if (year < 1823) {
          exclusions = [...exclusions, ...['virtual adepts', 'mercurial elite']];
          if (year < 1806) {
            exclusions = [...exclusions, ...['society of ether', 'sons of ether', 'hollow ones']];
          }
          if (year < 1750) {
            exclusions.push("bata'a");
            if (year < 1452) {
              exclusions = [...exclusions, ...[
                'celestial chorus',
                "kha'vadi",
                "dreamspeaker",
                "dreamspeakers"
              ]];
              if (year < 1440) {
                exclusions = [...exclusions, ...['sahajiya', 'cult of ecstasy', 'verbena']];
                if (year < 1315) {
                  exclusions = [...exclusions, ...[
                    'chakravanti',
                    'euthanatos',
                    'solificati',
                    'children of knowledge'
                  ]];
                  if (year < 1128) {
                    exclusions.push('knights templar');
                    if (year < 1100) {
                      exclusions.push('ngoma');
                      if (year < 767) {
                        exclusions.push('order of hermes');
                        if (year < 513) {
                          exclusions.push('ahl-i-batin');
                          if (year < -800) {
                            exclusions = [...exclusions, ...['hyppolytoi', 'sisters of hippolyta', 'wu lung']];
                            if (year < -2300) {
                              exclusions.push('taftani')
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return exclusions;
};