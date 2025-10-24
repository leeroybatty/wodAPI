import { getMonsters, getMonsterAncestors } from './monsterRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { ErrorKeys } from '../../errors/errors.types';
import { createSuccessResponse, createErrorResponse } from '../../errors';
import { 
  buildHistoricalClanExclusions,
  buildHistoricalFamilyExclusions,
  buildHistoricalBloodlineExclusions,
  buildHistoricalTalMaheRaClanInclusions,
  isBloodline
} from './splats/vampire';
import { buildHistoricalCraftExclusions } from './splats/mage';
import { buildHistoricalFeraExclusions } from './splats/shifter';
import { buildHistoricalMummyExclusions } from './splats/mummy';
import { reconcileIncludeExclude } from '../helpers';
import { ValidFormat, FilterOptions } from '../types';
import { referenceCache } from '../../sql';
import { MonsterTemplates } from './types';

export const getAllTopLevelMonsters = async(
  splats: string[],
  options: FilterOptions): Promise<ApiResponse<unknown>> => {
  const {exclude, include, format} = options;
  let defaultExclusions: string[] = [];
  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;
  return await getMonsterAncestors(splats, {...options, exclude: exclusions});   
}

const buildHistoricalMonsterInclusions = (
  type: MonsterTemplates,
  year: number,
  faction?: string): string[] => {
  let defaultInclusions: string[] = [];
  switch (true) {
    case [MonsterTemplates.VAMPIRE, MonsterTemplates.GHOUL].includes(type):
      if (faction) {
        if (faction === 'camarilla' && year > 1999) {
          // Schismatics join after Ur-Shulgi ruins Christmas:
          defaultInclusions.push('assamite');
        }
        if (faction === "tal'mahe'ra") {
          defaultInclusions = buildHistoricalTalMaheRaClanInclusions(year);
        }
      }
      break;
    default:
      break;
  }
  return defaultInclusions;
}

const buildHistoricalMonsterExclusions = (
  type: MonsterTemplates,
  year: number,
  faction?: string): string[] => {
  let defaultExclusions: string[] = [];
  switch (true) {
    case type === MonsterTemplates.VAMPIRE:
      defaultExclusions = buildHistoricalClanExclusions(year, faction);
      break;
    case type === MonsterTemplates.GHOUL:
      const clanExclusions = buildHistoricalClanExclusions(year, faction);
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
    case isBloodline(type):
      defaultExclusions = buildHistoricalBloodlineExclusions(year);
      break;
    default:
      break;
  }
  return defaultExclusions
};

export const getAllMonsterTypes = async (
  identifier: number | MonsterTemplates | string,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {

  const {year, include, faction, exclude} = options;
  let icYear = year || 2025;
  let type: string;
  if (typeof identifier === 'number') {
    type = await referenceCache.getMonsterName(identifier);
  } else {
    type = identifier
  }

  const validMonsters = Object.values(MonsterTemplates)
  if (!validMonsters.includes(type as MonsterTemplates)) {
    return createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
  }
  let exclusions = reconcileIncludeExclude(include,
    buildHistoricalMonsterExclusions(
    type as MonsterTemplates,
    icYear,
    faction
  ))

  let inclusions = reconcileIncludeExclude(exclude,
    buildHistoricalMonsterInclusions(
    type as MonsterTemplates,
    icYear,
    faction
  ))

  return await getMonsters(
    [type],
    {...options,
      exclude: exclusions,
      include: inclusions
    }
  );
}