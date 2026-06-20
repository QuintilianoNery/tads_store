import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

// Versão exibida no rodapé. Reflete a última release publicada no GitHub.
// Ordem de resolução:
//   1) APP_VERSION                 → override manual (qualquer ambiente)
//   2) Tag mais recente via `git describe` → dev local (offline, sem rede)
//   3) Última release publicada no GitHub  → produção/CI (Vercel faz clone
//      raso, sem tags; aqui buscamos a release pela API)
//   4) Fallback para a "version" do package.json
function versionFromGit() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    if (tag) return tag.replace(/^v/, '')
  } catch {
    // Sem tags no clone (ex.: clone raso da Vercel) ou sem Git — segue adiante.
  }
  return null
}

// Descobre "owner/repo" a partir das envs da Vercel/GitHub Actions ou do remote
// local. Permite override explícito via GITHUB_REPOSITORY (formato "owner/repo").
function resolveRepoSlug() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY
  if (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG) {
    return `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
  }
  try {
    const url = execSync('git config --get remote.origin.url', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    const match = url.match(/github\.com[:/]+([^/]+)\/(.+?)(?:\.git)?$/)
    if (match) return `${match[1]}/${match[2]}`
  } catch {
    // Sem remote acessível — sem como consultar a API.
  }
  return null
}

async function versionFromGithubRelease() {
  const slug = resolveRepoSlug()
  if (!slug) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const headers = { Accept: 'application/vnd.github+json' }
    // Repositório privado exige token; público funciona sem ele.
    const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`https://api.github.com/repos/${slug}/releases/latest`, {
      headers,
      signal: controller.signal,
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data && data.tag_name) return String(data.tag_name).replace(/^v/, '')
  } catch {
    // Falha de rede/timeout — cai no fallback do package.json.
  } finally {
    clearTimeout(timeout)
  }
  return null
}

function versionFromPackage() {
  try {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
    if (pkg.version) return pkg.version
  } catch {
    // Ignora — usa "dev" como último recurso.
  }
  return 'dev'
}

async function resolveAppVersion() {
  if (process.env.APP_VERSION) return process.env.APP_VERSION.replace(/^v/, '')
  return (
    versionFromGit() ||
    (await versionFromGithubRelease()) ||
    versionFromPackage()
  )
}

export default defineConfig(async () => ({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(await resolveAppVersion()),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
    },
  },
}))
