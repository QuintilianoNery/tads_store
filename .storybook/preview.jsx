// .storybook/preview.jsx — carrega os design tokens + reset global da TADS Store
// para que os componentes do DS apareçam exatamente como na aplicação.
import '../src/styles/variables.css';
import '../src/styles/global.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page', value: '#f8fafc' },
        { name: 'card', value: '#ffffff' },
        { name: 'brand', value: '#172554' },
      ],
    },
    a11y: {
      // 'todo' - mostra violações de a11y apenas na UI de testes
      test: 'todo',
    },
  },
};

export default preview;
