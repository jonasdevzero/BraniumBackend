import { Client } from 'pg';
import { ENV } from '@main/config/env';

export async function setupDatabase() {
	const isProduction = ENV.NODE_ENV === 'production';

	if (isProduction) return console.log('skipping database creation');

	const connectionString = ENV.DATABASE_URL;

	const dbName = getDatabaseName(connectionString);

	const client = new Client({
		connectionString: useDefaultConnection(connectionString),
	});

	try {
		await client.connect();

		const res = await client.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`,
		);

		if (res.rowCount !== 0) return;

		await client.query(`CREATE DATABASE "${dbName}";`);
		console.log(`database '${dbName}' created.`);
	} catch (error) {
		console.error(error);
	} finally {
		client.end();
	}
}

function useDefaultConnection(connectionString: string) {
	const [security, local] = connectionString.split('@');
	const [host, db] = local.split('/');
	const [_, queryString] = db.split('?');

	return `${security}@${host}/postgres?${queryString || ''}`;
}

function getDatabaseName(connectionString: string) {
	const matches = /:\/\/(.+):(.+)@(.+):(.+)\/(.+)/g.exec(connectionString);
	if (!matches || !matches[5]) return null;

	const [name] = matches[5].split('?');

	return name;
}
