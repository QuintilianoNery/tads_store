import { expect, within } from 'storybook/test';
import { Card } from './Card.jsx';
import { Button } from './Button.jsx';

const meta = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text' },
    variant: { control: 'inline-radio', options: ['solid', 'subtle', 'dashed'] },
    padding: { control: 'number' },
  },
  args: {
    title: 'Resumo do pedido',
    variant: 'solid',
    padding: 24,
    children: 'Conteúdo do cartão vai aqui (children).',
  },
};
export default meta;

// Uso simples: props `title` + `children`.
export const Basico = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Resumo do pedido')).toBeInTheDocument();
    await expect(canvas.getByText(/Conteúdo do cartão/)).toBeInTheDocument();
  },
};

// Props ricas: título + ações alinhadas à direita.
export const ComAcoes = {
  args: {
    title: 'Endereço de entrega',
    actions: <Button variant="ghost" size="sm">Editar</Button>,
    children: 'Rua das Flores, 123 — São Paulo/SP',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  },
};

// Variações de moldura.
export const Subtle = { args: { variant: 'subtle', title: 'Bloco de preço' } };
export const Dashed = {
  args: { variant: 'dashed', title: undefined, children: 'Este produto ainda não tem avaliações.' },
};

// Composição explícita: montado a partir de Card.Header / Card.Body / Card.Footer.
export const Composicao = {
  render: (args) => (
    <Card {...args} title={undefined}>
      <Card.Header actions={<Button variant="ghost" size="sm">Editar</Button>}>
        Pagamento
      </Card.Header>
      <Card.Body>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
          Mercado Pago — cartão, Pix ou boleto.
        </p>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="sm">Pagar agora</Button>
      </Card.Footer>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Pagamento')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Pagar agora' })).toBeInTheDocument();
  },
};
