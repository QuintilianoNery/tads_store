// src/components/ReviewForm.jsx — formulário de avaliação (estrelas + comentário)
// usado na avaliação pós-compra (Minha Conta → Meus pedidos).
import { useState } from 'react';
import { StarRating, Button } from '@/components/ds';
import { Icon } from './Icon.jsx';

export function ReviewForm({ initial, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (rating < 1) {
      setError('Selecione de 1 a 5 estrelas.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch {
      setError('Não foi possível enviar a avaliação. Tente novamente.');
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, padding: 16, background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-100)', borderRadius: 'var(--radius-md)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-gray-700)' }}>Sua nota:</span>
        <StarRating rating={rating} size={26} onRate={(value) => { setRating(value); setError(''); }} />
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Conte o que achou do produto (opcional)"
        rows={3}
        maxLength={500}
        style={{ width: '100%', resize: 'vertical', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-300)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', color: 'var(--color-gray-800)' }}
      />

      {error && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>
          <Icon.AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', margin: 0 }}>
        Sua avaliação aparece na página do produto assim que enviada.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Enviando...' : 'Enviar avaliação'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </form>
  );
}

export default ReviewForm;
