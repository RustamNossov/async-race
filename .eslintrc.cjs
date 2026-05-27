module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    // Redux Toolkit uses Immer — direct state mutation is intentional
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    // Allow void as a statement to explicitly discard promise values (fire-and-forget async)
    'no-void': ['error', { allowAsStatement: true }],
  },
};
