module.exports = {
	'env': {
		'commonjs': true,
		'es2021': true,
		'node': true,
		'jest': true,
	},
	'extends': 'eslint:recommended',
	'overrides': [
		{
			'env': {
				'node': true,
			},
			'files': [
				'.eslintrc.{js,cjs}',
			],
			'parserOptions': {
				'sourceType': 'script',
			},
		},
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
	},
	'rules': {
		/* Code style rules */
		'indent': [ 'warn', 'tab', ],
		'space-before-function-paren': ['error', 'never', ],
		// 'keyword-spacing': 'error',
		'space-infix-ops': 'error',
		'linebreak-style': [ 'warn', 'windows', ],
		'quotes': [ 'warn', 'single', ],
		'semi': [ 'error', 'always', ],

		/* Variable and function naming rules. */
		'camelcase': 'error',
		// 'func-names': 'error',

		/* Best practices */
		// 'no-console': 'off',
		'no-unused-vars': 'warn',
		'no-undef': 'error',

		/* ES6 and module rules */
		'prefer-const': 'error',
		'no-var': 'error',
		'arrow-spacing': 'error',
		// 'prefer-arrow-callback': 'error',
		// 'import/export': 'error',

		/* Security */
		'no-eval': 'error',

		/* Consistency and formatting */
		'eqeqeq': 'error',
		// 'comma-dangle': ['error', 'always', ],

		/* Comments and documentation */
		'valid-jsdoc': 'error',
	},
};
