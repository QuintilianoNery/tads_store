import { expect, within } from 'storybook/test';
import { StarRating } from './StarRating.jsx';

const meta = {
  title: 'Design System/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
    size: { control: { type: 'range', min: 10, max: 32, step: 1 } },
    count: { control: 'number' },
  },
  args: { rating: 4.5, size: 16 },
};
export default meta;

export const Default = {};
export const WithCount = {
  args: { rating: 4, count: 248 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Avaliação: 4 de 5')).toBeInTheDocument();
    await expect(canvas.getByText('(248)')).toBeInTheDocument();
  },
};
export const Full = { args: { rating: 5 } };
export const Large = { args: { rating: 4, size: 28 } };

export const Scale = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[5, 4, 3, 2, 1].map((r) => (
        <StarRating key={r} rating={r} size={18} count={Math.round(Math.random() * 300)} />
      ))}
    </div>
  ),
};
