import { expect, within } from 'storybook/test';
import { Spinner } from './Spinner.jsx';

const meta = {
  title: 'Design System/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
  args: { size: 24 },
};
export default meta;

export const Default = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Carregando')).toBeInTheDocument();
  },
};
export const Large = { args: { size: 48 } };

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {[16, 24, 32, 48].map((s) => (
        <Spinner key={s} size={s} />
      ))}
    </div>
  ),
};
