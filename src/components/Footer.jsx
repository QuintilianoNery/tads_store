// src/components/Footer.jsx — rodapé com marca, links, contato e redes sociais
import { useState } from 'react';
import { Icon as I } from './Icon.jsx';
import { useStore } from '@/context/StoreContext';

const LOGO = '/images/tads_store_logo_cropped.png';

function FooterLink({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: 'block', textAlign: 'left', color: h ? '#fff' : 'var(--color-primary-200)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--text-sm)', lineHeight: 2.1, transition: 'color var(--transition-fast)' }}
    >
      {children}
    </button>
  );
}

function SocialBtn({ children, label }) {
  const [h, setH] = useState(false);
  return (
    <a
      href="#" aria-label={label} onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 'var(--radius-full)', color: '#fff', background: h ? 'var(--color-accent)' : 'var(--color-primary-700)', textDecoration: 'none', transition: 'background var(--transition-fast)' }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { nav } = useStore();
  const year = 2026;
  const colTitle = { fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 12 };
  const contactRow = { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 'var(--text-sm)', color: 'var(--color-primary-200)', lineHeight: 1.5, marginBottom: 12 };

  return (
    <footer style={{ background: 'var(--color-primary-900)', color: 'var(--color-primary-100)', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.3fr', gap: 40, padding: '56px 0 40px' }}>
        {/* Marca */}
        <div>
          <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block', marginBottom: 18 }}>
            <img src={LOGO} alt="TADS Store" style={{ height: 72, filter: 'brightness(0) invert(1)', display: 'block' }} />
          </button>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-200)', lineHeight: 1.7, maxWidth: 300 }}>
            Sua loja de tecnologia e acessórios. Produtos selecionados, entrega rápida e atendimento que faz a diferença.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <SocialBtn label="Facebook"><I.Facebook size={18} /></SocialBtn>
            <SocialBtn label="Instagram"><I.Instagram size={18} /></SocialBtn>
            <SocialBtn label="YouTube"><I.Youtube size={18} /></SocialBtn>
            <SocialBtn label="WhatsApp"><I.Whatsapp size={18} /></SocialBtn>
          </div>
        </div>

        {/* Loja */}
        <div>
          <h4 style={colTitle}>Loja</h4>
          <FooterLink onClick={() => nav('catalog')}>Todos os Produtos</FooterLink>
          <FooterLink onClick={() => nav('catalog')}>Categorias</FooterLink>
          <FooterLink onClick={() => nav('wishlist')}>Lista de Desejos</FooterLink>
          <FooterLink onClick={() => nav('cart')}>Carrinho</FooterLink>
        </div>

        {/* Conta */}
        <div>
          <h4 style={colTitle}>Minha Conta</h4>
          <FooterLink onClick={() => nav('login')}>Entrar / Cadastrar</FooterLink>
          <FooterLink onClick={() => nav('account')}>Meus Pedidos</FooterLink>
          <FooterLink onClick={() => nav('account')}>Configurações</FooterLink>
          <FooterLink onClick={() => nav('home')}>Central de Ajuda</FooterLink>
        </div>

        {/* Contato */}
        <div>
          <h4 style={colTitle}>Contato</h4>
          <div style={contactRow}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 1 }}><I.MapPin size={18} /></span>
            <span>Av. das Nações, 1500 — Sala 42<br />Centro — São Paulo/SP</span>
          </div>
          <div style={contactRow}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 1 }}><I.Phone size={18} /></span>
            <span>(11) 4002-8922</span>
          </div>
          <div style={contactRow}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 1 }}><I.Mail size={18} /></span>
            <span>contato@tadsstore.com.br</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-primary-700)' }}>
        <div className="container" style={{ padding: '18px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-300)' }}>© {year} TADS Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
