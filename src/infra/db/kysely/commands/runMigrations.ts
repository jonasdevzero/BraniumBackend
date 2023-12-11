import 'dotenv/config';
import { db } from '../connection';
import { makeMigrator } from '../helpers/makeMigrator';
import { setupDatabase } from '@infra/db/pg/helpers/setupDatabase';

async function migrateToLatest() {
	await setupDatabase();
	const migrator = makeMigrator();

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error('failed to migrate');
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrateToLatest();
