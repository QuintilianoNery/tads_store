/* Configuração ESLint da TADS Store (React + Vite + Storybook). */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  // Não lintar build artifacts, dependências nem a pasta de referência do DS (ui/).
  ignorePatterns: ['dist', 'storybook-static', 'node_modules', 'ui/'],
  rules: {
    // O projeto não usa PropTypes — tipagem é por convenção/JSDoc.
    'react/prop-types': 'off',
    // Aviso de HMR do Vite; não é erro de correção. Mantemos desligado para o build limpo.
    'react-refresh/only-export-components': 'off',
    // Textos pt-BR usam aspas/apóstrofos livremente no JSX.
    'react/no-unescaped-entities': 'off',
  },
}
