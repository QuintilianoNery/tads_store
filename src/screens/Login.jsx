// src/screens/Login.jsx — formulários de login + criar conta (Supabase Auth)
// Etapa 2: validação inline, toggle de senha e feedback acessível.
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { isValidEmail, isNotEmpty, isValidPassword, MIN_PASSWORD_LENGTH } from '@/utils/validators';

// Botão de mostrar/ocultar senha — usado no rightSlot do Input.
function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Ocultar senha' : 'Mostrar senha'}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, color: 'var(--color-gray-500)', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {shown ? <Icon.EyeOff size={18} /> : <Icon.Eye size={18} />}
    </button>
  );
}

export default function Login() {
  const { login, register, authLoading, authError, clearAuthError } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  // Rota que o usuário tentou acessar antes de ser mandado ao login.
  const from = location.state?.from?.pathname ?? '/';

  // ── Login ──────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // ── Cadastro ───────────────────────────────────────────────
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  function validateLogin() {
    const errs = {};
    if (!isValidEmail(email)) errs.email = 'Informe um e-mail válido.';
    if (!isNotEmpty(pwd)) errs.pwd = 'Informe sua senha.';
    return errs;
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearAuthError();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }
    setLoginErrors({});
    const { success } = await login(email, pwd);
    if (success) navigate(from, { replace: true });
  }

  function validateRegister() {
    const errs = {};
    if (!isNotEmpty(regName)) errs.name = 'Nome obrigatório.';
    if (!isValidEmail(regEmail)) errs.email = 'E-mail inválido.';
    if (!isValidPassword(regPwd)) errs.pwd = `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`;
    return errs;
  }

  async function handleRegister(e) {
    e.preventDefault();
    clearAuthError();
    setSuccessMsg('');
    const errs = validateRegister();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setRegErrors({});
    const { success, loggedIn } = await register(regName, regEmail, regPwd);
    if (success) {
      setRegName(''); setRegEmail(''); setRegPwd('');
      if (loggedIn) {
        // Cadastro já autenticado (confirmação de e-mail desativada).
        navigate(from, { replace: true });
        return;
      }
      setSuccessMsg('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
    }
  }

  const bannerBase = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 16, lineHeight: 1.4 };

  return (
    <div className="container" style={{ padding: '48px var(--container-padding) 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 32 }}>Minha Conta</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 880 }}>
        <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Login</h2>

          {authError && (
            <div role="alert" aria-live="assertive" style={{ ...bannerBase, background: '#fee2e2', color: '#b91c1c' }}>
              <Icon.AlertCircle size={18} /> <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
            <Input
              label="E-mail" type="email" placeholder="seu@email.com" value={email}
              onChange={(e) => { clearAuthError(); setLoginErrors((x) => ({ ...x, email: undefined })); setEmail(e.target.value); }}
              error={loginErrors.email} required autoComplete="email"
            />
            <Input
              label="Senha" type={showLoginPwd ? 'text' : 'password'} placeholder="Sua senha" value={pwd}
              onChange={(e) => { clearAuthError(); setLoginErrors((x) => ({ ...x, pwd: undefined })); setPwd(e.target.value); }}
              error={loginErrors.pwd} required autoComplete="current-password"
              rightSlot={<PasswordToggle shown={showLoginPwd} onToggle={() => setShowLoginPwd((v) => !v)} />}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-gray-600)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--color-primary-600)' }} /> Lembrar de mim
              </label>
              <a style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>Esqueceu a senha?</a>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={authLoading}>{authLoading ? 'Entrando...' : 'Entrar'}</Button>
          </form>
        </section>
        <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Criar conta</h2>

          {successMsg && (
            <div role="status" aria-live="polite" style={{ ...bannerBase, background: '#dcfce7', color: '#15803d' }}>
              <Icon.Check size={18} /> <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
            <Input
              label="Nome completo" placeholder="Seu nome" value={regName}
              onChange={(e) => { setRegErrors((x) => ({ ...x, name: undefined })); setRegName(e.target.value); }}
              error={regErrors.name} required autoComplete="name"
            />
            <Input
              label="E-mail" type="email" placeholder="seu@email.com" value={regEmail}
              onChange={(e) => { setRegErrors((x) => ({ ...x, email: undefined })); setRegEmail(e.target.value); }}
              error={regErrors.email} required autoComplete="email"
            />
            <Input
              label="Senha" type={showRegPwd ? 'text' : 'password'} placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
              helperText={`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`} value={regPwd}
              onChange={(e) => { setRegErrors((x) => ({ ...x, pwd: undefined })); setRegPwd(e.target.value); }}
              error={regErrors.pwd} required autoComplete="new-password"
              rightSlot={<PasswordToggle shown={showRegPwd} onToggle={() => setShowRegPwd((v) => !v)} />}
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', lineHeight: 1.6 }}>Seus dados serão usados para processar seu pedido e melhorar sua experiência, conforme nossa <a style={{ color: 'var(--color-accent)' }}>política de privacidade</a>.</p>
            <Button type="submit" variant="secondary" size="lg" fullWidth disabled={authLoading}>{authLoading ? 'Criando...' : 'Criar conta'}</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
