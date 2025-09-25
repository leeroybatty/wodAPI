import { getMonsters } from './monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { ErrorKeys } from '../../errors/errors.types';
import { createSuccessResponse } from '../../errors';
import { buildHistoricalClanExclusions, buildHistoricalFamilyExclusions } from './splats/vampire';
import { buildHistoricalCraftExclusions } from './splats/mage';
import { buildHistoricalFeraExclusions } from './splats/shifter';
import { buildHistoricalMummyExclusions } from './splats/mummy';
import { reconcileIncludeExclude } from '../helpers';
import { ValidFormat, FilterOptions } from '../types';
import { referenceCache } from '../../sql';
import { MonsterTemplates } from './types'

export const getAllMonsterTypes = async (
  type: MonsterTemplates,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {

  const {year, bookIds, exclude, include, faction, format} = options;
  
  let monster = type;
  
  let defaultExclusions: string[] = [];
  switch (true) {
    case type === MonsterTemplates.VAMPIRE:
      defaultExclusions = buildHistoricalClanExclusions(year);
      break;
    case type === MonsterTemplates.GHOUL:
      const clanExclusions = buildHistoricalClanExclusions(year);
      defaultExclusions = clanExclusions.map(clan => `${clan} vassal`); 
      break;
    case type === MonsterTemplates.REVENANT:
      defaultExclusions = buildHistoricalFamilyExclusions(year);
      break;
    case type === MonsterTemplates.MAGE:
      const craftExclusions = buildHistoricalCraftExclusions(year);
      break;
    case type === MonsterTemplates.SHIFTER:
      defaultExclusions = buildHistoricalFeraExclusions(year);
      break;
    case type === MonsterTemplates.KINFOLK:
      const feraExclusions = buildHistoricalFeraExclusions(year);
      defaultExclusions = feraExclusions.map(fera => `${fera} kinfolk`); 
      break;
    case [MonsterTemplates.DEMON, MonsterTemplates.HUNTER].includes(type):
      if (year && year < 1999) {
        monster = MonsterTemplates.HUMAN // You can't actually play these before 1999!
      }
      break;
    case type === MonsterTemplates.CHANGELING:
      if (year && year > 1350 && year < 1969) {
        defaultExclusions.push('arcadian sidhe', 'autumn sidhe', 'sidhe');
      }
      break;
    default:
      break;
      // Wraith, Demon, and Hunter exclusions omitteds
  }

  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;

  return await getMonsters(
    [monster],
    {
      bookIds,
      exclude: exclusions,
      include,
      faction,
      format
    }
  );
}
