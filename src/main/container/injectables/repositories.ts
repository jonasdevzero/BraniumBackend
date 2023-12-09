import * as repositories from '@infra/db/kysely/repositories';
import { Split } from '../types/split';

type Splitted = Split<keyof typeof repositories, 'Kysely'>;
type RepositoryName = `${Splitted[0]}${Splitted[1]}`;

const mapped = {} as Record<RepositoryName, unknown>;

for (const [key, instance] of Object.entries(repositories)) {
	const [prefix, suffix] = key.split('Kysely');
	const mappedKey = `${prefix}${suffix}` as RepositoryName;

	mapped[mappedKey] = instance;
}

export default mapped;
