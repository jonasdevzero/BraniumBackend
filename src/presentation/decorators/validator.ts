import { ZodError } from 'zod';
import { makeZodError } from '../helpers/makeZodError';
import { HttpRequest, Middleware } from '../protocols';

type ConstructorClass<T = Middleware> = { new (...args: any[]): T };

export function validator<T extends ConstructorClass>(
	constructor: T,
): T | void {
	return class extends constructor {
		constructor(...args: any[]) {
			super(...args);
		}

		async handle(httpRequest: HttpRequest): Promise<void> {
			try {
				await super.handle(httpRequest);
			} catch (error) {
				throw makeZodError(error as ZodError);
			}
		}
	};
}
