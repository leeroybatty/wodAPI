import { getOrganizations } from './organizationsRepository';
import { Response } from 'express';
import { ApiResponse } from '../../apiResponse.types';
import { ErrorKeys } from '../../errors/errors.types';
import { createSuccessResponse, createErrorResponse } from '../../errors';
import { reconcileIncludeExclude } from '../helpers';
import { ValidFormat, FilterOptions } from '../types';
import { referenceCache } from '../../sql';
import { MonsterTemplates } from '../monsters/types';
import { SorcererOrganizationTimelines, HistoricalPeriods } from '../monsters/splats/sorcerer';
import { buildMageFactionExclusions } from '../monsters/splats/mage';

const isActiveInYear = (organization: HistoricalPeriods, year: number) => {
  if (!organization.active || organization.active.length === 0) return false;
  return organization.active.some(period => {
    const startYear = period.from ?? -Infinity;
    const endYear = period.until ?? Infinity;
    return year >= startYear && year <= endYear;
  });
}

const buildHistoricalOrganizationExclusions = (
  type: MonsterTemplates,
  year: number): string[] => {
  let defaultExclusions: string[] = [];
  switch (true) {
    case [MonsterTemplates.VAMPIRE, MonsterTemplates.GHOUL, MonsterTemplates.REVENANT].includes(type):
      if (year < 1493) {
        defaultExclusions.push("sabbat");
        if (year < 1450) {
          defaultExclusions.push("anarchs");
          if (year < 1435) {
            defaultExclusions.push("camarilla");
          }
        }
      }
      break;
    case [MonsterTemplates.COMPANION, MonsterTemplates.MAGE].includes(type):
      defaultExclusions = buildMageFactionExclusions(year);
      break;
    case type === MonsterTemplates.SORCERER:
      defaultExclusions = buildMageFactionExclusions(year);

      SorcererOrganizationTimelines
        .filter(organization => organization.alwaysExclude)
        .forEach(organization => defaultExclusions.push(organization.name));

      SorcererOrganizationTimelines
        .filter(organization => !organization.alwaysExclude && !isActiveInYear(organization, year))
        .forEach(organization => defaultExclusions.push(organization.name));
        break;
    default:
      break;
  }
  return defaultExclusions
};

export const getMonsterOrganizations = async (
  identifier: number | MonsterTemplates,
  options: FilterOptions
): Promise<ApiResponse<unknown>> => {
  const {year, include, exclude, bookIds} = options;
  let icYear = year || 2025;
  let type: MonsterTemplates
  if (typeof identifier === 'number') {
    type = await referenceCache.getMonsterName(identifier) as MonsterTemplates
  } else {
    type = identifier
  }

  const validOptions = Object.values(MonsterTemplates)
  if (!validOptions.includes(type as MonsterTemplates)) {
    return createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
  }

  const monsters: MonsterTemplates[] = []

  let bookIdList: number[] = [];
  if (bookIds && bookIds.length === 0) {
    let bookList = [];
    switch (true) {
      case [MonsterTemplates.GHOUL, MonsterTemplates.REVENANT].includes(type):
        bookList.push('ghouls and revenants');
      case type === MonsterTemplates.VAMPIRE:
        bookList.push(
          'vampire: the masquerade 20th anniversary core',
          'vampire: dark ages 20th anniversary core',
          'the black hand: a guide to the tal\'mahe\'ra'
        );
        monsters.push(MonsterTemplates.VAMPIRE);
        break;
      case [MonsterTemplates.KINFOLK, MonsterTemplates.POSSESSED].includes(type):
        bookList.push('book of the wyrm');
        bookList.push('kinfolk: a breed apart');
     case type === MonsterTemplates.SHIFTER:
        bookList.push('werewolf: the apocalypse 20th anniversary core');
        monsters.push(MonsterTemplates.SHIFTER);
        break;
      case [MonsterTemplates.SORCERER, MonsterTemplates.HUMAN].includes(type):
        bookList.push('mage 20th anniversary: sorcerer');
        monsters.push(MonsterTemplates.SORCERER);
      case [MonsterTemplates.COMPANION, MonsterTemplates.MAGE].includes(type):
        bookList.push('mage: the ascension 20th anniversary core');
        bookList.push('gods and monsters');
        monsters.push(MonsterTemplates.MAGE);
        break;
      case [MonsterTemplates.CHANGELING, MonsterTemplates.KINAIN].includes(type):
        bookList.push('changeling: the dreaming 20th anniversary core');
        break;
      case type === MonsterTemplates.WRAITH:
        bookList.push('wraith: the oblivion 20th anniversary core');
        break;
      case type === MonsterTemplates.HUNTER:
        bookList.push('hunter: the reckoning 20th anniversary core');
        break;
      case [MonsterTemplates.THRALL, MonsterTemplates.DEMON].includes(type):
        bookList.push('demon: the fallen core');
        monsters.push(MonsterTemplates.DEMON);
        break;
      case type === MonsterTemplates.MUMMY:
        bookList.push('mummy: the resurrection 2nd edition')
        break;
      default:
        break;
    }
    bookIdList = await referenceCache.getBookIds(bookList);
  } else {
    bookIdList = bookIds || [];
  }

  let defaultExclusions = buildHistoricalOrganizationExclusions(type as MonsterTemplates, icYear);
  if (exclude) {
    defaultExclusions = [...defaultExclusions, ...exclude];
  }
  const exclusions = include
    ? reconcileIncludeExclude(include, defaultExclusions)
    : defaultExclusions;



  if (monsters.length === 0) {
    monsters.push(type);
  }

  if (type === MonsterTemplates.SORCERER) {
    monsters.push(MonsterTemplates.MAGE);
  }

  return await getOrganizations(
    monsters,
    {
      ...options,
      bookIds: bookIdList,
      exclude: exclusions
    }
  );
}