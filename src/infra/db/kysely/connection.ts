import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './types/Database';
import { pool } from '../pg/connection';

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({ pool }),
});
