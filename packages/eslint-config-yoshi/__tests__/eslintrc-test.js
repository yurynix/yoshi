module.exports = {
  extends: require.resolve('../index'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  ],
};
