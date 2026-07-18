module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-require-imports': 'off',
    'react/display-name': 'off',
  },
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'babel.config.js'],
};
