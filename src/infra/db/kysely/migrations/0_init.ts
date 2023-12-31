import { Kysely, sql } from 'kysely';
import { Database } from '../types/Database';

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema
		.createTable('profile')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('username', 'text', (col) => col.notNull().unique())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable('profile').ifExists().execute();
}
