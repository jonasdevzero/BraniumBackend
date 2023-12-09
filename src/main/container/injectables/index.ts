import * as middlewares from '@presentation/middlewares';
import useCases from './use-cases';
import repositories from './repositories';
import * as mail from '@infra/mail';
import * as authentication from '@infra/authentication';
import * as storage from '@infra/storage';

// follow a specific order
const injectables = {
	...authentication,
	...storage,
	...mail,
	...repositories,
};

export type Middlewares = keyof typeof middlewares;
export type Injectable = keyof typeof injectables;
export type UseCase = keyof typeof useCases;

export default { ...injectables, ...middlewares, ...useCases };
