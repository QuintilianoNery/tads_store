// src/screens/NaoEncontrado.jsx — página 404 (rota coringa path="*", a última do App).
// Mensagem amigável + atalhos de volta à loja e para as principais categorias.
import { Button } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { CATEGORY_GROUPS } from '@/components/Header';

export default function NaoEncontrado() {
  const { nav } = useStore();

  return (
    <div className="container" style={{ padding: '72px var(--container-padding) 96px', textAlign: 'center', maxWidth: 640 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', marginBottom: 20 }}>
        <Icon.AlertCircle size={36} />
      </span>

      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--font-extrabold)', fontSize: 'clamp(4rem, 18vw, 7rem)', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--color-primary-800)' }}>
        404
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', margin: '12px 0 10px' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.6, marginBottom: 28 }}>
        O endereço que você tentou acessar não existe ou foi movido. Confira o link
        ou volte para a loja para continuar comprando.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" size="lg" onClick={() => nav('home')}>
          <Icon.Home size={18} /> Voltar para a loja
        </Button>
        <Button variant="secondary" size="lg" onClick={() => nav('catalog')}>
          Ver todos os produtos <Icon.ArrowRight size={18} />
        </Button>
      </div>

      {/* Atalhos por categoria */}
      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 14 }}>
          Ou continue navegando por aqui:
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CATEGORY_GROUPS.map((group) => (
            <button
              key={group.label}
              onClick={() => nav('catalog', group.slugs[0])}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-800)' }}
            >
              {group.label} <Icon.ArrowRight size={14} style={{ color: 'var(--color-primary-600)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
