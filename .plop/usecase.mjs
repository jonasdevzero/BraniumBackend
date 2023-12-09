import fs from 'node:fs';
import path from 'node:path';

const nodePopConfig = (plop) => {
	plop.addHelper('generatePath', (name) => {
		const result = name.replace(/ /g, '/').toLowerCase();

		return result;
	});

	plop.setGenerator('usecase', {
		description: 'Base use case with API route',
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
				type: 'list',
				name: 'httpMethod',
				message: 'HTTP method:',
				choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
				default: 'GET',
			},
			{
				type: 'input',
				name: 'httpPath',
				message: 'HTTP route path:',
			},
			{
				type: 'confirm',
				name: 'hasDto',
				message: 'Has DTO?',
			},
			{
				type: 'confirm',
				name: 'hasRepository',
				message: 'Has Repository?',
			},
			{
				when: function (response) {
					return response.hasRepository
				},
				type: 'input',
				name: 'driver',
				message: 'DB driver:',
			},
			{
				type: 'confirm',
				name: 'hasValidator',
				message: 'Has Validator?',
			},
		],
		actions: (data) => {
			const actions = [
				{
					type: 'add',
					path: '../src/domain/use-cases/{{generatePath module}}/{{pascalCase name}}.ts',
					templateFile: 'templates/useCaseInterface.ts.hbs',
					skipIfExists: true,
				},
				{
					type: 'add',
					path: '../src/data/use-cases/{{generatePath module}}/Db{{pascalCase name}}.ts',
					templateFile: 'templates/useCaseImplementation.ts.hbs',
					skipIfExists: true,
				},
				{
					type: 'add',
					path: '../src/presentation/controllers/{{generatePath module}}/{{pascalCase name}}Controller.ts',
					templateFile: 'templates/useCaseController.ts.hbs',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/domain/use-cases/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: "add",
					path: '../src/data/use-cases/{{generatePath module}}/index.ts',
					template: '',
					skipIfExists: true,
				},
				{
					type: 'append',
					path: '../src/domain/use-cases/{{generatePath module}}/index.ts',
					template: 'export * from \'./{{pascalCase name}}\';\n',
				},
				{
					type: 'append',
					path: '../src/data/use-cases/{{generatePath module}}/index.ts',
					template: 'export * from \'./Db{{pascalCase name}}\';\n',
				},
			];

			if (data.hasDto) {
				actions.push(...[
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
				])
			}

			if (data.hasRepository) {
				actions.push(...[
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
				]);
			}

			if (data.hasValidator) {
				actions.push(...[
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
				])
			}

			const modules = data.module.split(' ');
			const root = path.join(process.cwd(), 'src')

			if (modules.length > 1) {
				modules.map((_, index) => {
					if (index === modules.length - 1) return;
			
					const directory = modules.slice(0, index + 1).join('/');
					const nextModule = modules[index + 1];
					const content = `\nexport * from './${nextModule}';`
					
					if(data.hasRepository) {
						const dataProtocols = path.join(root, 'data', 'protocols', 'db', directory, 'index.ts')
						const infraRepository = path.join(root, 'infra', 'db', data.driver, 'repositories', directory, 'index.ts')
						
						createAndAppend(dataProtocols, content);
						createAndAppend(infraRepository, content)
					}
					
					const dataUseCases = path.join(root, 'data', 'use-cases', directory, 'index.ts')
					
					createAndAppend(dataUseCases, content)

					if (data.hasDto) {
						const domainDtos = path.join(root, 'domain', 'dtos', directory, 'index.ts')
						createAndAppend(domainDtos, content)
					}

					const domainUseCase = path.join(root, 'domain', 'use-cases', directory, 'index.ts')
					createAndAppend(domainUseCase, content)
					
					if (data.hasValidator) {
						const presentationValidator = path.join(root, 'presentation', 'validators', directory, 'index.ts')
						createAndAppend(presentationValidator, content)
					}
				});
			} else {				
				const content = `\nexport * from './${data.module}';`

				if(data.hasRepository) {
					const dataProtocols = path.join(root, 'data', 'protocols', 'db', 'index.ts')
					const infraRepository = path.join(root, 'infra', 'db', data.driver, 'repositories', 'index.ts')
					
					createAndAppend(dataProtocols, content);
					createAndAppend(infraRepository, content)
				}

				const dataUseCase = path.join(root, 'data', 'use-cases', 'index.ts')
				createAndAppend(dataUseCase, content)
			}

			return actions;
		},
	});
};

function createAndAppend(location, content) {
	const exists = fs.existsSync(location);

	if (!exists) {
		const folders = location.split('/').slice(0, -1).join('/')
		
		fs.mkdirSync(folders, { recursive: true });
		fs.writeFileSync(location, content, { flush: true });
		return;
	}

	const fileContent = fs.readFileSync(location);

	if (fileContent.indexOf(content) >= 0) return;

	fs.appendFileSync(location, content);
}

export default nodePopConfig;
