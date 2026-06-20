// Story do Footer em uso na aplicação (protótipo TADS Store).
// Renderiza o componente real dentro do StoreProvider + Router.
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '@/context/StoreContext';
import Footer from './Footer.jsx';

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'brand' },
    docs: {
      description: {
        component:
          'Rodapé real da loja: marca + redes sociais, colunas de links ' +
          '(Loja, Minha Conta), bloco de contato e a barra de copyright com a ' +
          'versão do app. Estado/navegação vêm do StoreContext.',
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

export const Padrao = {};
