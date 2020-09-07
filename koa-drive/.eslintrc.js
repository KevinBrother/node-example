module.exports = {
    'env': {
        'node': true
    },
    'parser': '@typescript-eslint/parser',
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    'globals': {},
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'ecmaFeatures': {
            'modules': true
        },
        'project': './tsconfig.json'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'eqeqeq': ['warn', 'always'],
        'prefer-const': ['error', {'destructuring': 'all', 'ignoreReadBeforeAssign': true}],
        'semi': 'off',
        'eol-last': ['error'],
        'quotes': 'off',
        'no-extra-semi': 'off',
        'no-prototype-builtins': 'off',
        'no-trailing-spaces': 'error',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/quotes': ['warn', 'single'],
        '@typescript-eslint/no-extra-semi': ['off'],
        '@typescript-eslint/indent': ['error', 4, { VariableDeclarator: 4, SwitchCase: 1 }],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/interface-name-prefix': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-triple-slash-reference': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/triple-slash-reference': ['error', { 'path': 'always', 'types': 'never', 'lib': 'never' }],
    }
};