import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import PoolConnection from './connection';
import { QueryExecutionError, ValidationError } from '../errors';
import { ErrorKeys } from '../errors/errors.types';
import { logger } from '../services/logger';

export type QueryFunction = (client: PoolClient) => Promise<QueryResult>;

export type GenericStringMap = {
  [key:string]: string | string[] | number[] | number | Date | boolean | null;
};

const handleUnknownError = function (): never {
  const unknownError = new Error('Unknown error.')
  logger.error('Unknown error when querying database', unknownError)
  throw unknownError;
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  console.log("With Transaction is running.")
  const pool = PoolConnection.get();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof Error) {
      logger.error('Transaction failed', { error });
      throw error;
    } else {
      return handleUnknownError()
    }
  } finally {
    client.release();
  }
}

export async function queryDbConnection(
  queryString: string, 
  values: any[] = [],
  client?: PoolClient
): Promise<QueryResult> {

  if (client) {
    try {
      return await client.query(queryString, values);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Query failed', { query: queryString, error });
        throw new QueryExecutionError(
          'Failed to execute database query',
          queryString,
          values,
          ErrorKeys.GENERAL_SERVER_ERROR 
        );
      } else {
        return handleUnknownError();
      }
    }
  } else {
    const pool = PoolConnection.get();
    const newClient = await pool.connect();
    try {
      return await newClient.query(queryString, values);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Query failed', { query: queryString, error });
        throw new QueryExecutionError(
          'Failed to execute database query',
          queryString,
          values,
          ErrorKeys.GENERAL_SERVER_ERROR 
        );
      } else {
        return handleUnknownError();
      }
    } finally {
      newClient.release();
    }
  }
}


export async function executeTransaction(operations: Function[]): Promise<any[]> {
  const pool = PoolConnection.get();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const results: any[] = [];
    for (const operation of operations) {
      const result = await operation(client, results);
      results.push(result);
    }
    await client.query('COMMIT');
    return results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      await client.query('ROLLBACK');
      logger.error("Transaction failed:", error);
      throw new QueryExecutionError(
        'Transaction failed: ' + error.message,
        'Multiple queries',
        [],
        ErrorKeys.GENERAL_SERVER_ERROR
      );
    } else {
      logger.error("Transaction failed with unknown error type:", error);
      throw new QueryExecutionError(
        'Transaction failed with unknown error',
        'Multiple queries',
        [],
        ErrorKeys.GENERAL_SERVER_ERROR
      );
    }
  } finally {
    client.release();
  }
}

export function writeUpdateString(columnsToUpdate: string[]): string {
  const setClauses = [];
  for (let i = 0; i < columnsToUpdate.length; i+= 1) {
    const column = columnsToUpdate[i]
    setClauses.push(`${column} = $${i + 1}`);
  }
  if (setClauses.length === 0) {
    throw new ValidationError('No update fields provided', '', [], ErrorKeys.VALIDATION_ERROR);
  }
  return setClauses.join(", ");
};

/**
 * Builds a string representation of one-to-many relationships suitable for SQL insertion.
 * 
 * @param one - The 'one' side of the relationship.
 * @param many - An array representing the 'many' side of the relationship.
 * @returns A string in the format `(one, many[0]), (one, many[1]), ...`
 */
export function buildOneToManyRowValues(one: number, many: number[]): string {
  return many.map(m => `(${one}, ${m})`).join(', ');
}

export async function getTable(
  table: string,
  identifierColumn: string,
  identifierValue: string | number,
  columns: string[],
  client?: PoolClient
  ): Promise<QueryResult> {

  const columnsToSelect = columns.join(", "); 
  const query = `
    SELECT ${columnsToSelect}
    FROM ${table}
    WHERE ${identifierColumn} = $1
  `;
  const values = [identifierValue];
  try {
    return await queryDbConnection(query, values, client);
  } catch (err) {
    throw new QueryExecutionError(
      `Error fetching data from table: ${table}`,
      query,
      values,
      ErrorKeys.RESOURCE_NOT_FOUND 
    );
  }
};

export async function editTable(
  table: string,
  identifierColumn: string,
  identifierValue: string | number,
  update: GenericStringMap,
  client?: PoolClient
): Promise<QueryResult | null> {
  const columnOrder = Object.keys(update);
  const updateString = writeUpdateString(columnOrder);
  const values = [...columnOrder.map(key => update[key]), identifierValue];
  const idPlaceholder = columnOrder.length + 1;

  const allowedTables = [
  'characters',
  'stats',
  'bridge_characters_stats'
  ];
  
  if (!allowedTables.includes(table)) {
     throw new ValidationError('Invalid table name', '', [], ErrorKeys.VALIDATION_ERROR);
  }
  
  const query = `
  UPDATE ${table}
  SET ${updateString}
  WHERE ${identifierColumn} = $${idPlaceholder}
  `;
  
  try {
  return await queryDbConnection(query, values, client);
  } catch (error: any) {
    throw new QueryExecutionError(
      `Failed to update table: ${table}`,
      query,
      values,
      ErrorKeys.GENERAL_SERVER_ERROR
    );
  }
}

export function getOneRowResult<T extends QueryResultRow>(result: QueryResult<T>): T | null {
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function removeOneToManyAssociations(
  table: string,
  oneColumn: string,
  oneID: number,
  manyColumn?: string,
  manyIDs?: number[],
  client?: PoolClient
): Promise<QueryResult[]> {
  
  //  when manyColumn or manyIDs are optional because if not provided, all associations are deleted.
  if (!manyColumn || !manyIDs || manyIDs.length === 0) {
    const query = `DELETE FROM ${table} WHERE ${oneColumn} = $1`;
    const values = [oneID];

    try {
      return [await queryDbConnection(query, values, client)];
    } catch (err) {
      throw new QueryExecutionError(
        `Failed to delete all associations in table ${table}`,
        query,
        values,
        ErrorKeys.GENERAL_SERVER_ERROR
      );
    }
  }

  const deletePromises: Promise<QueryResult>[] = [];

  manyIDs.forEach(manyID => {
    const query = `
      DELETE FROM ${table} WHERE ${oneColumn} = $1 AND ${manyColumn} = $2
    `;
    const values = [oneID, manyID];

    deletePromises.push(
      queryDbConnection(query, values, client).catch((err) => {
        throw new QueryExecutionError(
          `Failed to delete association in table: ${table}, ${oneColumn} = ${oneID}, ${manyColumn} = ${manyID}`,
          query,
          values,
          ErrorKeys.GENERAL_SERVER_ERROR
        );
      })
    );
  });

  try {
    return await Promise.all(deletePromises);
  } catch (err) {
    // Catch any errors from Promise.all (in case multiple deletions fail)
    logger.error(`Failed to delete multiple associations in table: ${table}`, err);
    throw new QueryExecutionError(
      `Failed to delete multiple associations in table ${table}`,
      `DELETE FROM ${table}`,
      [oneID, manyIDs],
      ErrorKeys.GENERAL_SERVER_ERROR
    );
  }
}

class ReferenceDataCache {
  private monsters: Map<string, number> | null = null;
  private monsterParents: Map<number, number> | null = null; // child_id -> parent_id
  private monsterIds: Map<number, string> | null = null;
  private organizations: Map<string, number> | null = null;
  private organizationIds: Map<number, string> | null = null;
  private books: Map<string, number> | null = null;

  async getMonsterChain(name: string): Promise<number[]> {
    await this.loadMonsters();
    
    const startId = this.monsters!.get(name.toLowerCase());
    if (!startId) throw new QueryExecutionError('Monster not found', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    
    const chain: number[] = [];
    let currentId: number | undefined = startId;
    
    while (currentId !== undefined) {
      chain.push(currentId);
      currentId = this.monsterParents!.get(currentId);
    }
    
    return chain;
  }

  private async loadMonsters() {
    if (!this.monsters || !this.monsterParents) {
      const result = await queryDbConnection('SELECT id, name, parent_id FROM monsters');
      this.monsters = new Map(
        result.rows.map(row => [row.name.toLowerCase(), row.id])
      );
      this.monsterParents = new Map(
        result.rows
          .filter(row => row.parent_id) // Only include rows that have a parent
          .map(row => [row.id, row.parent_id])
      );
      this.monsterIds = new Map(
        result.rows.map(row => [row.id, row.name.toLowerCase()])
      );
    }
  }

  async getMonsterId(name: string): Promise<number> {
    await this.loadMonsters();
    const id = this.monsters!.get(name.toLowerCase());
    if (!id) throw new QueryExecutionError('Monster not found', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    return id;
  }

  async getMonsterName(id: number): Promise<string> {
    await this.loadMonsters();
    const name = this.monsterIds!.get(id)
    if (!name) throw new QueryExecutionError('Monster not found by ID', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    return name;
  }

  async loadOrganizations() {
    if (!this.organizations) {
      const result = await queryDbConnection('SELECT id, name FROM organizations');
      this.organizations = new Map(
        result.rows.map(row => [row.name.toLowerCase(), row.id])
      );
      this.organizationIds = new Map(
        result.rows.map(row => [row.id, row.name.toLowerCase()])
      )
    }
  }

  async getOrganizationId(name: string): Promise<number> {
    await this.loadOrganizations(); 
    const id = this.organizations!.get(name.toLowerCase());
    if (!id) throw new QueryExecutionError('Organization not found', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    return id;
  }

  async getOrganizationName(id: number): Promise<string> {
    await this.loadOrganizations();
    const name = this.organizationIds!.get(id);
    if (!name) throw new QueryExecutionError('Organization not found', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    return name;
  }

  private async loadBooks() {
    if (!this.books) {
      const result = await queryDbConnection('SELECT id, name FROM wod_books');
      this.books = new Map(
        result.rows.map(row => [row.name.toLowerCase(), row.id])
      );
    }
  }

  async getBookId(name: string): Promise<number> {
    await this.loadBooks();
    const id = this.books!.get(name.toLowerCase());
    if (!id) throw new QueryExecutionError('Book not found', '', [], ErrorKeys.RESOURCE_NOT_FOUND);
    return id;
  }

  async getBookIds(names: string[]): Promise<number[]> {
    await this.loadBooks();
    let bookIds = []
    for (let name of names) {
      const id = this.books!.get(name.toLowerCase());
      if (!!id) {  // Deliberately failing gracefully if book not found.
        bookIds.push(id)
      }
    }
    return bookIds
  }
}

export const referenceCache = new ReferenceDataCache();