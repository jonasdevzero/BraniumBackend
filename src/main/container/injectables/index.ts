import * as middlewares from '@presentation/middlewares';
import useCases from './use-cases';
import repositories from './repositories';
import * as storage from '@infra/storage';

// follow a specific order
const injectables = {
	...storage,
	...repositories,
};

export type Middlewares = keyof typeof middlewares;
export type Injectable = keyof typeof injectables;
export type UseCase = keyof typeof useCases;

export default { ...injectables, ...middlewares, ...useCases };
