import 'dotenv/config';
import { db } from '../connection';
import { makeMigrator } from '../helpers/makeMigrator';

async function migrateDown() {
	const migrator = makeMigrator();

	const { error, results } = await migrator.migrateDown();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was downed successfully`);
		} else if (it.status === 'Error') {
			console.error(`failed to down migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error('failed to migration down');
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrateDown();
