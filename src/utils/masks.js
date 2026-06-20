// src/utils/masks.js
// Máscaras de formatação para campos de cadastro (pt-BR). Cada função recebe um
// valor cru (ou já formatado) e devolve a string formatada — são idempotentes,
// então podem ser usadas tanto no onChange quanto na exibição do valor.

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

function formatCpf(d) {
  let out = d.slice(0, 3);
  if (d.length > 3) out += '.' + d.slice(3, 6);
  if (d.length > 6) out += '.' + d.slice(6, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}

function formatCnpj(d) {
  let out = d.slice(0, 2);
  if (d.length > 2) out += '.' + d.slice(2, 5);
  if (d.length > 5) out += '.' + d.slice(5, 8);
  if (d.length > 8) out += '/' + d.slice(8, 12);
  if (d.length > 12) out += '-' + d.slice(12, 14);
  return out;
}

/** CPF (000.000.000-00) até 11 dígitos; CNPJ (00.000.000/0000-00) acima disso. */
export function maskCpfCnpj(value) {
  const d = onlyDigits(value).slice(0, 14);
  return d.length <= 11 ? formatCpf(d) : formatCnpj(d);
}

/** Telefone: (00) 0000-0000 (fixo) ou (00) 00000-0000 (celular). */
export function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (d.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

/** CEP: 00000-000. */
export function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** E-mail: remove espaços e normaliza para minúsculas. */
export function maskEmail(value) {
  return String(value ?? '').replace(/\s+/g, '').toLowerCase();
}
