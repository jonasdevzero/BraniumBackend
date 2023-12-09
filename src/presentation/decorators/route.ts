import { routeModules } from '@main/routes/modules';
import { Controller, HttpMethod } from '../protocols';

type Class<T> = { new (...args: any[]): T };
type RouteModule = keyof typeof routeModules;

export interface RouteOptions {
	method: HttpMethod;
	module: RouteModule;
	path: string;
}

export const kControllerRoute = Symbol('controller.route');

export function route(method: HttpMethod, module: RouteModule, path: string) {
	const options: RouteOptions = {
		method,
		module,
		path,
	};

	return function decorator<T extends Class<Controller>>(
		constructor: T,
	): T | void {
		(constructor as any)[kControllerRoute] = options;
		return constructor;
	};
}

route.get = function (module: RouteModule, path: string) {
	return route('get', module, path);
};

route.post = function (module: RouteModule, path: string) {
	return route('post', module, path);
};

route.put = function (module: RouteModule, path: string) {
	return route('put', module, path);
};

route.patch = function (module: RouteModule, path: string) {
	return route('patch', module, path);
};

route.delete = function (module: RouteModule, path: string) {
	return route('delete', module, path);
};
