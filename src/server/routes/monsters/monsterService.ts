import { getMonsters, getMonsterAncestors } from './monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { ErrorKeys } from '../../errors/errors.types';
import { createSuccessResponse, createErrorResponse } from '../../errors';
import { buildHistoricalClanExclusions, buildHistoricalFamilyExclusions } from './splats/vampire';
import { buildHistoricalCraftExclusions } from './splats/mage';
import { buildHistoricalFeraExclusions } from './splats/shifter';
import { buildHistoricalMummyExclusions } from './splats/mummy';
import { reconcileIncludeExclude } from '../helpers';
import { ValidFormat, FilterOptions } from '../types';
import { referenceCache } from '../../sql';
import { MonsterTemplates } from './types'

export const getAllTopLevelMonsters = async(
  options: FilterOptions): Promise<ApiResponse<unknown>> => {
  const {year, bookIds, exclude, include, faction, format} = options;
  let defaultExclusions: string[] = [];
  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;
  return await getMonsterAncestors({...options, exclude: exclusions});   
}

const buildHistoricalMonsterExclusions = (
  type: MonsterTemplates,
  year: number): string[] => {
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
    case type === MonsterTemplates.CHANGELING:
      if (year && year > 1350 && year < 1969) {
        defaultExclusions.push('arcadian sidhe', 'autumn sidhe', 'sidhe');
      }
      break;
    default:
      break;
  }
  return defaultExclusions
};

export const getAllMonsterTypes = async (
  identifier: number | MonsterTemplates,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {
  const {year, include} = options;
  let icYear = year || 2025;
  let type: string;
  if (typeof identifier === 'number') {
    type = await referenceCache.getMonsterName(identifier);
  } else {
    type = identifier
  }
  const {exclude} = options;
  const validMonsters = Object.values(MonsterTemplates)
  if (!validMonsters.includes(type as MonsterTemplates)) {
    return createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
  }
  let exclusions = buildHistoricalMonsterExclusions(type as MonsterTemplates, icYear);
  if (include && include.length > 0 ) {
    exclusions = reconcileIncludeExclude(include, exclusions);
  }
  if (exclude && exclude.length > 0) {
    exclusions = [...exclusions, ...exclude]
  }

  return await getMonsters(
    [type],
    {...options,
      exclude: exclusions
    }
  );
}