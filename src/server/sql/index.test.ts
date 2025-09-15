import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool, PoolClient } from 'pg';
import { requireEnvVar } from '../services/logger/envcheck';
import { getTable } from './queryFunctions';
const user = requireEnvVar('PG_USERNAME');
const database = requireEnvVar('PG_DATABASE'); 
const password = requireEnvVar('PG_PASSWORD');

export class TestDatabase {
  private container: PostgreSqlContainer | undefined;
  public pool: Pool | undefined;

  async start() {
    if (this.container) {
      throw new Error('TestDatabase already started');
    }

    this.container = await new PostgreSqlContainer('postgres:15')
      .withDatabase(database)
      .withUsername(user)
      .withPassword(password)
      .start();

    this.pool = new Pool({
      host: this.container.getHost(),
      port: this.container.getFirstMappedPort(),
      database,
      user,
      password
    });

    await this.setupUnitTestingSchema();
  }

  async setupUnitTestingSchema() {
    /*
    If there are tests that just check that 'get table' and 'edit table' 
    and 'change associations' functions work, the schema doesn't matter
    so let's not try to recreate a schema we don't need right now.
    */
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE test_main (
          id SERIAL PRIMARY KEY,
          field1 VARCHAR(50),
          field2 INTEGER
        );
      `);

      await client.query(
      'INSERT INTO test_main (field1, field2) VALUES ($1, $2)',
        ['test', 100]
      );

      await client.query(`
        CREATE TABLE test_associations (
          main_id INTEGER REFERENCES test_main(id),
          related_id INTEGER
        );
      `);
      
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('TestDatabase not started');
    }
    return await this.pool.connect();
  }

  async cleanup() {
    await this.pool.end();
    await this.container.stop();
  }

  async clearTables() {
    const client = await this.getClient();
    try {
      await client.query('TRUNCATE test_main, test_associations RESTART IDENTITY CASCADE');
    } finally {
      client.release();
    }
  }

  async withClient<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      return await callback(client);
    } finally {
      client.release();
    }
  }
}

describe ('Query Helper Functions', () => {
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.start;
  })

  afterAll(async () => {
    await testDb.cleanup();
  })

  it('Returns correct data when record exists', async () => {
    await testDb.withClient(async (client) => {
      const getResult = await getTable(
        'test_main',
        'field1',
        'test',
        ['field1'],
        client
      );

      const firstRow = getResult.rows[0];
      expect(firstRow['field1']).toBe('test');
    })
  });

  xit('Returns empty result when record does not exist', () => {});
  xit('Handles different column selections', () => {});
  xit('Throws QueryExecutionError with correct error details when table does not exist', () => {});

})