import { ENV } from '@main/config/env';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { Database } from './types/Database';

const { Pool } = pg;

const connectionString = ENV.DATABASE_URL;
export const pool = new Pool({ connectionString });

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({ pool }),
});
