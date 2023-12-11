import { promises as fs } from 'fs';
import { FileMigrationProvider, Migrator } from 'kysely';
import * as path from 'path';
import { db } from '../connection';

export function makeMigrator() {
	const migrationFolder = path.join(
		process.cwd(),
		'src',
		'infra',
		'db',
		'kysely',
		'migrations',
	);

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder,
		}),
	});

	return migrator;
}
