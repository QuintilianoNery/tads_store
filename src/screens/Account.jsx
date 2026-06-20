// src/screens/Account.jsx — área logada: perfil, stats, pedidos, dados, endereços
import { useState, useEffect } from 'react';
import { Button, Input, Badge, Spinner } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { changePassword } from '@/services/authService';
import { getOrders, orderNumber } from '@/services/orderService';
import { isNotEmpty, isValidPassword, MIN_PASSWORD_LENGTH } from '@/utils/validators';
import { fmtBRL } from '@/lib/format';

// Estilo e rótulo de cada status de pedido.
const ORDER_STATUS = {
  pago:      { label: 'Pago',      bg: '#dcfce7', fg: '#15803d' },
  pendente:  { label: 'Pendente',  bg: '#fef3c7', fg: '#92400e' },
  cancelado: { label: 'Cancelado', bg: '#fee2e2', fg: '#b91c1c' },
};

// Formata a data de criação do pedido em PT-BR (ex.: "4 de junho de 2026").
function formatOrderDate(createdAt) {
  if (!createdAt) return '';
  return new Date(createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

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

export default function Account() {
  const { user, nav, wishCount, logout } = useStore();
  const [activeTab, setActiveTab] = useState('pedidos');
  const name = user?.name || 'Visitante';

  // ── Histórico de pedidos (Supabase) ────────────────────────
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  useEffect(() => {
    let active = true;
    if (!user) { setLoadingOrders(false); return undefined; }
    (async () => {
      try {
        const data = await getOrders(user.id);
        if (active) setOrders(data);
      } catch (err) {
        console.error('Falha ao carregar pedidos:', err);
      } finally {
        if (active) setLoadingOrders(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  // ── Troca de senha ─────────────────────────────────────────
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdServerError, setPwdServerError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  function updatePwd(field, value) {
    setPwdForm((f) => ({ ...f, [field]: value }));
    setPwdErrors((e) => ({ ...e, [field]: undefined }));
    setPwdSuccess(false);
    setPwdServerError('');
  }

  function validatePwd() {
    const errs = {};
    if (!isNotEmpty(pwdForm.current)) errs.current = 'Informe sua senha atual.';
    if (!isValidPassword(pwdForm.next)) errs.next = `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`;
    if (pwdForm.next !== pwdForm.confirm) errs.confirm = 'As senhas não conferem.';
    return errs;
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwdServerError('');
    setPwdSuccess(false);
    const errs = validatePwd();
    if (Object.keys(errs).length > 0) { setPwdErrors(errs); return; }
    setPwdErrors({});
    setPwdLoading(true);
    try {
      await changePassword({ email: user?.email, currentPassword: pwdForm.current, newPassword: pwdForm.next });
      setPwdSuccess(true);
      setPwdForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwdServerError(
        err.message === 'CURRENT_PASSWORD_INVALID'
          ? 'Senha atual incorreta.'
          : 'Não foi possível alterar a senha. Tente novamente.'
      );
    } finally {
      setPwdLoading(false);
    }
  }
  const menuItems = [
    { id: 'pedidos', label: 'Meus pedidos', icon: <Icon.Truck size={18} /> },
    { id: 'dados', label: 'Dados pessoais', icon: <Icon.User size={18} /> },
    { id: 'enderecos', label: 'Endereços', icon: <Icon.MapPin size={18} /> },
    { id: 'favoritos', label: 'Favoritos', icon: <Icon.Heart size={18} /> },
  ];
  const stats = [
    { value: orders.length, label: 'Pedidos' },
    { value: wishCount || 0, label: 'Favoritos' },
    { value: 3, label: 'Cupons' },
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
            {menuItems.map((menuItem) => (
              <button key={menuItem.id} onClick={() => (menuItem.id === 'favoritos' ? nav('wishlist') : setActiveTab(menuItem.id))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 'var(--text-sm)', transition: 'all var(--transition-fast)',
                  background: activeTab === menuItem.id ? 'var(--color-primary-50)' : 'transparent', color: activeTab === menuItem.id ? 'var(--color-primary-800)' : 'var(--color-gray-600)', fontWeight: activeTab === menuItem.id ? 'var(--font-bold)' : 'var(--font-medium)' }}>
                <span style={{ color: activeTab === menuItem.id ? 'var(--color-primary-700)' : 'var(--color-gray-400)' }}>{menuItem.icon}</span> {menuItem.label}
              </button>
            ))}
            <button onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 'var(--text-sm)', color: 'var(--color-danger)', fontWeight: 'var(--font-semibold)', marginTop: 4, borderTop: '1px solid var(--color-gray-100)' }}>
              <Icon.ChevronLeft size={18} /> Sair
            </button>
          </nav>
        </aside>

        {/* conteúdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--color-gray-900)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {activeTab === 'pedidos' && (
            <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 16 }}>Meus pedidos</h2>
              {loadingOrders ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner size={32} /></div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-gray-500)' }}>
                  <Icon.Truck size={36} style={{ color: 'var(--color-gray-300)', marginBottom: 10 }} />
                  <p style={{ marginBottom: 16 }}>Você ainda não fez nenhum pedido.</p>
                  <Button variant="primary" onClick={() => nav('catalog')}>Explorar produtos</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.map((order) => {
                    const itemList = order.order_items ?? [];
                    const units = itemList.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
                    const statusStyle = ORDER_STATUS[order.status] ?? ORDER_STATUS.pendente;
                    return (
                      <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
                        <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon.Truck size={20} /></span>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', fontSize: 'var(--text-sm)' }}>{orderNumber(order)}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{formatOrderDate(order.created_at)} · {units} {units > 1 ? 'itens' : 'item'}</div>
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: statusStyle.bg, color: statusStyle.fg, whiteSpace: 'nowrap' }}>{statusStyle.label}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-bold)', color: 'var(--color-gray-900)', whiteSpace: 'nowrap' }}>{fmtBRL(order.total)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === 'dados' && (
            <>
              <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 18 }}>Dados pessoais</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <Input label="Nome completo" defaultValue={name} />
                  <Input label="E-mail" type="email" defaultValue={user?.email ?? ''} />
                  <Input label="CPF" defaultValue="000.000.000-00" />
                  <Input label="Telefone" defaultValue="(11) 90000-0000" />
                </div>
                <div style={{ marginTop: 18 }}><Button variant="primary">Salvar alterações</Button></div>
              </section>

              <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', marginTop: 18 }}>
                <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 6 }}>Alterar senha</h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 18 }}>
                  Confirme sua senha atual e defina uma nova senha para a conta.
                </p>

                {pwdSuccess && (
                  <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 16, background: '#dcfce7', color: '#15803d' }}>
                    <Icon.Check size={18} /> <span>Senha alterada com sucesso!</span>
                  </div>
                )}
                {pwdServerError && (
                  <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 16, background: '#fee2e2', color: '#b91c1c' }}>
                    <Icon.AlertCircle size={18} /> <span>{pwdServerError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }} noValidate>
                  <Input
                    label="Senha atual" type={showPwd ? 'text' : 'password'} value={pwdForm.current}
                    onChange={(e) => updatePwd('current', e.target.value)} error={pwdErrors.current}
                    autoComplete="current-password" required
                    rightSlot={<PasswordToggle shown={showPwd} onToggle={() => setShowPwd((v) => !v)} />}
                  />
                  <Input
                    label="Nova senha" type={showPwd ? 'text' : 'password'} value={pwdForm.next}
                    onChange={(e) => updatePwd('next', e.target.value)} error={pwdErrors.next}
                    helperText={`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`}
                    autoComplete="new-password" required
                    rightSlot={<PasswordToggle shown={showPwd} onToggle={() => setShowPwd((v) => !v)} />}
                  />
                  <Input
                    label="Confirmar nova senha" type={showPwd ? 'text' : 'password'} value={pwdForm.confirm}
                    onChange={(e) => updatePwd('confirm', e.target.value)} error={pwdErrors.confirm}
                    autoComplete="new-password" required
                  />
                  <div>
                    <Button type="submit" variant="primary" disabled={pwdLoading}>
                      {pwdLoading ? 'Salvando...' : 'Atualizar senha'}
                    </Button>
                  </div>
                </form>
              </section>
            </>
          )}

          {activeTab === 'enderecos' && (
            <section style={{ background: '#fff', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 18 }}>Endereços</h2>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, border: '1.5px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)' }}>
                <Icon.MapPin size={22} style={{ color: 'var(--color-primary-700)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ color: 'var(--color-gray-900)' }}>Casa</strong>
                    <Badge variant="primary" size="sm">Principal</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 4 }}>Rua das Palmeiras, 1280 — Apto 52<br />Pinheiros, São Paulo — SP · 05422-000</p>
                </div>
                <button style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
              </div>
              <div style={{ marginTop: 16 }}><Button variant="secondary"><Icon.Plus size={16} /> Adicionar endereço</Button></div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
