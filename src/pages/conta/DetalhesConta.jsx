// src/pages/conta/DetalhesConta.jsx
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import useAuthStore from '@/store/authStore'
import { updateProfile } from '@/services/authService'
import styles from './ContaPages.module.css'

function DetalhesConta() {
  const { user, setUser } = useAuthStore()

  const [form, setForm] = useState({
    firstName:   user?.user_metadata?.full_name?.split(' ')[0] ?? '',
    lastName:    user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? '',
    displayName: user?.user_metadata?.display_name ?? '',
    email:       user?.email ?? '',
    currentPwd:  '',
    newPwd:      '',
    confirmPwd:  '',
  })

  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setSuccess(false)
  }

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Campo obrigatório.'
    if (!form.lastName.trim())  errs.lastName  = 'Campo obrigatório.'
    if (!form.displayName.trim()) errs.displayName = 'Campo obrigatório.'
    if (!form.email.includes('@')) errs.email = 'E-mail inválido.'
    if (form.newPwd && form.newPwd.length < 6) errs.newPwd = 'Mínimo de 6 caracteres.'
    if (form.newPwd !== form.confirmPwd) errs.confirmPwd = 'Senhas não conferem.'
    return errs
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim()
      const updated  = await updateProfile({ fullName, email: form.email })
      setUser(updated.user)
      setSuccess(true)
      setForm((f) => ({ ...f, currentPwd: '', newPwd: '', confirmPwd: '' }))
    } catch (err) {
      setErrors({ submit: err.message ?? 'Erro ao salvar.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Detalhes da conta</h2>

      {success && (
        <div className={styles.successBanner} role="status">
          <CheckCircle size={16} aria-hidden="true" />
          Dados atualizados com sucesso!
        </div>
      )}

      {errors.submit && (
        <div className={styles.errorBanner} role="alert">{errors.submit}</div>
      )}

      <form onSubmit={handleSave} className={styles.accountForm} noValidate>
        <div className={styles.formRow}>
          <Input label="Nome" required value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            error={errors.firstName} autoComplete="given-name" />
          <Input label="Sobrenome" required value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            error={errors.lastName} autoComplete="family-name" />
        </div>

        <Input label="Nome de exibição" required value={form.displayName}
          onChange={(e) => update('displayName', e.target.value)}
          error={errors.displayName}
          helperText="Como seu nome será exibido na loja e nas avaliações." />

        <Input label="Endereço de e-mail" type="email" required value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email} autoComplete="email" />

        <hr className={styles.divider} />
        <h3 className={styles.subsectionTitle}>Alterar senha</h3>

        <Input label="Senha atual" type="password" value={form.currentPwd}
          onChange={(e) => update('currentPwd', e.target.value)}
          helperText="Deixe em branco para não alterar." autoComplete="current-password" />
        <Input label="Nova senha" type="password" value={form.newPwd}
          onChange={(e) => update('newPwd', e.target.value)}
          error={errors.newPwd} autoComplete="new-password"
          helperText="Mínimo de 6 caracteres." />
        <Input label="Confirmar nova senha" type="password" value={form.confirmPwd}
          onChange={(e) => update('confirmPwd', e.target.value)}
          error={errors.confirmPwd} autoComplete="new-password" />

        <Button type="submit" variant="primary" size="md" isLoading={loading}>
          Salvar alterações
        </Button>
      </form>
    </div>
  )
}

export default DetalhesConta
