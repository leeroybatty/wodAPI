import { referenceCache } from './index';

export interface FilterResult {
  condition: string;
  variables: any[];
}

const createStringArrayPlaceholders = (entries: number[] | string[], startingIndex = 1): string => {
  return entries.map((_, index) => `$${startingIndex + index}`).join(',');
}

/**
 * Builds a monster accessibility filter using the monster hierarchy
 * @param monster - Monster name to filter by
 * @param variables - Current query variables array
 * @param tableAlias - Table alias to use (default: 's' for stats)
 * @returns Filter condition and updated variables
 */
export async function buildMonsterFilter(
  monster: string | number | undefined,
  variables: any[],
  tableAlias: string = 'bms'
): Promise<FilterResult> {
  if (!monster) {
    return {
      condition: `${tableAlias}.monster_id IS NULL`,
      variables
    };
  }

  let monsterName: string;
  
  if (typeof monster === 'number' || !isNaN(Number(monster))) {
    monsterName = await referenceCache.getMonsterName(Number(monster));
  } else {
    monsterName = monster;
  }
  
  const monsterIdList = await referenceCache.getMonsterChain(monsterName);
  const monsterPlaceholders = createStringArrayPlaceholders(monsterIdList, variables.length + 1);
  
  return {
    condition: `(${tableAlias}.monster_id IS NULL OR ${tableAlias}.monster_id IN (${monsterPlaceholders}))`,
    variables: [...variables, ...monsterIdList]
  };
}

/**
 * Builds a book filter that checks if a stat belongs to specified books
 * @param bookIds - Array of book IDs to filter by
 * @param variables - Current query variables array
 * @param tableAlias - Table alias to use (default: 's')
 * @returns Filter condition and updated variables
 */
 export function buildBookFilter(
  bookIds: number[] | undefined,
  variables: any[],
  tableAlias: string = 's'
): { condition: string; variables: any[] } {
  if (!bookIds || bookIds.length === 0) {
    return { condition: '', variables };
  } 
  const placeholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
  return {
    condition: `(${tableAlias}.book_id IS NULL OR ${tableAlias}.book_id IN (${placeholders}))`,
    variables: [...variables, ...bookIds]
  };
}

/**
 * Builds a filter for include/exclude on named items
 * @param names - Array of names to include or exclude
 * @param variables - Current query variables array
 * @param mode - Whether to include or exclude the names
 * @param tableAlias - Table alias to use (default: 's')
 * @returns Filter condition and updated variables
 */
export function buildExceptionFilter(
  names: string[] | undefined,
  variables: any[],
  mode: 'include' | 'exclude',
  tableAlias: string = 's'
): { condition: string; variables: any[] } {
  if (!names || names.length === 0) {
    return { condition: '', variables };
  }
  
  const placeholders = createStringArrayPlaceholders(names, variables.length + 1);
  const operator = mode === 'include' ? 'IN' : 'NOT IN';
  
  return {
    condition: `LOWER(${tableAlias}.name) ${operator} (${placeholders})`,
    variables: [...variables, ...names]
  };
}

/**
 * Builds a faction/organization filter
 * @param faction - Faction name to filter by
 * @param variables - Current query variables array
 * @param tableAlias - Table alias to use (default: 's')
 * @returns Filter condition and updated variables
*/
export async function buildFactionFilter(
  faction: string | number | undefined,
  variables: any[],
  tableAlias: string = 's'
): Promise<{ condition: string; variables: any[] }> {
  
  if (!faction) {
    return {
      condition: `${tableAlias}.org_lock_id IS NULL`,
      variables
    };
  }

  let orgId: number;
  
  if (typeof faction == 'string' && isNaN(Number(faction))) {
    orgId = await referenceCache.getOrganizationId(faction);
  } else {
    orgId = Number(faction);
  }

  return {
    condition: `(${tableAlias}.org_lock_id IS NULL OR ${tableAlias}.org_lock_id = $${variables.length + 1})`,
    variables: [...variables, orgId]
  };
}

export const optionalCondition = (condition?: string) => condition || 'TRUE';

export function buildColumns(
  format: string = 'all',
  tableAlias: string = 's',
  additionalColumns: string = ''
): string {
  if (format === "names") {
    return `DISTINCT ${tableAlias}.id, ${tableAlias}.name`;
  }
  
  return `DISTINCT ON (${tableAlias}.id) ${tableAlias}.id,
    LOWER(${tableAlias}.name) as name,
    ${tableAlias}.name as display, 
    ${tableAlias}.description,
    ${additionalColumns ? `${additionalColumns},`: ''}
    CASE 
      WHEN ${tableAlias}.book_id IS NOT NULL THEN 
        json_build_object(
          'book_id', ${tableAlias}.book_id,
          'book_name', b.name,
          'page_number', ${tableAlias}.page_number
        )
      ELSE NULL
    END as reference`;
}