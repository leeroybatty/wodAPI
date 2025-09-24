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
  switch (true) {
    case icYear > 1500:
      exclusions.push('apis');
    case icYear > 1697:
      exclusions.push('camazotz');
    case icYear > 1100:
      exclusions.push('kitsune');
    case icYear > -10000:
      exclusions.push('grondr');
      break;
    default:
      break;
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

  switch (true) {
    // Post-1999: Modern mummies available, ancient ones mostly converted
    case icYear >= 1999:
      exclusions.push(...ancientMummies);
      break;

    default:
      // Pre-1999: Modern mummies don't exist yet
      exclusions.push(...amentiDynasties, ...wuTian);

      // Spanish conquest dead zone (1530-1999): Original Capacocha can't resurrect properly
      if (icYear >= 1530) {
        exclusions.push(...capacocha);
      }
      break;
  }

  switch (true) {
    // Pre-Chinchorro: No South American mummies at all
    case icYear < -5050:
      exclusions.push(...capacocha);

    // Pre-ancient Egypt: No Egyptian mummies at all
    case icYear < -3500:
      exclusions.push(...ancientMummies, 'cabiri');

    // Pre-rainforest contact: Uchumallki don't exist yet
    case icYear < -1770:
      exclusions.push('uchumallki');

    // Pre-Chimu contact: Only Pachamallki exist
    case icYear < -1530:
      exclusions.push('intimallki');

    // Pre-Greek classical period: No Cabiri yet
    case icYear < -500:
      exclusions.push('cabiri');

    // Pre-Inca period: Chaskimallki don't exist yet
    case icYear < 1200:
      exclusions.push('chaskimallki');
      break;

    default:
      break;
  }
  return await getMonsters(['mummy'], bookIdList, exclusions);
};
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
  userExclusions: string[] = []
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];

  switch (true) {
    case icYear < -2300:
      exclusions.push('taftani');
    case icYear < -800:
      exclusions.push('hyppolytoi', 'sisters of hippolyta', 'wu lung');
    case icYear < 513:
      exclusions.push('ahl-i-batin');
    case icYear < 767:
      exclusions.push('order of hermes');
    case icYear < 1100:
      exclusions.push('ngoma');
    case icYear < 1128:
      exclusions.push('knights templar');
    case icYear < 1315:
      exclusions.push('chakravanti', 'euthanatos', 'solificati', 'children of knowledge');
    case icYear < 1440:
      exclusions.push('sahajiya', 'cult of ecstasy', 'verbena');
    case icYear < 1452:
      exclusions.push('celestial chorus', "kha'vadi", 'dreamspeaker', 'dreamspeakers');
    case icYear < 1750:
      exclusions.push("bata'a");
    case icYear < 1806:
      exclusions.push('society of ether', 'sons of ether', 'hollow ones');
    case icYear < 1823:
      exclusions.push('virtual adepts', 'mercurial elite');
    case icYear < 1851:
      exclusions.push('syndicate');
    case icYear < 1897:
      exclusions.push('iteration x', 'progenitors', 'void engineers');
    case icYear < 1914:
      exclusions.push('new world order');
      break;
    default:
      break;
  }

  return await getMonsters(['mage'], bookIdList, exclusions);
};