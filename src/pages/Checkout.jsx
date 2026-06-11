// src/pages/Checkout.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronDown, CreditCard, Truck, Wallet, MapPin, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Spinner from '@/components/ui/Spinner/Spinner'
import useCartStore from '@/store/cartStore'
import useAuthStore from '@/store/authStore'
import { createPreference } from '@/lib/mercadopago'
import { getDefaultAddress } from '@/services/addressService'
import { formatPrice } from '@/utils/formatters'
import styles from './Checkout.module.css'

const PAYMENT_METHODS = [
  { id: 'mercadopago', label: 'Mercado Pago (cartão, PIX, boleto)', icon: Wallet,
    desc: 'Você será redirecionado ao ambiente seguro do Mercado Pago para concluir o pagamento (cartão de crédito/débito, PIX ou boleto).' },
  { id: 'transfer', label: 'Transferência bancária', icon: CreditCard,
    desc: 'Faça seu pagamento diretamente em nossa conta bancária. Informe o ID do pedido como identificação.' },
  { id: 'delivery', label: 'Pagamento na entrega',  icon: Truck,
    desc: 'Pagar em dinheiro na entrega.' },
]

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function Checkout() {
  const navigate   = useNavigate()
  const { user }   = useAuthStore()
  const items      = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const clearCart  = useCartStore((s) => s.clearCart)

  const [form, setForm] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] ?? '',
    lastName:  user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? '',
    company: '', country: 'Brasil', address: '', number: '',
    city: '', state: '', cep: '', phone: '',
    email: user?.email ?? '',
    notes: '',
  })
  const [errors,  setErrors]  = useState({})
  const [payment, setPayment] = useState('mercadopago')
  const [agreed,  setAgreed]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [payError, setPayError] = useState(null)
  const [coupon,  setCoupon]  = useState({ open: false, code: '' })

  // Endereço salvo do usuário logado: carregado do banco e usado para
  // pré-preencher o checkout, dispensando o cadastro manual.
  const [savedAddress,    setSavedAddress]    = useState(null)
  const [addressLoading,  setAddressLoading]  = useState(Boolean(user))
  const [editingAddress,  setEditingAddress]  = useState(false)

  useEffect(() => {
    if (!user?.id) { setAddressLoading(false); return }
    let active = true
    ;(async () => {
      try {
        const addr = await getDefaultAddress(user.id)
        if (!active || !addr) return
        setSavedAddress(addr)
        // Mescla o endereço salvo no formulário (sem sobrescrever o que o
        // usuário já tenha digitado nem os dados de nome/e-mail da conta).
        setForm((f) => ({
          ...f,
          firstName: f.firstName || addr.firstName,
          lastName:  f.lastName  || addr.lastName,
          company:   f.company   || addr.company,
          country:   addr.country || f.country,
          address:   f.address   || addr.address,
          number:    f.number    || addr.number,
          city:      f.city      || addr.city,
          state:     f.state     || addr.state,
          cep:       f.cep       || addr.cep,
          phone:     f.phone     || addr.phone,
        }))
      } catch {
        // Falha silenciosa: cai para o formulário de cadastro manual.
      } finally {
        if (active) setAddressLoading(false)
      }
    })()
    return () => { active = false }
  }, [user?.id])

  // Mostra o endereço como descrição (somente leitura) quando há um endereço
  // salvo e o usuário não optou por editá-lo.
  const showSavedAddress = Boolean(savedAddress) && !editingAddress

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const required = ['firstName','lastName','address','city','state','cep','phone','email']
    const errs = {}
    required.forEach((f) => { if (!form[f].trim()) errs[f] = 'Campo obrigatório.' })
    if (form.email && !form.email.includes('@')) errs.email = 'E-mail inválido.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setPayError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Endereço salvo incompleto: revela o formulário para o usuário corrigir.
      if (showSavedAddress) setEditingAddress(true)
      return
    }
    if (!agreed) { setErrors({ agreed: 'Você precisa aceitar os termos.' }); return }

    const order = {
      number:  Math.floor(Math.random() * 90000) + 10000,
      date:    new Date().toISOString(),
      items,
      total:   totalPrice(),
      payment,
      address: form,
    }

    setLoading(true)

    // ── Pagamento via Mercado Pago: cria a preference e redireciona ──
    if (payment === 'mercadopago') {
      try {
        const { initPoint } = await createPreference({
          items,
          payer: {
            name: form.firstName,
            surname: form.lastName,
            email: form.email,
            phone: { number: form.phone },
          },
          externalReference: order.number,
        })
        // Guarda o pedido para a página de confirmação ler após o retorno
        sessionStorage.setItem('tads-pending-order', JSON.stringify(order))
        // Redireciona para o checkout hospedado do Mercado Pago
        window.location.href = initPoint
        return
      } catch (err) {
        setLoading(false)
        setPayError(err.message)
        return
      }
    }

    // ── Demais métodos (simulados) ──
    await new Promise((r) => setTimeout(r, 800))
    clearCart()
    navigate('/pedido-recebido', { state: { order } })
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Seu carrinho está vazio.</p>
        <Link to="/produtos"><Button>Ver produtos</Button></Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Checkout</h1>

        {/* Cupom */}
        <div className={styles.couponBanner}>
          <button
            className={styles.couponToggle}
            onClick={() => setCoupon((c) => ({ ...c, open: !c.open }))}
            aria-expanded={coupon.open}
          >
            <ChevronDown size={16} className={coupon.open ? styles.chevronUp : ''} aria-hidden="true" />
            Você tem um cupom de desconto? Clique aqui para inserir seu código.
          </button>
          {coupon.open && (
            <div className={styles.couponInput}>
              <input
                type="text"
                placeholder="Código do cupom"
                value={coupon.code}
                onChange={(e) => setCoupon((c) => ({ ...c, code: e.target.value }))}
                className={styles.couponField}
                aria-label="Código do cupom"
              />
              <Button variant="secondary" size="sm">Aplicar</Button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            {/* ── Formulário ── */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Detalhes de faturamento</h2>

              {addressLoading ? (
                <Spinner message="Carregando seu endereço..." />
              ) : showSavedAddress ? (
                /* ── Endereço já cadastrado: apenas a descrição ── */
                <div className={styles.savedAddress}>
                  <div className={styles.savedAddressHeader}>
                    <span className={styles.savedAddressBadge}>
                      <MapPin size={16} aria-hidden="true" /> Endereço cadastrado
                    </span>
                    <button
                      type="button"
                      className={styles.changeAddressBtn}
                      onClick={() => setEditingAddress(true)}
                    >
                      <Pencil size={14} aria-hidden="true" /> Editar
                    </button>
                  </div>
                  <address className={styles.savedAddressLines}>
                    <p className={styles.savedAddressName}>{form.firstName} {form.lastName}</p>
                    {form.company && <p>{form.company}</p>}
                    <p>{form.address}{form.number ? `, ${form.number}` : ''}</p>
                    <p>
                      {form.city}{form.state ? ` — ${form.state}` : ''}
                      {form.cep ? ` · ${form.cep}` : ''}
                    </p>
                    <p>{form.country}</p>
                    {form.phone && <p>{form.phone}</p>}
                    {form.email && <p>{form.email}</p>}
                  </address>
                  <p className={styles.savedAddressHint}>
                    Confira os dados acima. Para entregar em outro endereço, clique em “Editar”.
                  </p>
                </div>
              ) : (
                /* ── Formulário de endereço (visitante ou edição) ── */
                <>
                  <div className={styles.formGrid}>
                    <Input label="Nome" required value={form.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      error={errors.firstName} autoComplete="given-name" />
                    <Input label="Sobrenome" required value={form.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      error={errors.lastName} autoComplete="family-name" />
                  </div>

                  <Input label="Nome da empresa" value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    helperText="Opcional" autoComplete="organization" />

                  <div className={styles.formRow}>
                    <label htmlFor="country" className={styles.selectLabel}>País <span className={styles.req}>*</span></label>
                    <select id="country" value={form.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className={styles.select}>
                      <option>Brasil</option>
                    </select>
                  </div>

                  <Input label="Endereço" required value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    error={errors.address} autoComplete="street-address" />
                  <Input label="Número / Complemento" value={form.number}
                    onChange={(e) => updateField('number', e.target.value)} />

                  <div className={styles.formGrid}>
                    <Input label="Cidade" required value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      error={errors.city} autoComplete="address-level2" />

                    <div className={styles.formRow}>
                      <label htmlFor="state" className={styles.selectLabel}>Estado <span className={styles.req}>*</span></label>
                      <select id="state" value={form.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className={`${styles.select} ${errors.state ? styles.selectError : ''}`}>
                        <option value="">Selecione...</option>
                        {ESTADOS_BR.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className={styles.fieldError}>{errors.state}</p>}
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <Input label="CEP" required value={form.cep}
                      onChange={(e) => updateField('cep', e.target.value)}
                      error={errors.cep} autoComplete="postal-code" placeholder="00000-000" />
                    <Input label="Telefone" required value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      error={errors.phone} autoComplete="tel" placeholder="(11) 99999-9999" />
                  </div>

                  <Input label="E-mail" type="email" required value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email} autoComplete="email" />

                  {savedAddress && (
                    <button
                      type="button"
                      className={styles.changeAddressBtn}
                      onClick={() => setEditingAddress(false)}
                    >
                      Usar endereço cadastrado
                    </button>
                  )}
                </>
              )}

              <div className={styles.notesSection}>
                <h2 className={styles.sectionTitle}>Informação adicional</h2>
                <div className={styles.formRow}>
                  <label htmlFor="notes" className={styles.selectLabel}>Notas do pedido</label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Notas sobre o pedido, ex.: informações especiais sobre entrega."
                  />
                </div>
              </div>
            </div>

            {/* ── Resumo ── */}
            <aside className={styles.orderSummary} aria-label="Resumo do pedido">
              <h2 className={styles.sectionTitle}>Seu pedido</h2>

              <table className={styles.orderTable}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th className={styles.thRight}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.id}-${item.selectedSize}`}>
                      <td>{item.title} × {item.quantity}</td>
                      <td className={styles.tdRight}>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Subtotal</td>
                    <td className={styles.tdRight}>{formatPrice(totalPrice())}</td>
                  </tr>
                  <tr className={styles.totalRow}>
                    <td><strong>Total</strong></td>
                    <td className={styles.tdRight}><strong>{formatPrice(totalPrice())}</strong></td>
                  </tr>
                </tfoot>
              </table>

              {/* Pagamento */}
              <div className={styles.paymentSection}>
                <h3 className={styles.paymentTitle}>Método de pagamento</h3>
                <div className={styles.paymentMethods} role="group" aria-label="Métodos de pagamento">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                    <label key={id} className={`${styles.paymentOption} ${payment === id ? styles.activePayment : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={payment === id}
                        onChange={() => setPayment(id)}
                        className={styles.radioInput}
                      />
                      <Icon size={16} aria-hidden="true" />
                      <span>{label}</span>
                      {payment === id && <p className={styles.paymentDesc}>{desc}</p>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Termos */}
              <label className={`${styles.termsLabel} ${errors.agreed ? styles.termsError : ''}`}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors((er) => ({ ...er, agreed: undefined })) }}
                  className={styles.checkbox}
                />
                Li e concordo com os{' '}
                <Link to="/termos" className={styles.termsLink}>termos e condições</Link>
                {' '}do site. <span className={styles.req}>*</span>
              </label>
              {errors.agreed && <p className={styles.fieldError}>{errors.agreed}</p>}

              {payError && (
                <p className={styles.fieldError} role="alert">{payError}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={!agreed}
              >
                {payment === 'mercadopago' ? 'Pagar com Mercado Pago' : 'Finalizar compra'}
              </Button>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
