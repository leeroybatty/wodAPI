import { QueryExecutionError } from '../../errors';
import { queryDbConnection } from '../../sql';
import { PoolClient } from 'pg';
import { ErrorKeys } from '../../errors/errors.types';

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

export interface BookIdResult {
  bookIds: number[];
  foundBooks: string[];
  missingBooks: string[];
}

export enum Monster {
  VAMPIRE = 'vampire',
  GHOUL = 'ghoul',
  REVENANT = 'revenant',
  WEREWOLF = 'werewolf',
  MAGE = 'mage',
  CHANGELING = 'changeling',
  WRAITH = 'wraith',
  HUNTER = 'hunter',
  DEMON = 'demon',
  MUMMY = 'mummy'
}

export const validMonsters = new Set(Object.values(Monster));
export type MonsterType = Monster;

export const bookFallbacks = {
  'vampire': ['vampire: the masquerade 20th anniversary core'],
  'werewolf': ['werewolf: the apocalypse 20th anniversary core'],
  'mage': ['mage: the ascension 20th anniversary core'],
  'changeling': ['changeling: the dreaming 20th anniversary core'],
  'wraith': ['wraith: the oblivion 20th anniversary core'],
  'hunter': ['hunter: the reckoning 2nd edition'],
  'demon': ['demon: the fallen'],
  'mummy': ['mummy: the resurrection']
}

export async function resolveBookIds(
  bookNames?: string[],
  client?: PoolClient
): Promise<BookIdResult> {

  if (!bookNames || bookNames?.length === 0) {
    return {
      bookIds: [],
      foundBooks: [],
      missingBooks: []
    };
  }

  let bookList = bookNames.length > 0
    ? bookNames
    : []

  const placeholders = bookList.map((_, index) => `$${index + 1}`).join(',');
  const query = `SELECT id, name FROM wod_books WHERE lower(name) IN (${placeholders})`;
  
  const result = await queryDbConnection(query, bookList, client);
  
  const foundBooks = result.rows.map(row => row.name);
  const bookIds = result.rows.map(row => parseInt(row.id));
  const missingBooks = bookList.filter(name => !foundBooks.includes(name));
  
  return {
    bookIds,
    foundBooks,
    missingBooks
  };
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