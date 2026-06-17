import { expect, within } from 'storybook/test';
import { Badge } from './Badge.jsx';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'accent', 'deal', 'success', 'danger', 'warning', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    children: { control: 'text' },
  },
  args: { variant: 'deal', size: 'md', children: '-20%' },
};
export default meta;

export const Deal = {
  args: { variant: 'deal', children: '-28%' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('-28%')).toBeInTheDocument();
  },
};
export const Primary = { args: { variant: 'primary', children: 'Principal' } };
export const Success = { args: { variant: 'success', children: 'Entregue' } };
export const Info = { args: { variant: 'info', children: 'A caminho' } };

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {['primary', 'accent', 'deal', 'success', 'danger', 'warning', 'info'].map((v) => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </div>
  ),
};
