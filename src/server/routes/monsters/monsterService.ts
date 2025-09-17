import { getMonsters } from './monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ErrorKeys } from '../../errors/errors.types';

export const getVampireClans = async (bookIdList: number[], icYear = 2025, userExclusions: string[]): Promise<ApiResponse<unknown>> => {

  let exclusions = [...userExclusions];
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
              }
            }
          }
        }
      }
    }
  return await getMonsters('vampire', bookIdList, exclusions);
}