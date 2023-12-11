import { Kysely, sql } from 'kysely';
import { Database } from '../types/Database';

export async function up(db: Kysely<Database>): Promise<void> {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);

	await db.schema
		.createTable('user')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
		)
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('email', 'text', (col) => col.notNull().unique())
		.addColumn('username', 'text', (col) => col.notNull().unique())
		.addColumn('password', 'text')

		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('deletedAt', 'timestamp')
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable('user').ifExists().execute();

	await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`.execute(db);
}
