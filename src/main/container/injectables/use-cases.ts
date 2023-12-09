import * as useCases from '@data/use-cases';
import { Split } from '../types/split';

type UseCaseName = Split<keyof typeof useCases, 'Db'>[1];

const mapped = {} as Record<UseCaseName, unknown>;

for (const [key, instance] of Object.entries(useCases)) {
	const mappedKey = key.split('Db')[1] as UseCaseName;
	mapped[mappedKey] = instance;
}

export default mapped;
