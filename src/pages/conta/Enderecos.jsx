// src/pages/conta/Enderecos.jsx
import { useEffect, useState } from 'react'
import { Edit2, Save, X, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Spinner from '@/components/ui/Spinner/Spinner'
import useAuthStore from '@/store/authStore'
import { getAddresses, saveAddress, EMPTY_ADDRESS } from '@/services/addressService'
import styles from './ContaPages.module.css'

function AddressBlock({ title, data, saving, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState(data)

  // Sincroniza o formulário sempre que o endereço carrega/atualiza do banco
  useEffect(() => { setForm(data) }, [data])

  async function handleSave() {
    const ok = await onSave(form)
    if (ok) setEditing(false)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  if (!editing) {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ')
    const hasData  = Boolean(fullName || data.address || data.city || data.cep || data.phone)
    return (
      <div className={styles.addressBlock}>
        <div className={styles.addressHeader}>
          <h3 className={styles.addressTitle}>{title}</h3>
          <button className={styles.editBtn} onClick={() => setEditing(true)} aria-label={`Editar ${title}`}>
            <Edit2 size={14} aria-hidden="true" /> Editar
          </button>
        </div>
        {hasData ? (
          <address className={styles.addressDisplay}>
            {fullName     && <p>{fullName}</p>}
            {data.company && <p>{data.company}</p>}
            {data.address && <p>{data.address}{data.number ? `, ${data.number}` : ''}</p>}
            {data.city    && <p>{data.city}{data.state ? ` — ${data.state}` : ''}</p>}
            {data.cep     && <p>{data.cep}</p>}
            {data.country && <p>{data.country}</p>}
            {data.phone   && <p>{data.phone}</p>}
          </address>
        ) : (
          <p className={styles.noAddress}>Nenhum endereço cadastrado.</p>
        )}
      </div>
    )
  }

  return (
    <div className={styles.addressBlock}>
      <div className={styles.addressHeader}>
        <h3 className={styles.addressTitle}>{title}</h3>
        <button
          className={styles.cancelBtn}
          onClick={() => { setForm(data); setEditing(false) }}
          aria-label="Cancelar edição"
        >
          <X size={14} aria-hidden="true" /> Cancelar
        </button>
      </div>
      <div className={styles.addressForm}>
        <div className={styles.formRow}>
          <Input label="Nome" value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)} autoComplete="given-name" />
          <Input label="Sobrenome" value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)} autoComplete="family-name" />
        </div>
        <Input label="Empresa (opcional)" value={form.company}
          onChange={(e) => update('company', e.target.value)} autoComplete="organization" />
        <Input label="Endereço" value={form.address}
          onChange={(e) => update('address', e.target.value)} autoComplete="street-address" />
        <Input label="Número/Complemento" value={form.number}
          onChange={(e) => update('number', e.target.value)} />
        <div className={styles.formRow}>
          <Input label="Cidade" value={form.city}
            onChange={(e) => update('city', e.target.value)} autoComplete="address-level2" />
          <Input label="Estado" value={form.state}
            onChange={(e) => update('state', e.target.value)} autoComplete="address-level1" />
        </div>
        <div className={styles.formRow}>
          <Input label="CEP" value={form.cep}
            onChange={(e) => update('cep', e.target.value)} autoComplete="postal-code" />
          <Input label="Telefone" value={form.phone}
            onChange={(e) => update('phone', e.target.value)} autoComplete="tel" />
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving}>
          <Save size={14} aria-hidden="true" /> Salvar endereço
        </Button>
      </div>
    </div>
  )
}

function Enderecos() {
  const { user } = useAuthStore()
  const [billing,  setBilling]  = useState(EMPTY_ADDRESS)
  const [shipping, setShipping] = useState(EMPTY_ADDRESS)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(null)   // 'billing' | 'shipping' | null
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(false)

  // Carrega os endereços salvos do usuário ao montar
  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    let active = true
    ;(async () => {
      try {
        const { billing: b, shipping: s } = await getAddresses(user.id)
        if (!active) return
        if (b) setBilling(b)
        if (s) setShipping(s)
      } catch {
        if (active) setError('Não foi possível carregar seus endereços.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [user?.id])

  async function handleSave(type, form) {
    setSaving(type)
    setError(null)
    setSuccess(false)
    try {
      const saved = await saveAddress({ userId: user.id, type, data: form })
      if (type === 'billing') setBilling(saved)
      else setShipping(saved)
      setSuccess(true)
      return true
    } catch {
      setError('Não foi possível salvar o endereço. Tente novamente.')
      return false
    } finally {
      setSaving(null)
    }
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Endereços</h2>
      <p className={styles.addressNote}>
        Os endereços a seguir serão usados na página de checkout por padrão.
      </p>

      {success && (
        <div className={styles.successBanner} role="status">
          <CheckCircle size={16} aria-hidden="true" /> Endereço salvo com sucesso!
        </div>
      )}
      {error && <div className={styles.errorBanner} role="alert">{error}</div>}

      {loading ? (
        <Spinner message="Carregando endereços..." />
      ) : (
        <div className={styles.addressGrid}>
          <AddressBlock
            title="Endereço de cobrança"
            data={billing}
            saving={saving === 'billing'}
            onSave={(form) => handleSave('billing', form)}
          />
          <AddressBlock
            title="Endereço de entrega"
            data={shipping}
            saving={saving === 'shipping'}
            onSave={(form) => handleSave('shipping', form)}
          />
        </div>
      )}
    </div>
  )
}

export default Enderecos
