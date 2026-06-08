// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import useAuthStore from '@/store/authStore'
import styles from './Login.module.css'

function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname ?? '/minha-conta'

  const { login, register, isLoading, error, clearError } = useAuthStore()

  // ── Estado dos formulários ─────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showLoginPwd, setShowLoginPwd]     = useState(false)
  const [showRegPwd, setShowRegPwd]         = useState(false)
  const [registerErrors, setRegisterErrors] = useState({})
  const [successMsg, setSuccessMsg]         = useState('')

  // ── Login ──────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    clearError()
    const { success } = await login(loginForm.email, loginForm.password)
    if (success) navigate(from, { replace: true })
  }

  // ── Cadastro ───────────────────────────────────────────────
  function validateRegister() {
    const errs = {}
    if (!registerForm.fullName.trim()) errs.fullName = 'Nome obrigatório.'
    if (!registerForm.email.includes('@')) errs.email = 'E-mail inválido.'
    if (registerForm.password.length < 6) errs.password = 'Mínimo de 6 caracteres.'
    if (registerForm.password !== registerForm.confirm) errs.confirm = 'Senhas não conferem.'
    return errs
  }

  async function handleRegister(e) {
    e.preventDefault()
    clearError()
    const errs = validateRegister()
    if (Object.keys(errs).length > 0) { setRegisterErrors(errs); return }
    setRegisterErrors({})
    const { success, needsConfirmation } = await register(
      registerForm.fullName,
      registerForm.email,
      registerForm.password
    )
    if (success && needsConfirmation) {
      setSuccessMsg('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
      setRegisterForm({ fullName: '', email: '', password: '', confirm: '' })
    }
  }

  function updateLogin(field, value) {
    clearError()
    setLoginForm((f) => ({ ...f, [field]: value }))
  }

  function updateRegister(field, value) {
    clearError()
    setRegisterErrors((e) => ({ ...e, [field]: undefined }))
    setRegisterForm((f) => ({ ...f, [field]: value }))
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Minha Conta</h1>

        <div className={styles.grid}>
          {/* ── Login ── */}
          <section className={styles.card} aria-labelledby="login-heading">
            <h2 id="login-heading" className={styles.cardTitle}>Login</h2>

            {error && (
              <div className={styles.errorBanner} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className={styles.form} noValidate>
              <Input
                label="E-mail"
                type="email"
                value={loginForm.email}
                onChange={(e) => updateLogin('email', e.target.value)}
                leftIcon={Mail}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />

              <div className={styles.passwordField}>
                <Input
                  label="Senha"
                  type={showLoginPwd ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => updateLogin('password', e.target.value)}
                  leftIcon={Lock}
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowLoginPwd((v) => !v)}
                  aria-label={showLoginPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className={styles.loginOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Lembrar de mim
                </label>
                <Link to="/recuperar-senha" className={styles.forgotLink}>
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </form>
          </section>

          {/* ── Cadastro ── */}
          <section className={styles.card} aria-labelledby="register-heading">
            <h2 id="register-heading" className={styles.cardTitle}>Criar conta</h2>

            {successMsg && (
              <div className={styles.successBanner} role="status">
                <CheckCircle size={16} aria-hidden="true" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className={styles.form} noValidate>
              <Input
                label="Nome completo"
                type="text"
                value={registerForm.fullName}
                onChange={(e) => updateRegister('fullName', e.target.value)}
                leftIcon={User}
                placeholder="Seu nome"
                required
                error={registerErrors.fullName}
                autoComplete="name"
              />

              <Input
                label="E-mail"
                type="email"
                value={registerForm.email}
                onChange={(e) => updateRegister('email', e.target.value)}
                leftIcon={Mail}
                placeholder="seu@email.com"
                required
                error={registerErrors.email}
                autoComplete="email"
              />

              <div className={styles.passwordField}>
                <Input
                  label="Senha"
                  type={showRegPwd ? 'text' : 'password'}
                  value={registerForm.password}
                  onChange={(e) => updateRegister('password', e.target.value)}
                  leftIcon={Lock}
                  placeholder="Mínimo 6 caracteres"
                  required
                  error={registerErrors.password}
                  autoComplete="new-password"
                  helperText="A senha deve ter pelo menos 6 caracteres."
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowRegPwd((v) => !v)}
                  aria-label={showRegPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Input
                label="Confirmar senha"
                type={showRegPwd ? 'text' : 'password'}
                value={registerForm.confirm}
                onChange={(e) => updateRegister('confirm', e.target.value)}
                leftIcon={Lock}
                placeholder="Repita a senha"
                required
                error={registerErrors.confirm}
                autoComplete="new-password"
              />

              <p className={styles.privacyNote}>
                Seus dados serão usados para processar seu pedido e melhorar sua
                experiência, conforme nossa{' '}
                <Link to="/privacidade">política de privacidade</Link>.
              </p>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                Criar conta
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Login
