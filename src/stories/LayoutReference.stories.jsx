// Referência visual do layout ATUAL e CORRETO da TADS Store.
//
// Estes são prints reais da aplicação rodando. Servem como "fonte da verdade"
// do design: se o app (ou uma story) divergir destas imagens, houve regressão
// de layout — use estas imagens para identificar o que deve ser restaurado.
//
// As imagens ficam em .storybook/reference/ (fora de public/, para não irem ao
// build de produção) e são servidas em /reference/ via staticDirs.

const WARNING =
  'Este é o layout CORRETO e ATUAL da TADS Store. Se a aplicação divergir ' +
  'destas imagens, houve uma regressão de layout — restaure este visual.';

function ReferenceShot({ src, alt, note }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div
        role="note"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fef3c7', color: '#92400e',
          border: '1.5px solid #f59e0b', borderRadius: 8,
          padding: '12px 16px', marginBottom: 8, fontSize: 14, fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 20 }}>⚠️</span>
        <span>{WARNING}</span>
      </div>
      {note && (
        <p style={{ margin: '0 0 16px', color: '#475569', fontSize: 14 }}>{note}</p>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%', height: 'auto', display: 'block',
          border: '1px solid #e2e8f0', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      />
    </div>
  );
}

const meta = {
  title: '⚠️ Referência de Layout (ATUAL)',
  component: ReferenceShot,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Prints reais do layout atual e correto da loja. Use como referência ' +
          'visual para detectar e corrigir regressões de layout. As imagens ' +
          'estão em `.storybook/reference/` e são atualizadas conforme o design evolui.',
      },
    },
  },
};
export default meta;

export const Home = {
  args: {
    src: '/reference/home.png',
    alt: 'Página inicial da TADS Store',
    note: 'Home: hero, "Comprar por categoria", "Promoções relâmpago" e "Produtos em destaque".',
  },
};

export const Produtos = {
  args: {
    src: '/reference/produtos.png',
    alt: 'Catálogo de produtos',
    note: 'Catálogo: filtros laterais, ordenação e grade de produtos.',
  },
};

export const Detalhe = {
  args: {
    src: '/reference/detalhe.png',
    alt: 'Página de detalhe do produto',
    note: 'Detalhe do produto: galeria, preço, variações, abas de informação.',
  },
};

export const Carrinho = {
  args: {
    src: '/reference/carrinho.png',
    alt: 'Carrinho de compras',
    note: 'Carrinho (estado vazio): chamada para voltar ao catálogo.',
  },
};

export const Login = {
  args: {
    src: '/reference/login.png',
    alt: 'Tela de login e cadastro',
    note: 'Minha Conta (deslogado): cards de Login e Criar conta lado a lado.',
  },
};

export const MinhaConta = {
  args: {
    src: '/reference/minha-conta.png',
    alt: 'Painel da conta do usuário logado',
    note: 'Minha Conta (logado): sidebar, estatísticas e pedidos recentes.',
  },
};
