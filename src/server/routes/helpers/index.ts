import { QueryExecutionError, createErrorResponse } from '../../errors';
import { queryDbConnection, referenceCache } from '../../sql';
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

export async function selectBookId(bookName: string): Promise<number> {
  const query = `SELECT id FROM wod_books WHERE lower(name) = $1`;
  const result = await queryDbConnection(query, [bookName])
  if (result.rows[0]) {
    return result.rows[0].id  
  }
  return 0
}

export async function resolveBookIds(bookNames: string[]): Promise<BookIdResult> {
  if (bookNames.length === 0) {
    return {
      bookIds: [],
      foundBooks: [],
      missingBooks: []
    };
  }

  const bookIds: number[] = [];
  const foundBooks: string[] = [];
  const missingBooks: string[] = [];

  for (const bookName of bookNames) {
    try {
      const bookId = await referenceCache.getBookId(bookName);
      bookIds.push(bookId);
      foundBooks.push(bookName);
    } catch (error) {
      missingBooks.push(bookName);
    }
  }

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