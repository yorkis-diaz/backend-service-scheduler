module.exports = {
    env: {
        jest: true,
        node: true,
    },
    ignorePatterns: ['.eslintrc.js', '.js', 'resources', 'dist', 'coverage'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    overrides: [
        {
            files: ["**/test/**"],
            env: {
                "jest": true
            },
            rules: {
                '@typescript-eslint/no-unsafe-assignment': ['warn']
            }
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-unsafe-assignment': ['warn']
    },
};
