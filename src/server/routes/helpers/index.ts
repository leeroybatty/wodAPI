import { QueryExecutionError, createErrorResponse } from '../../errors';
import { queryDbConnection, referenceCache } from '../../sql';
import { PoolClient } from 'pg';
import { ErrorKeys } from '../../errors/errors.types';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ValidFormat } from '../types';

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
  console.log(`Handler:`)
  console.log(options)
  return options;
}

export function createStringArrayPlaceholders(entries: number[] | string[], startingIndex = 1): string {
  return entries.map((_, index) => `$${startingIndex + index}`).join(',');
}

export function reconcileIncludeExclude(include: string[], exclude: string[]): string[] {
  const includeSet = new Set(include);
  const excludeSet = new Set(exclude);
  const excludeArray = Array.from(excludeSet)
  for (const item of excludeArray) {
    if (includeSet.has(item)) {
      excludeSet.delete(item);
    }
  }
  return Array.from(excludeSet);
}
