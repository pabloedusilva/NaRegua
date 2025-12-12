// Validators

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  return digits.length === 14
  // TODO: Add proper CNPJ validation algorithm
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  return digits.length === 11
  // TODO: Add proper CPF validation algorithm
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}
