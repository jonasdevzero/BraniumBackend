import express from 'express';
import { Router } from 'express';
import path from 'node:path';
import { Constructor, container } from '@container';
import { Controller } from '@presentation/protocols';
import { RouteOptions, kControllerRoute } from '@presentation/decorators/route';
import { routeModules } from './modules';
import { adaptRoute } from '../adapters/adaptRoute';
import { ENV } from '../config/env';
import { sortControllers } from '../helpers';
import { FilesFinder } from '@main/utils';

export const router = Router();

const sourceFolder = ENV.NODE_ENV === 'production' ? 'dist' : 'src';

const modulesDir = path.join(
	process.cwd(),
	sourceFolder,
	'presentation',
	'controllers',
);
const controllerPaths = new FilesFinder().find(
	modulesDir,
	/[a-zA-Z]+Controller\.(ts|js)/,
);

const controllers: Array<Constructor<Controller>> = controllerPaths
	.map(require)
	.reduce((group, object) => ({ ...group, ...object }), {});

const sortedControllers = Object.values(controllers).sort(sortControllers);

for (const controller of Object.values(sortedControllers)) {
	const instance = container.resolve(controller);
	const routeOptions: RouteOptions = (controller as any)[kControllerRoute];

	if (!routeOptions) continue;

	const { method, module, path } = routeOptions;

	const groupPath = routeModules[module];
	const fullPath = groupPath + path;

	router[method](fullPath, adaptRoute(instance));
}

router.use(
	'/uploads',
	express.static(path.join(process.cwd(), 'temp', 'uploads')),
);
