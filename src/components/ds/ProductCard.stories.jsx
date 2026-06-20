import { expect, fn, userEvent, within } from 'storybook/test';
import { ProductCard } from './ProductCard.jsx';

const meta = {
  title: 'Design System/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    category: { control: 'text' },
    price: { control: 'number' },
    originalPrice: { control: 'number' },
    discountPercentage: { control: { type: 'range', min: 0, max: 90, step: 1 } },
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    wishlisted: { control: 'boolean' },
    outOfStock: { control: 'boolean' },
  },
  args: {
    title: 'Fones Bluetooth Pro com Cancelamento de Ruído',
    category: 'Eletrônicos',
    price: 159.92,
    originalPrice: 199.9,
    discountPercentage: 20,
    rating: 4.5,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop',
    wishlisted: false,
    outOfStock: false,
    onAddToCart: fn(),
    onToggleWishlist: fn(),
  },
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
};
export default meta;

export const OnSale = {};

// ── Testes de interação ──
export const AddToCart = {
  args: { onAddToCart: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Adicionar ao carrinho' }));
    await expect(args.onAddToCart).toHaveBeenCalledTimes(1);
  },
};

export const ToggleWishlist = {
  args: { onToggleWishlist: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Lista de desejos' }));
    await expect(args.onToggleWishlist).toHaveBeenCalledTimes(1);
  },
};

export const ShowsDiscountBadge = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('-20%')).toBeInTheDocument();
  },
};

export const NoDiscount = {
  args: {
    title: 'Relógio Inteligente Series 8',
    category: 'Acessórios',
    price: 1299,
    originalPrice: undefined,
    discountPercentage: 0,
    rating: 4,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80&auto=format&fit=crop',
  },
};

export const Wishlisted = { args: { wishlisted: true } };

// Produto sem estoque: exibe o selo "Esgotado", oculta o badge de oferta e
// desabilita a ação de adicionar ao carrinho.
export const OutOfStock = {
  args: { outOfStock: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Esgotado')).toBeInTheDocument();
    const addButton = canvas.getByRole('button', { name: 'Produto indisponível' });
    await expect(addButton).toBeDisabled();
    await userEvent.click(addButton);
    await expect(args.onAddToCart).not.toHaveBeenCalled();
  },
};

export const Grid = {
  decorators: [(Story) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 24 }}><Story /></div>],
  render: () => {
    const items = [
      { id: 1, title: 'Tênis Esportivo Runner Air', category: 'Calçados', price: 237.53, originalPrice: 329.9, discountPercentage: 28, rating: 5, thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop' },
      { id: 2, title: 'Teclado Mecânico Sem Fio RGB', category: 'Eletrônicos', price: 389, discountPercentage: 0, rating: 5, thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80&auto=format&fit=crop' },
      { id: 3, title: 'Mochila Antifurto para Notebook', category: 'Acessórios', price: 186.92, originalPrice: 219.9, discountPercentage: 15, rating: 4.5, thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop' },
    ];
    return items.map((p) => (
      <ProductCard key={p.id} {...p} onAddToCart={fn()} onToggleWishlist={fn()} />
    ));
  },
};
