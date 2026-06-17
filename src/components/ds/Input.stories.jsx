import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input.jsx';

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel'] },
  },
  args: {
    label: 'E-mail',
    placeholder: 'seu@email.com',
    type: 'email',
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
export default meta;

export const Default = {};
export const Required = { args: { label: 'Nome completo', placeholder: 'Seu nome', type: 'text', required: true } };
export const WithHelper = {
  args: { label: 'Senha', type: 'password', placeholder: 'Mínimo 6 caracteres', helperText: 'A senha deve ter pelo menos 6 caracteres.' },
};
export const WithError = {
  args: { label: 'E-mail', defaultValue: 'invalido', error: 'Informe um e-mail válido.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Informe um e-mail válido.');
    await expect(canvas.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  },
};

// ── Teste de interação: digitar atualiza o valor do campo ──
export const Typing = {
  args: { label: 'Nome completo', type: 'text', placeholder: 'Seu nome' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText('Nome completo');
    await userEvent.type(field, 'Maria Silva');
    await expect(field).toHaveValue('Maria Silva');
  },
};
