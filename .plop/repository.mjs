const nodePopConfig = (plop) => {
	plop.addHelper('generatePath', (name) => {
		const result = name.replace(/ /g, '/').toLowerCase();

		return result;
	});

	plop.setGenerator('repository', {
		description: 'Base repository',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Name:',
			},
			{
				type: 'input',
				name: 'methodName',
				message: 'Method name:',
			},
			{
				type: 'input',
				name: 'module',
				message: 'Module:',
			},
			{
				type: 'input',
				name: 'driver',
				message: 'DB driver:',
			},
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: '../src/data/protocols/db/{{generatePath module}}/{{pascalCase name}}Repository.ts',
					templateFile: 'templates/useRepository.ts.hbs',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/data/protocols/db/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: 'append',
					path: '../src/data/protocols/db/{{generatePath module}}/index.ts',
					template: 'export * from \'./{{pascalCase name}}Repository\';\n',
				},
				{
					type: 'add',
					path: '../src/infra/db/{{kebabCase driver}}/repositories/{{generatePath module}}/{{pascalCase name}}{{pascalCase driver}}Repository.ts',
					templateFile: 'templates/useDriverRepository.ts.hbs',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/infra/db/{{kebabCase driver}}/repositories/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: 'append',
					path: '../src/infra/db/{{kebabCase driver}}/repositories/{{generatePath module}}/index.ts',
					template: 'export * from \'./{{pascalCase name}}{{pascalCase driver}}Repository\';\n',
				},
			];

			return actions;
		},
	});
};

export default nodePopConfig;
