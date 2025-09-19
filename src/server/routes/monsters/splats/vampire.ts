import { getMonsters } from '../monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../../apiResponse.types';
import { ErrorKeys } from '../../../errors/errors.types';
import { createErrorResponse } from '../../../errors';

const buildHistoricalClanExclusions = (icYear: number = 2025): string[] => {
  let exclusions: string[] = [];
  if (icYear > 1600) {
    const darkAgesOnlyClans = ['bonsam', 'impundulu', 'niktuku', 'ramanga'];
    exclusions = [...exclusions, ...darkAgesOnlyClans];
  }

  if (icYear < 1950) {
    exclusions.push('serpent of the light');
    exclusions.push('serpents of the light');
    if (icYear < 1900) {
      exclusions.push('blood brother');
      exclusions.push('blood brothers');
      if (icYear < 1450) {
        exclusions.push('daughter of cacophony');
        exclusions.push('daughters of cacophony');
        if (icYear < 1167) {
          exclusions.push('gargoyles');
          exclusions.push('gargoyle');
          if (icYear < 1090) {
            exclusions.push('tremere');
            if (icYear < 1055) {
              exclusions.push('giovanni');
              exclusions.push('giovani');
              if (icYear < -8000) {
                exclusions.push('tzimisce');
              }
            }
          }
        }
      }
    }
  }
  return exclusions 
}


export const getAllVampireClans = async (bookIdList: number[], icYear = 2025, userExclusions: string[]): Promise<ApiResponse<unknown>> => {
  let historicalExclusions = buildHistoricalClanExclusions(icYear)
  return await getMonsters(['vampire'], bookIdList, [...userExclusions, ...historicalExclusions]);
}

export const getAllGhoulClans = async (bookIdList: number[], icYear = 2025, userExclusions: string[]): Promise<ApiResponse<unknown>> => {
  const historicalExclusions = buildHistoricalClanExclusions(icYear)
  const excludedVassals = historicalExclusions.map(clan => `${clan} vassal`);
  return await getMonsters(['ghoul'], bookIdList, [...userExclusions, ...excludedVassals]);
}

export const getAllVampireBloodlines = async (
  bookIdList: number[], 
  icYear: number = 2025,
  userExclusions: string[]
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];

  const modernBloodlines = ['salubri', 'salubri antitribu', 'city gangrel'];
  const darkAgesBloodlines = [
    'ananke',
    'anda',
    'warrior salubri',
    'healer salubri',
    'watcher salubri'
  ];

  const excludedByEra = icYear > 1600 
  ? darkAgesBloodlines
  : modernBloodlines;
  exclusions = [...exclusions, ...excludedByEra];

  if (icYear >= 1800 && icYear <= 1900) {
    exclusions.push('ahrimanes');
  }

  if (icYear > 1350) {
    exclusions.push('lhiannan');
    if (icYear > 1400) {
      exclusions.push('noiad');
      if (icYear < 1650) {
        exclusions.push('lamia');
        exclusions.push('lamiae');
      }
    }
  }

  const clansResult = await getMonsters(['vampire']);
  if (clansResult.success && clansResult.data) {
    const { monsters } = clansResult.data;
    const clans = monsters?.map(clan => clan.name.toLowerCase());
    return await getMonsters(clans, bookIdList, exclusions);
  }
  return createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
}

export const getAllRevenantFamilies = async (
  bookIdList: number[], 
  icYear: number = 2025,
  userExclusions: string[]
): Promise<ApiResponse<unknown>> => {
  let exclusions = [...userExclusions];
  if (icYear < 1565) {
    exclusions.push('oprichniki', 'rosellini');
    if (icYear < 1450) {
      exclusions.push('servants of anushin-rawan');
      if (icYear < 1315) {
        exclusions.push('grimaldi');
        if (icYear < 1200) {
          exclusions.push('obertus');
          if (icYear < 1100) {
            exclusions.push('zantosa');
            if (icYear < 1000) {
              exclusions.push('bratovich');
              if (icYear < 800) {
                exclusions.push('rafastio', 'enrathi');
              }
            }
          }
        }
      }
    }
  }

  // The Krevcheski betray the Tzimisce and become the Ducheski in the late 12th century
  const familyName = icYear > 1200 ? 'Krevcheski' : 'Ducheski'; 
  exclusions.push(familyName);

  return await getMonsters(['revenant'], bookIdList, exclusions);
}