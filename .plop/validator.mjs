const nodePopConfig = (plop) => {
	plop.addHelper('generatePath', (name) => {
		const result = name.replace(/ /g, '/').toLowerCase();

		return result;
	});

	plop.setGenerator('validator', {
		description: 'Base Validator',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Name:',
			},
			{
				type: 'input',
				name: 'module',
				message: 'Module:',
			},
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: '../src/presentation/validators/{{generatePath module}}/{{pascalCase name}}Validator.ts',
					templateFile: 'templates/useValidator.ts.hbs',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/presentation/validators/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: 'append',
					path: '../src/presentation/validators/{{generatePath module}}/index.ts',
					template: 'export * from \'./{{pascalCase name}}Validator\';\n',
				},
			];

			return actions;
		},
	});
};

export default nodePopConfig;
