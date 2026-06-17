// src/screens/Login.jsx — formulários de login + criar conta
import { useState } from 'react';
import { Button, Input } from '@/components/ds';
import { useStore } from '@/context/StoreContext';

export default function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  return (
    <div className="container" style={{ padding: '48px 0 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 32 }}>Minha Conta</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 880 }}>
        <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); login(email || 'Visitante'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Senha" type="password" placeholder="Sua senha" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-gray-600)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--color-primary-600)' }} /> Lembrar de mim
              </label>
              <a style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>Esqueceu a senha?</a>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>Entrar</Button>
          </form>
        </section>
        <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Criar conta</h2>
          <form onSubmit={(e) => { e.preventDefault(); login('Novo Cliente'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nome completo" placeholder="Seu nome" required />
            <Input label="E-mail" type="email" placeholder="seu@email.com" required />
            <Input label="Senha" type="password" placeholder="Mínimo 6 caracteres" helperText="A senha deve ter pelo menos 6 caracteres." required />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', lineHeight: 1.6 }}>Seus dados serão usados para processar seu pedido e melhorar sua experiência, conforme nossa <a style={{ color: 'var(--color-accent)' }}>política de privacidade</a>.</p>
            <Button type="submit" variant="secondary" size="lg" fullWidth>Criar conta</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
