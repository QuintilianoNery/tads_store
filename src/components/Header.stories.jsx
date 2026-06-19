// Story do Header em uso na aplicação (protótipo TADS Store).
// Renderiza o componente real dentro do StoreProvider + Router, exatamente
// como aparece no app. Serve de referência viva do cabeçalho atual.
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '@/context/StoreContext';
import Header from './Header.jsx';

const meta = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cabeçalho real da loja: topbar (login/logout), barra principal ' +
          '(logo, busca, favoritos, carrinho, conta) e navegação por categorias ' +
          '(Eletrônicos, Acessórios, Velocidade). Estado vem do StoreContext.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <StoreProvider>
          <Story />
        </StoreProvider>
      </MemoryRouter>
    ),
  ],
};
export default meta;

// Estado padrão (visitante não logado): topbar mostra "Sign up / Login".
export const Padrao = {};
