import * as repositories from '@infra/db/postgres/repositories';
import { Split } from '../types/split';

type Splitted = Split<keyof typeof repositories, 'Postgres'>;
type RepositoryName = `${Splitted[0]}${Splitted[1]}`;

const mapped = {} as Record<RepositoryName, unknown>;

for (const [key, instance] of Object.entries(repositories)) {
	const [prefix, suffix] = key.split('Postgres');
	const mappedKey = `${prefix}${suffix}` as RepositoryName;

	mapped[mappedKey] = instance;
}

export default mapped;
