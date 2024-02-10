module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['dist'],
  plugins: [
    '@stylistic/js'
  ],
  extends: 'eslint:recommended',
  rules: {
    eqeqeq: 'error',
    'no-console': 0,
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
  }
};
