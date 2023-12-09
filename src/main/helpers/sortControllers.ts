import { RouteOptions, kControllerRoute } from '@presentation/decorators';
import { Controller } from '@presentation/protocols';
import { Constructor } from '@container';
import { routeModules } from '../routes/modules';

type HttpController = Constructor<Controller>;

export function sortControllers(controllerA: HttpController) {
	const routeA = controllerParams(controllerA);

	if (!routeA) return -1;

	return routeA;
}

const controllerParams = (controller: HttpController) => {
	const route: RouteOptions = (controller as any)[kControllerRoute];

	const groupPath = routeModules[route.module];
	const fullPath = groupPath + route.path;
	const indexes = [];

	for (let index = 0; index < fullPath.length; index++) {
		if (fullPath[index] === ':') indexes.push(index);
	}

	const count = indexes.reduce((acc, crr) => acc + crr, 0);

	return count;
};
