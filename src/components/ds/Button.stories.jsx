import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button.jsx';

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'accent', 'deal', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Adicionar ao carrinho',
  },
};
export default meta;

export const Primary = { args: { variant: 'primary' } };
export const Secondary = { args: { variant: 'secondary', children: 'Explorar catálogo' } };
export const Accent = { args: { variant: 'accent' } };
export const Deal = { args: { variant: 'deal', children: 'Comprar agora' } };
export const Ghost = { args: { variant: 'ghost', children: 'Cancelar' } };
export const Danger = { args: { variant: 'danger', children: 'Remover' } };
export const Loading = { args: { isLoading: true, children: 'Processando' } };
export const Disabled = { args: { disabled: true } };
export const FullWidth = { args: { fullWidth: true, size: 'lg' }, parameters: { layout: 'padded' } };

export const Sizes = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button {...args} size="sm">Pequeno</Button>
      <Button {...args} size="md">Médio</Button>
      <Button {...args} size="lg">Grande</Button>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {['primary', 'secondary', 'accent', 'deal', 'ghost', 'danger'].map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

// ── Testes de interação (rodam no Chromium via Playwright) ──
export const Clickable = {
  args: { children: 'Clique aqui', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Clique aqui' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledDoesNotFire = {
  args: { children: 'Indisponível', disabled: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Indisponível' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
