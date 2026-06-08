// src/pages/conta/Enderecos.jsx
import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import styles from './ContaPages.module.css'

const INITIAL_BILLING = {
  name: '', company: '', address: '', number: '',
  city: '', state: '', cep: '', country: 'Brasil',
}
const INITIAL_SHIPPING = { ...INITIAL_BILLING }

function AddressBlock({ title, data, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState(data)

  function handleSave() {
    onSave(form)
    setEditing(false)
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  if (!editing) {
    const hasData = Object.values(data).some(Boolean)
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
            {data.name    && <p>{data.name}</p>}
            {data.company && <p>{data.company}</p>}
            {data.address && <p>{data.address}{data.number ? `, ${data.number}` : ''}</p>}
            {data.city    && <p>{data.city}{data.state ? ` — ${data.state}` : ''}</p>}
            {data.country && <p>{data.country}</p>}
            {data.cep     && <p>{data.cep}</p>}
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
        <button className={styles.cancelBtn} onClick={() => setEditing(false)} aria-label="Cancelar edição">
          <X size={14} aria-hidden="true" /> Cancelar
        </button>
      </div>
      <div className={styles.addressForm}>
        <Input label="Nome completo" value={form.name}
          onChange={(e) => update('name', e.target.value)} />
        <Input label="Empresa (opcional)" value={form.company}
          onChange={(e) => update('company', e.target.value)} />
        <Input label="Endereço" value={form.address}
          onChange={(e) => update('address', e.target.value)} />
        <Input label="Número/Complemento" value={form.number}
          onChange={(e) => update('number', e.target.value)} />
        <div className={styles.formRow}>
          <Input label="Cidade" value={form.city}
            onChange={(e) => update('city', e.target.value)} />
          <Input label="Estado" value={form.state}
            onChange={(e) => update('state', e.target.value)} />
        </div>
        <Input label="CEP" value={form.cep}
          onChange={(e) => update('cep', e.target.value)} />
        <Button variant="primary" size="sm" onClick={handleSave}>
          <Save size={14} aria-hidden="true" /> Salvar endereço
        </Button>
      </div>
    </div>
  )
}

function Enderecos() {
  const [billing,  setBilling]  = useState(INITIAL_BILLING)
  const [shipping, setShipping] = useState(INITIAL_SHIPPING)

  return (
    <div>
      <h2 className={styles.sectionTitle}>Endereços</h2>
      <p className={styles.addressNote}>
        Os endereços a seguir serão usados na página de checkout por padrão.
      </p>
      <div className={styles.addressGrid}>
        <AddressBlock title="Endereço de cobrança"  data={billing}  onSave={setBilling}  />
        <AddressBlock title="Endereço de entrega"   data={shipping} onSave={setShipping} />
      </div>
    </div>
  )
}

export default Enderecos
