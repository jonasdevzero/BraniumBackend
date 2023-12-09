import { container } from '@container';
import { Middlewares } from '@container/injectables';
import { Controller, Middleware } from '../protocols';

type Class<T> = { new (...args: any[]): T };

export const kControllerMiddlewares = Symbol('controller.middlewares');

export function middlewares(
	...middlewares: Array<Middlewares | Class<Middleware>>
) {
	const middlewareInstances = middlewares.map((key) => {
		const instance =
			typeof key === 'string'
				? container.get<Middleware>(key)
				: container.resolve(key);

		if (!instance) {
			throw new Error(`Middleware not found: ${key}`);
		}

		return instance;
	});

	return function decorator<T extends Class<Controller>>(
		constructor: T,
	): T | void {
		(constructor as any)[kControllerMiddlewares] = middlewareInstances;
		return constructor;
	};
}
