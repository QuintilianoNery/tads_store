import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

// Versão exibida no rodapé. Vem da tag mais recente do Git (release da main).
// Ordem de resolução:
//   1) Variável de ambiente:
//        - APP_VERSION             → override manual (qualquer ambiente)
//        - VERCEL_GIT_COMMIT_REF   → injetado pela Vercel (tag/branch do deploy)
//        - GITHUB_REF_NAME         → injetado pelo GitHub Actions (tag/branch)
//   2) Tag mais recente alcançável via `git describe`
//   3) Fallback para a "version" do package.json
function resolveAppVersion() {
  const fromEnv =
    process.env.APP_VERSION ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME
  if (fromEnv) return fromEnv.replace(/^v/, '')

  try {
    const tag = execSync('git describe --tags --abbrev=0', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    if (tag) return tag.replace(/^v/, '')
  } catch {
    // Sem tags ou sem Git disponível — usa o fallback abaixo.
  }

  try {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
    if (pkg.version) return pkg.version
  } catch {
    // Ignora — usa "dev" como último recurso.
  }

  return 'dev'
}

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(resolveAppVersion()),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@store': resolve(__dirname, './src/store'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
    },
  },
})
