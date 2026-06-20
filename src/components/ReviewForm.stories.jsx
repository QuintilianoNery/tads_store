// Story do ReviewForm — formulário de avaliação (estrelas + comentário) usado
// na avaliação pós-compra (Minha Conta → Meus pedidos).
import { expect, fn, userEvent, within } from 'storybook/test';
import { ReviewForm } from './ReviewForm.jsx';

const meta = {
  title: 'Componentes/ReviewForm',
  component: ReviewForm,
  tags: ['autodocs'],
  args: { onSubmit: fn(), onCancel: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Formulário de avaliação: seletor de estrelas (StarRating interativo) + ' +
          'comentário opcional. Exige uma nota de 1 a 5 antes de enviar e informa ' +
          'que a avaliação passa por moderação.',
      },
    },
  },
};
export default meta;

// Estado inicial em branco (primeira avaliação).
export const Vazio = {};

// Edição de uma avaliação já existente (nota e comentário preenchidos).
export const ComAvaliacao = {
  args: { initial: { rating: 4, comment: 'Produto muito bom, recomendo!' } },
};

// Fluxo: tenta enviar sem nota (erro), escolhe 5 estrelas e envia.
export const EnviaAvaliacao = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Enviar avaliação' }));
    await expect(canvas.getByText('Selecione de 1 a 5 estrelas.')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('radio', { name: '5 estrelas' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar avaliação' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ rating: 5, comment: '' });
  },
};
