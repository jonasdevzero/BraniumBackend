const nodePopConfig = (plop) => {
	plop.addHelper('generatePath', (name) => {
		const result = name.replace(/ /g, '/').toLowerCase();

		return result;
	});

	plop.setGenerator('dto', {
		description: 'Base DTO',
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
					path: '../src/domain/dtos/{{generatePath module}}/{{pascalCase name}}DTO.ts',
					templateFile: 'templates/useDTO.ts.hbs',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/domain/dtos/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: 'append',
					path: '../src/domain/dtos/{{generatePath module}}/index.ts',
					template: 'export * from \'./{{pascalCase name}}DTO\';\n',
				},
			];

			return actions;
		},
	});
};

export default nodePopConfig;
