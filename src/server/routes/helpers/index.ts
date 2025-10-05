import { QueryExecutionError, createErrorResponse } from '../../errors';
import { queryDbConnection, referenceCache } from '../../sql';
import { PoolClient } from 'pg';
import { ErrorKeys } from '../../errors/errors.types';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ValidFormat } from '../types';
import { MonsterTemplates } from '../monsters/types';

export function parseQueryParam (param: unknown): string[] {
  if (Array.isArray(param)) {
    return param
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim().toLowerCase());
  }
  if (typeof param === 'string') {
    return param.split(',').map(name => name.trim().toLowerCase());
  }
  return [];
};

export async function getMonsterFromParams (req: AuthenticatedRequest, strict: boolean = false): Promise<string> {
  const { monster } = req.params; 
  if (monster == null || monster.trim() === "") {
    throw createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
  }

  const isNumericId = !isNaN(Number(monster)) && monster.trim() !== '';
  if (!isNumericId) {
    const validMonsters = Object.values(MonsterTemplates);
    if (strict && !validMonsters.includes(monster.toLowerCase() as MonsterTemplates)) {
      const invalidParameterError = createErrorResponse(ErrorKeys.MONSTER_TYPE_NOT_FOUND);
      throw invalidParameterError;
    }
  }
  if (isNumericId) {
    return await referenceCache.getMonsterName(Number(monster));
  }
  return monster.toLowerCase() as MonsterTemplates;
}

export async function prepareBaseOptions (req: AuthenticatedRequest) {
  const { books, year, exclude, include, faction, format } = req.query;
  const bookNames = parseQueryParam(books);
  const bookIds = await referenceCache.getBookIds(bookNames);
  const icYear = year ? parseInt(year as string, 10) : 2025;
  const exclusions = parseQueryParam(exclude);
  const inclusions = parseQueryParam(include);
  const factions = parseQueryParam(faction);
  let factionArg = factions.pop() || "";
  const formatName = format as string || undefined;

  const isFactionNumeric = factionArg && !isNaN(Number(factionArg));

  if (factionArg && isFactionNumeric) {
     factionArg = await referenceCache.getOrganizationName(parseInt(factionArg));
  }

  let fields = "all"
  if (formatName && formatName.toLowerCase() === "names") {
    fields = "names"
  }

  const options = {
    bookIds,
    year: icYear,
    exclude: exclusions,
    include: inclusions,
    faction: factionArg,
    format: fields
  }
  return options;
}

export function createStringArrayPlaceholders(entries: number[] | string[], startingIndex = 1): string {
  return entries.map((_, index) => `$${startingIndex + index}`).join(',');
}

export function reconcileIncludeExclude(
  include: readonly string[] = [],
  exclude: readonly string[] = [],
): string[] {
  const includeSet = new Set(include);
  return [...new Set(exclude)].filter(item => !includeSet.has(item));
}