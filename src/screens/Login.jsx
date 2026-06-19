// src/screens/Login.jsx — formulários de login + criar conta (Supabase Auth)
import { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { useStore } from '@/context/StoreContext';

export default function Login() {
  const { login, register, authLoading, authError, clearAuthError } = useStore();

  // ── Login ──────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  // ── Cadastro ───────────────────────────────────────────────
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [regErrors, setRegErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    clearAuthError();
    await login(email, pwd);
  }

  function validateRegister() {
    const errs = {};
    if (!regName.trim()) errs.name = 'Nome obrigatório.';
    if (!regEmail.includes('@')) errs.email = 'E-mail inválido.';
    if (regPwd.length < 6) errs.pwd = 'Mínimo de 6 caracteres.';
    return errs;
  }

  async function handleRegister(e) {
    e.preventDefault();
    clearAuthError();
    setSuccessMsg('');
    const errs = validateRegister();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setRegErrors({});
    const { success, needsConfirmation } = await register(regName, regEmail, regPwd);
    if (success) {
      setSuccessMsg(
        needsConfirmation
          ? 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.'
          : 'Cadastro realizado com sucesso!'
      );
      setRegName(''); setRegEmail(''); setRegPwd('');
    }
  }

  const bannerBase = { padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 16 };

  return (
    <div className="container" style={{ padding: '48px 0 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 32 }}>Minha Conta</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 880 }}>
        <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Login</h2>

          {authError && (
            <div role="alert" style={{ ...bannerBase, background: '#fee2e2', color: '#b91c1c' }}>{authError}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => { clearAuthError(); setEmail(e.target.value); }} required autoComplete="email" />
            <Input label="Senha" type="password" placeholder="Sua senha" value={pwd} onChange={(e) => { clearAuthError(); setPwd(e.target.value); }} required autoComplete="current-password" />
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
            <div role="status" style={{ ...bannerBase, background: '#dcfce7', color: '#15803d' }}>{successMsg}</div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
            <Input label="Nome completo" placeholder="Seu nome" value={regName} onChange={(e) => { setRegErrors((x) => ({ ...x, name: undefined })); setRegName(e.target.value); }} error={regErrors.name} required autoComplete="name" />
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={regEmail} onChange={(e) => { setRegErrors((x) => ({ ...x, email: undefined })); setRegEmail(e.target.value); }} error={regErrors.email} required autoComplete="email" />
            <Input label="Senha" type="password" placeholder="Mínimo 6 caracteres" helperText="A senha deve ter pelo menos 6 caracteres." value={regPwd} onChange={(e) => { setRegErrors((x) => ({ ...x, pwd: undefined })); setRegPwd(e.target.value); }} error={regErrors.pwd} required autoComplete="new-password" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', lineHeight: 1.6 }}>Seus dados serão usados para processar seu pedido e melhorar sua experiência, conforme nossa <a style={{ color: 'var(--color-accent)' }}>política de privacidade</a>.</p>
            <Button type="submit" variant="secondary" size="lg" fullWidth disabled={authLoading}>{authLoading ? 'Criando...' : 'Criar conta'}</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
