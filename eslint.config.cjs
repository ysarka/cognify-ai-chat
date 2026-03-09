const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
    {
        files: ['**/*.{js,mjs,cjs}'],
        ...js.configs.recommended,
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'module',
        },
    },
    prettier,
];
