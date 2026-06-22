// src/components/AddressBook.jsx
// Agenda de endereços do usuário, reutilizada na área da conta e no checkout.
// Lista os endereços salvos como cartões, permite adicionar/editar/remover e,
// no modo `selectable`, deixa o usuário escolher qual usar na compra.
import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Spinner } from '@/components/ds';
import { Icon } from '@/components/Icon.jsx';
import {
  EMPTY_ADDRESS, listAddresses, createAddress, updateAddress, deleteAddress,
} from '@/services/addressService';
import { isNotEmpty } from '@/utils/validators';
import { maskPhone, maskCep } from '@/utils/masks';
import { useIsMobile } from '@/hooks/useMediaQuery';

function FieldRow({ cols, children }) {
  const isMobile = useIsMobile();
  // No celular os campos empilham (uma coluna) para não ficarem espremidos.
  return <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : cols, gap: 12 }}>{children}</div>;
}

/** Monta o endereço em até duas linhas para exibição no cartão. */
function formatAddressLines(a) {
  const linha1 = [a.address, a.number].filter(Boolean).join(', ');
  const linha2 = [[a.city, a.state].filter(Boolean).join(' — '), a.cep].filter(Boolean).join(' · ');
  return [linha1, linha2].filter(Boolean);
}

function validate(form) {
  const e = {};
  if (!isNotEmpty(form.firstName)) e.firstName = 'Obrigatório';
  if (!isNotEmpty(form.lastName)) e.lastName = 'Obrigatório';
  if (!isNotEmpty(form.phone)) e.phone = 'Obrigatório';
  if (!isNotEmpty(form.cep)) e.cep = 'Obrigatório';
  if (!isNotEmpty(form.address)) e.address = 'Obrigatório';
  if (!isNotEmpty(form.number)) e.number = 'Obrigatório';
  if (!isNotEmpty(form.city)) e.city = 'Obrigatório';
  if (!isNotEmpty(form.state)) e.state = 'Obrigatório';
  return e;
}

export function AddressBook({ userId, selectable = false, selectedId = null, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // editingId: id em edição | 'new' | null (modo lista)
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const notifySelect = useCallback((addr) => { if (onSelect) onSelect(addr); }, [onSelect]);

  // Carrega os endereços e, no modo seleção, pré-seleciona o primeiro.
  useEffect(() => {
    let active = true;
    if (!userId) { setLoading(false); return undefined; }
    (async () => {
      try {
        const list = await listAddresses(userId);
        if (!active) return;
        setAddresses(list);
        if (list.length === 0) {
          setEditingId('new'); setForm(EMPTY_ADDRESS);
        } else if (selectable) {
          notifySelect(list[0]);
        }
      } catch (err) {
        console.error('Falha ao carregar endereços:', err);
        if (active) setLoadError('Não foi possível carregar seus endereços.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const startAdd = () => { setForm(EMPTY_ADDRESS); setEditingId('new'); setErrors({}); };
  const startEdit = (addr) => { setForm(addr); setEditingId(addr.id); setErrors({}); };
  const cancel = () => { setEditingId(null); setErrors({}); };

  async function handleSave() {
    const e = validate(form);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      const saved = editingId === 'new'
        ? await createAddress(userId, form)
        : await updateAddress(editingId, userId, form);
      const list = await listAddresses(userId);
      setAddresses(list);
      setEditingId(null);
      if (selectable) notifySelect(saved);
    } catch (err) {
      console.error('Falha ao salvar endereço:', err);
      setErrors({ submit: 'Não foi possível salvar o endereço. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(addr) {
    try {
      await deleteAddress(addr.id);
      const list = await listAddresses(userId);
      setAddresses(list);
      if (selectable && selectedId === addr.id) notifySelect(list[0] ?? null);
      if (list.length === 0) startAdd();
    } catch (err) {
      console.error('Falha ao remover endereço:', err);
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner size={32} /></div>;
  }

  // ── Formulário (adicionar/editar) ──
  if (editingId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {errors.submit && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
            <Icon.AlertCircle size={18} /> <span>{errors.submit}</span>
          </div>
        )}
        <FieldRow cols="1fr 1fr">
          <Input label="Nome" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} error={errors.firstName} required />
          <Input label="Sobrenome" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} error={errors.lastName} required />
        </FieldRow>
        <FieldRow cols="1fr 1fr">
          <Input label="Telefone" value={maskPhone(form.phone)} onChange={(e) => update('phone', maskPhone(e.target.value))} error={errors.phone} placeholder="(11) 90000-0000" required />
          <Input label="CEP" value={maskCep(form.cep)} onChange={(e) => update('cep', maskCep(e.target.value))} error={errors.cep} placeholder="00000-000" required />
        </FieldRow>
        <FieldRow cols="2fr 1fr">
          <Input label="Endereço" value={form.address} onChange={(e) => update('address', e.target.value)} error={errors.address} placeholder="Rua / Avenida" required />
          <Input label="Número" value={form.number} onChange={(e) => update('number', e.target.value)} error={errors.number} required />
        </FieldRow>
        <FieldRow cols="2fr 1fr">
          <Input label="Cidade" value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} required />
          <Input label="UF" value={form.state} onChange={(e) => update('state', e.target.value)} error={errors.state} placeholder="SP" required />
        </FieldRow>
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <Button variant="primary" disabled={saving} onClick={handleSave}>{saving ? 'Salvando...' : 'Salvar endereço'}</Button>
          {addresses.length > 0 && <Button variant="ghost" disabled={saving} onClick={cancel}>Cancelar</Button>}
        </div>
      </div>
    );
  }

  // ── Lista de endereços ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {loadError && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
          <Icon.AlertCircle size={18} /> <span>{loadError}</span>
        </div>
      )}
      {addresses.map((addr) => {
        const selected = selectable && selectedId === addr.id;
        return (
          <div
            key={addr.id}
            onClick={selectable ? () => notifySelect(addr) : undefined}
            role={selectable ? 'radio' : undefined}
            aria-checked={selectable ? selected : undefined}
            tabIndex={selectable ? 0 : undefined}
            onKeyDown={selectable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); notifySelect(addr); } } : undefined}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18,
              border: `1.5px solid ${selected ? 'var(--color-primary-600)' : 'var(--color-gray-200)'}`,
              borderRadius: 'var(--radius-md)',
              background: selected ? 'var(--color-primary-50)' : '#fff',
              cursor: selectable ? 'pointer' : 'default',
              transition: 'all var(--transition-fast)',
            }}
          >
            {selectable && (
              <span style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)', border: `2px solid ${selected ? 'var(--color-primary-600)' : 'var(--color-gray-300)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                {selected && <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-600)' }} />}
              </span>
            )}
            {!selectable && <Icon.MapPin size={22} style={{ color: 'var(--color-primary-700)', flexShrink: 0, marginTop: 2 }} />}
            <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
              <strong style={{ color: 'var(--color-gray-900)' }}>{addr.firstName} {addr.lastName}</strong>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginTop: 4 }}>
                {formatAddressLines(addr).map((line, i) => <span key={i}>{line}<br /></span>)}
                {addr.phone && <span style={{ color: 'var(--color-gray-500)' }}>{addr.phone}</span>}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button type="button" onClick={(e) => { e.stopPropagation(); startEdit(addr); }} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(addr); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}><Icon.Trash size={14} /> Remover</button>
            </div>
          </div>
        );
      })}
      <div><Button variant="secondary" onClick={startAdd}><Icon.Plus size={16} /> Adicionar endereço</Button></div>
    </div>
  );
}

export default AddressBook;
