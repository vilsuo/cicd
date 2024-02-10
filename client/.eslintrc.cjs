module.exports = {
  root: true,
  env: { browser: true, es2020: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@stylistic/js'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@stylistic/js/object-curly-spacing': ['error', 'always'],
    '@stylistic/js/quote-props': [
      'error', 'as-needed',
    ],
    '@stylistic/js/eol-last': ['error', 'always'],
    '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],
    '@stylistic/js/indent': [
      'error',
      2
    ],
    '@stylistic/js/quotes': [
      'error',
      'single'
    ],
    '@stylistic/js/semi': [
      'error',
      'always'
    ],
  },
};
