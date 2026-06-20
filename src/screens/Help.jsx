// src/screens/Help.jsx — Central de Ajuda (FAQ) com perguntas frequentes em accordion
import { useState } from 'react';
import { Icon } from '@/components/Icon.jsx';
import { useStore } from '@/context/StoreContext';
import { Eyebrow } from '@/screens/shared';

// FAQ fake/simples agrupado por tema. Conteúdo e dados são apenas ilustrativos
// (números de pedido, códigos de rastreio, prazos e valores fictícios).
const FAQ_GROUPS = [
  {
    title: 'Pedidos e Pagamento',
    icon: Icon.CreditCard,
    items: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos cartão de crédito (Visa, Mastercard e Elo) em até 12x sem juros para compras acima de R$ 300,00, e boleto bancário com 5% de desconto à vista. A escolha é feita na etapa de pagamento do checkout, antes de confirmar o pedido.',
      },
      {
        q: 'Em quanto tempo o pagamento é aprovado?',
        a: 'Cartão de crédito é aprovado em até 2 minutos. Boletos compensam em até 2 dias úteis — o pedido fica com status "Aguardando pagamento" (ex.: pedido TADS-2026-004821) até a confirmação do banco.',
      },
      {
        q: 'Como acompanho o meu pedido?',
        a: 'Acesse "Minha Conta" → "Meus Pedidos" para ver o histórico com os detalhes de cada compra. Exemplo: pedido TADS-2026-004821, realizado em 18/06/2026, 3 itens, total de R$ 1.249,90, status "Em transporte".',
      },
      {
        q: 'Posso cancelar uma compra?',
        a: 'Pedidos podem ser cancelados gratuitamente enquanto estiverem com status "Em separação" (até 24h após a confirmação). Envie o número do pedido (ex.: TADS-2026-004821) para contato@tadsstore.com.br e o estorno ocorre em até 5 dias úteis.',
      },
    ],
  },
  {
    title: 'Entrega',
    icon: Icon.Truck,
    items: [
      {
        q: 'Qual o prazo de entrega?',
        a: 'O prazo varia conforme a região e é exibido no checkout. Exemplos: Sudeste 3 a 5 dias úteis (frete a partir de R$ 12,90), Sul e Nordeste 5 a 8 dias úteis, Norte 8 a 12 dias úteis. Frete grátis em compras acima de R$ 399,00.',
      },
      {
        q: 'Como rastreio minha encomenda?',
        a: 'Assim que o pedido é despachado, você recebe o código de rastreio por e-mail. Exemplo: TS123456789BR — acompanhe a movimentação pela transportadora ou na página do pedido em "Minha Conta".',
      },
      {
        q: 'Como cadastro um endereço de entrega?',
        a: 'Gerencie seus endereços em "Minha Conta" ou adicione um novo direto na etapa de entrega do checkout. Exemplo de endereço salvo: "Casa — Av. das Nações, 1500, Sala 42, Centro, São Paulo/SP, CEP 01010-000". Os endereços ficam salvos para compras futuras.',
      },
    ],
  },
  {
    title: 'Trocas e Devoluções',
    icon: Icon.RotateCcw,
    items: [
      {
        q: 'Qual o prazo para devolução?',
        a: 'Você tem até 7 dias corridos após o recebimento para devolução por arrependimento, conforme o Código de Defesa do Consumidor (art. 49). Para defeito de fabricação, o prazo é de 90 dias. O reembolso é feito no mesmo método de pagamento em até 10 dias úteis.',
      },
      {
        q: 'Como solicito uma troca?',
        a: 'Acesse "Meus Pedidos", selecione o item e clique em "Solicitar troca", ou envie um e-mail para contato@tadsstore.com.br com o número do pedido (ex.: TADS-2026-004821) e o motivo. Você recebe um código de postagem reversa (ex.: DEV-77310) sem custo de frete.',
      },
      {
        q: 'O produto chegou com defeito. O que faço?',
        a: 'Registre a ocorrência em até 7 dias informando o número do pedido e fotos do produto. Após a análise (até 3 dias úteis), oferecemos troca pelo mesmo item, outro produto de valor equivalente ou reembolso integral, incluindo o frete.',
      },
    ],
  },
  {
    title: 'Conta e Segurança',
    icon: Icon.Shield,
    items: [
      {
        q: 'Como altero a minha senha?',
        a: 'Acesse "Minha Conta" e use o campo de troca de senha no seu cadastro. A nova senha precisa ter no mínimo 8 caracteres, com letras e números. A alteração tem efeito imediato em todos os dispositivos.',
      },
      {
        q: 'Esqueci minha senha, e agora?',
        a: 'Na tela de login, clique em "Esqueci minha senha" e informe seu e-mail. Você recebe um link de redefinição válido por 60 minutos. Por segurança, o link só pode ser usado uma vez.',
      },
      {
        q: 'Meus dados estão seguros?',
        a: 'Sim. A autenticação e o armazenamento são gerenciados pelo Supabase, com senhas protegidas por hashing (bcrypt) e regras de acesso (RLS) que garantem que cada usuário só acesse os próprios dados. Não armazenamos os dados completos do seu cartão.',
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-900)',
        }}
      >
        <span>{q}</span>
        <span style={{ flexShrink: 0, color: 'var(--color-primary-600)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }}>
          <Icon.ChevronDown size={20} />
        </span>
      </button>
      {open && (
        <p style={{ margin: 0, padding: '0 0 18px', color: 'var(--color-gray-600)', lineHeight: 1.7, fontSize: 'var(--text-sm)', maxWidth: 720 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function Help() {
  const { nav } = useStore();

  return (
    <div className="container" style={{ padding: '40px 0 64px', maxWidth: 880 }}>
      <header style={{ marginBottom: 32 }}>
        <Eyebrow>Central de Ajuda</Eyebrow>
        <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-gray-900)', margin: '8px 0 8px' }}>
          Como podemos ajudar?
        </h1>
        <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.6 }}>
          Reunimos as dúvidas mais comuns sobre compras, entregas, devoluções e conta. Dados fake, página em desenvolvimento, só para ilustrar mesmo. Se não encontrar o que procura, fale com a gente!
        </p>
      </header>

      {FAQ_GROUPS.map((group) => (
        <section key={group.title} style={{ marginBottom: 36 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-xl)', color: 'var(--color-gray-900)', marginBottom: 8 }}>
            <span style={{ color: 'var(--color-accent)' }}><group.icon size={22} /></span>
            {group.title}
          </h2>
          {group.items.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </section>
      ))}

      <div style={{ background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-900)', marginBottom: 6 }}>Não encontrou o que procurava?</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 16, lineHeight: 1.6 }}>
          Fale com a nossa equipe pelo e-mail{' '}
          <a href="mailto:contato@tadsstore.com.br" style={{ color: 'var(--color-primary-700)', fontWeight: 'var(--font-semibold)', textDecoration: 'none' }}>
            contato@tadsstore.com.br
          </a>{' '}
          ou pelo telefone (11) 4002-8922.
        </p>
        <button
          onClick={() => nav('catalog')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-600)', color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
          }}
        >
          Voltar às compras <Icon.ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
