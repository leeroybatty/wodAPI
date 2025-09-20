import { getMonsters } from './monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { ErrorKeys } from '../../errors/errors.types';
import { createSuccessResponse } from '../../errors';
export { getAllVampireBloodlines, getAllVampireClans, getAllRevenantFamilies, getAllGhoulClans } from './splats/vampire';

export const getAllShifterSpecies = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[]
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear > 1500) {
    exclusions.push('apis');
    if (icYear > 1697) {
      exclusions.push('camazotz');
    }
  } else if (icYear < 1100) {
    exclusions.push('kitsune');
    if (icYear < -10000) {
      exclusions.push('grondr');
    }
  }
  return await getMonsters(['shifter'], bookIdList, exclusions);
}

export const getAllChangelingKiths = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[]
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear > 1350 && icYear < 1969) {
    exclusions.push('arcadian sidhe', 'autumn sidhe', 'sidhe');
  }
  return await getMonsters(['changeling'], bookIdList, exclusions);
};

export const getAllWraithTypes = async (
  bookIdList: number[],
  userExclusions: string[] = [],
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  return await getMonsters(['wraith'], bookIdList, exclusions);
};

export const getAllDemonHouses = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[] = []
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear >= 1999) {
    return await getMonsters(['demon'], bookIdList, exclusions);
  }
  return createSuccessResponse({
    monsters: []
  });
}

export const getAllMummyTypes = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[] = []
): Promise<ApiResponse<unknown>> => {

  const ancientMummies = ['shemsu-heru', 'ishmaelites', 'cabiri'];
  const amentiDynasties = ['kher-minu', 'khri-habi', 'mesektet', 'sakhmu', 'sefekhi', 'udja-sen'];
  const wuTian = ['wu feng', 'xian lung'];
  const capacocha = ['pachamallki', 'intimallki', 'uchumallki', 'chaskimallki'];
  
  let exclusions = [...userExclusions];

  // Post-1999: Modern mummies available, ancient ones mostly converted
  if (icYear >= 1999) {
    exclusions = [...exclusions, ...ancientMummies];
  } else {
    // Pre-1999: Modern mummies don't exist yet
    exclusions = [...exclusions, ...amentiDynasties, ...wuTian];
    
    // Spanish conquest dead zone (1530-1999): Original Capacocha can't resurrect properly
    if (icYear >= 1530) {
      exclusions = [...exclusions, ...capacocha];
    }
  }

  // Pre-Inca period: Chaskimallki don't exist yet
  if (icYear < 1200) {
    exclusions.push('chaskimallki');
  }

  // Pre-Greek classical period: No Cabiri yet
  if (icYear < -500) {
    exclusions.push('cabiri');
  }

  // Pre-rainforest contact: Uchumallki don't exist yet  
  if (icYear < -1770) {
    exclusions.push('uchumallki');
  }

  // Pre-Chimu contact: Only Pachamallki exist
  if (icYear < -1530) {
    exclusions.push('intimallki');
  }

  // Pre-ancient Egypt: No Egyptian mummies at all
  if (icYear < -3500) {
    exclusions = [...exclusions, ...ancientMummies, 'cabiri'];
  }

  // Pre-Chinchorro: No South American mummies at all
  if (icYear < -5050) {
    exclusions = [...exclusions, ...capacocha];
  }

  return await getMonsters(['mummy'], bookIdList, exclusions);
}

export const getAllHunterCreeds = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[] = []
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear >= 1999) {
    return await getMonsters(['hunter'], bookIdList, exclusions);
  }
  return createSuccessResponse({
    monsters: []
  });
}


export const getAllMageTraditions = async (
  bookIdList: number[],
  icYear = 2025,
  userExclusions: string[]
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear < 1914) {
    exclusions.push('new world order');
    if (icYear < 1897) {
      exclusions = [...exclusions, ...['iteration x', 'progenitors', 'void engineers']];
      if (icYear < 1851) {
        exclusions.push('syndicate');
        if (icYear < 1823) {
          exclusions = [...exclusions, ...['virtual adepts', 'mercurial elite']];
          if (icYear < 1806) {
            exclusions = [...exclusions, ...['society of ether', 'sons of ether', 'hollow ones']];
          }
          if (icYear < 1750) {
            exclusions.push("bata'a");
            if (icYear < 1452) {
              exclusions = [...exclusions, ...[
                'celestial chorus',
                "kha'vadi",
                "dreamspeaker",
                "dreamspeakers"
              ]];
              if (icYear < 1440) {
                exclusions = [...exclusions, ...['sahajiya', 'cult of ecstasy', 'verbena']];
                if (icYear < 1315) {
                  exclusions = [...exclusions, ...[
                    'chakravanti',
                    'euthanatos',
                    'solificati',
                    'children of knowledge'
                  ]];
                  if (icYear < 1128) {
                    exclusions.push('knights templar');
                    if (icYear < 1100) {
                      exclusions.push('ngoma');
                      if (icYear < 767) {
                        exclusions.push('order of hermes');
                        if (icYear < 513) {
                          exclusions.push('ahl-i-batin');
                          if (icYear < -800) {
                            exclusions = [...exclusions, ...['hyppolytoi', 'sisters of hippolyta', 'wu lung']];
                            if (icYear < -2300) {
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
  return await getMonsters(['mage'], bookIdList, exclusions);
}