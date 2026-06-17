// src/screens/Account.jsx — área logada: perfil, stats, pedidos, dados, endereços
import { useState } from 'react';
import { Button, Input, Badge } from '@/components/ds';
import { Icon as I } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { fmtBRL } from '@/lib/format';

const SAMPLE_ORDERS = [
  { no: 'TADS-840127', date: '4 de junho de 2026', status: 'A caminho', tone: 'info', items: 2, total: 549.8 },
  { no: 'TADS-771904', date: '21 de maio de 2026', status: 'Entregue', tone: 'success', items: 1, total: 389.0 },
  { no: 'TADS-690455', date: '2 de maio de 2026', status: 'Entregue', tone: 'success', items: 3, total: 712.4 },
];

export default function Account() {
  const { user, nav, wishCount, logout } = useStore();
  const [tab, setTab] = useState('pedidos');
  const name = user?.name || 'Visitante';
  const menu = [
    { id: 'pedidos', label: 'Meus pedidos', icon: <I.Truck size={18} /> },
    { id: 'dados', label: 'Dados pessoais', icon: <I.User size={18} /> },
    { id: 'enderecos', label: 'Endereços', icon: <I.MapPin size={18} /> },
    { id: 'favoritos', label: 'Favoritos', icon: <I.Heart size={18} /> },
  ];
  const toneColor = { info: { bg: '#dbeafe', fg: '#1d4ed8' }, success: { bg: '#dcfce7', fg: '#15803d' } };
  const stats = [
    { k: SAMPLE_ORDERS.length, v: 'Pedidos' },
    { k: wishCount || 0, v: 'Favoritos' },
    { k: 3, v: 'Cupons' },
  ];

  return (
    <div className="container" style={{ padding: '36px 0 64px' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', marginBottom: 20 }}>Minha Conta</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 28, alignItems: 'start' }}>
        {/* sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 24 }}>
          <div style={{ background: 'var(--gradient-brand)', borderRadius: 'var(--radius-lg)', padding: 22, color: '#fff', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 'var(--font-extrabold)', fontSize: 'var(--text-xl)' }}>{name.charAt(0)}</span>
              <div>
                <div style={{ fontWeight: 'var(--font-bold)' }}>Olá, {name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-200)' }}>Cliente desde 2024</div>
              </div>
            </div>
          </div>
          <nav style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 8, boxShadow: 'var(--shadow-sm)' }}>
            {menu.map((m) => (
              <button key={m.id} onClick={() => (m.id === 'favoritos' ? nav('wishlist') : setTab(m.id))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 'var(--text-sm)', transition: 'all var(--transition-fast)',
                  background: tab === m.id ? 'var(--color-primary-50)' : 'transparent', color: tab === m.id ? 'var(--color-primary-800)' : 'var(--color-gray-600)', fontWeight: tab === m.id ? 'var(--font-bold)' : 'var(--font-medium)' }}>
                <span style={{ color: tab === m.id ? 'var(--color-primary-700)' : 'var(--color-gray-400)' }}>{m.icon}</span> {m.label}
              </button>
            ))}
            <button onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 'var(--text-sm)', color: 'var(--color-danger)', fontWeight: 'var(--font-semibold)', marginTop: 4, borderTop: '1px solid var(--color-gray-100)' }}>
              <I.ChevronLeft size={18} /> Sair
            </button>
          </nav>
        </aside>

        {/* conteúdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {tab === 'pedidos' && (
            <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 16 }}>Pedidos recentes</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SAMPLE_ORDERS.map((o) => (
                  <div key={o.no} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
                    <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><I.Truck size={20} /></span>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', fontSize: 'var(--text-sm)' }}>{o.no}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{o.date} · {o.items} {o.items > 1 ? 'itens' : 'item'}</div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: toneColor[o.tone].bg, color: toneColor[o.tone].fg, whiteSpace: 'nowrap' }}>{o.status}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', whiteSpace: 'nowrap' }}>{fmtBRL(o.total)}</span>
                    <button onClick={() => nav('catalog')} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Comprar de novo</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'dados' && (
            <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 18 }}>Dados pessoais</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <Input label="Nome completo" defaultValue={name} />
                <Input label="E-mail" type="email" defaultValue="cliente@email.com" />
                <Input label="CPF" defaultValue="000.000.000-00" />
                <Input label="Telefone" defaultValue="(11) 90000-0000" />
              </div>
              <div style={{ marginTop: 18 }}><Button variant="primary">Salvar alterações</Button></div>
            </section>
          )}

          {tab === 'enderecos' && (
            <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 18 }}>Endereços</h2>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, border: '1.5px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)' }}>
                <I.MapPin size={22} style={{ color: 'var(--color-primary-700)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ color: 'var(--color-gray-900)' }}>Casa</strong>
                    <Badge variant="primary" size="sm">Principal</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 4 }}>Rua das Palmeiras, 1280 — Apto 52<br />Pinheiros, São Paulo — SP · 05422-000</p>
                </div>
                <button style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
              </div>
              <div style={{ marginTop: 16 }}><Button variant="secondary"><I.Plus size={16} /> Adicionar endereço</Button></div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
