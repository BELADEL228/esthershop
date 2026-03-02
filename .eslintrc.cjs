module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // Désactiver la règle des variables non utilisées
    'no-unused-vars': 'off',
    // Ou la configurer plus souplement
    'no-unused-vars': ['warn', { 
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }]
  },
}