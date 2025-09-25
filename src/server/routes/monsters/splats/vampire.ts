import { getMonsters } from '../monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../../apiResponse.types';
import { ErrorKeys } from '../../../errors/errors.types';
import { createErrorResponse } from '../../../errors';

export const buildHistoricalClanExclusions = (year: number = 2025): string[] => {
  let exclusions: string[] = [];
  if (year > 1600) {
    const darkAgesOnlyClans = ['bonsam', 'impundulu', 'niktuku', 'ramanga'];
    exclusions = [...exclusions, ...darkAgesOnlyClans];
  }

  if (year < 1950) {
    exclusions.push('serpent of the light');
    if (year < 1900) {
      exclusions.push('blood brothers');
      if (year < 1450) {
        exclusions.push('daughter of cacophony');
        if (year < 1167) {
          exclusions.push('gargoyle');
          if (year < 1090) {
            exclusions.push('tremere');
            if (year < 1055) {
              exclusions.push('giovanni');
              if (year < -8000) {
                exclusions.push('tzimisce');
              }
            }
          }
        }
      }
    }
  }
  return exclusions;
}

// export const getAllVampireBloodlines = async (
//   bookIdList: number[], 
//   year: number = 2025,
//   userExclusions: string[]
// ): Promise<ApiResponse<unknown>> => {
//   let exclusions = [...userExclusions];

//   const modernBloodlines = ['salubri', 'salubri antitribu', 'city gangrel'];
//   const darkAgesBloodlines = [
//     'ananke',
//     'anda',
//     'warrior salubri',
//     'healer salubri',
//     'watcher salubri'
//   ];

//   const excludedByEra = year > 1600 
//   ? darkAgesBloodlines
//   : modernBloodlines;
//   exclusions = [...exclusions, ...excludedByEra];

//   if (year >= 1800 && year <= 1900) {
//     exclusions.push('ahrimanes');
//   }

//   if (year > 1350) {
//     exclusions.push('lhiannan');
//     if (year > 1400) {
//       exclusions.push('noiad');
//       if (year < 1650) {
//         exclusions.push('lamia');
//         exclusions.push('lamiae');
//       }
//     }
//   }

//   const clansResult = await getMonsters(['vampire'], {});
//   if (clansResult.success && clansResult.data) {
//     const { monsters } = clansResult.data;
//     const clans = monsters?.map(clan => clan.name.toLowerCase());
//     return await getMonsters(clans, {books: bookIdList, exclude: exclusions});
//   }
//   return createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR);
// }

export const buildHistoricalFamilyExclusions = (
  year: number = 2025,
): string[] => {
  let exclusions = [];
   if (year < 1565) {
    exclusions.push('oprichniki', 'rosellini');
    if (year < 1450) {
      exclusions.push('servants of anushin-rawan');
      if (year < 1315) {
        exclusions.push('grimaldi');
        if (year < 1200) {
          exclusions.push('obertus');
          if (year < 1100) {
            exclusions.push('zantosa');
            if (year < 1000) {
              exclusions.push('bratovich');
              if (year < 800) {
                exclusions.push('rafastio', 'enrathi');
              }
            }
          }
        }
      }
    }
  }
  // The Krevcheski betray the Tzimisce and become the Ducheski in the late 12th century
  const familyName = year > 1200 ? 'Krevcheski' : 'Ducheski'; 
  exclusions.push(familyName);
  return exclusions;
}