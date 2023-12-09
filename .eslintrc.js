module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'xo',
		'eslint:recommended',
		'plugin:prettier/recommended',
		'prettier',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'object-curly-spacing': 'off',
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
