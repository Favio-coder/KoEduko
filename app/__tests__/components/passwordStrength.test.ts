import { describe, it, expect } from 'vitest'

function getPasswordRules() {
  return [
    { label: '12+ caracteres', test: (p: string) => p.length >= 12 },
    { label: 'Mayúscula', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Minúscula', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Número', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Caracter especial', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
    { label: 'Sin espacios', test: (p: string) => !/\s/.test(p) },
    { label: 'Sin secuencias comunes', test: (p: string) => !/(123|abc|qwerty|asdf|password|admin|123456)/i.test(p) },
  ]
}

function checkPasswordStrength(password: string) {
  const rules = getPasswordRules()
  return rules.map(r => ({ ...r, passed: r.test(password) }))
}

describe('PasswordStrength (OWASP)', () => {
  it('contraseña corta falla regla de 12+ caracteres', () => {
    const results = checkPasswordStrength('F@vio2')
    const rule = results.find(r => r.label === '12+ caracteres')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña sin mayúscula falla regla Mayúscula', () => {
    const results = checkPasswordStrength('f@vio2005ast')
    const rule = results.find(r => r.label === 'Mayúscula')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña sin número falla regla Número', () => {
    const results = checkPasswordStrength('F@vioABCdef!')
    const rule = results.find(r => r.label === 'Número')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña sin especial falla regla Caracter especial', () => {
    const results = checkPasswordStrength('Favio2005Ast')
    const rule = results.find(r => r.label === 'Caracter especial')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña con espacios falla regla Sin espacios', () => {
    const results = checkPasswordStrength('F@vio 2005 Ast')
    const rule = results.find(r => r.label === 'Sin espacios')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña con secuencia común "123" falla', () => {
    const results = checkPasswordStrength('Test123!@#pass')
    const rule = results.find(r => r.label === 'Sin secuencias comunes')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña con secuencia "password" falla', () => {
    const results = checkPasswordStrength('F@vioPassword2005')
    const rule = results.find(r => r.label === 'Sin secuencias comunes')
    expect(rule?.passed).toBe(false)
  })

  it('contraseña válida pasa las 7 reglas', () => {
    const results = checkPasswordStrength('F@vio2005Ast')
    const allPassed = results.every(r => r.passed)
    expect(allPassed).toBe(true)
  })

  it('contraseña vacía falla reglas de contenido (longitud, mayúscula, minúscula, número, especial)', () => {
    const results = checkPasswordStrength('')
    const contentRules = results.filter(r =>
      ['12+ caracteres', 'Mayúscula', 'Minúscula', 'Número', 'Caracter especial'].includes(r.label)
    )
    const allContentFailed = contentRules.every(r => !r.passed)
    expect(allContentFailed).toBe(true)
  })

  it('retorna objeto con label y passed para cada regla', () => {
    const results = checkPasswordStrength('Test123!@#')
    results.forEach(r => {
      expect(r).toHaveProperty('label')
      expect(r).toHaveProperty('passed')
      expect(typeof r.label).toBe('string')
      expect(typeof r.passed).toBe('boolean')
    })
  })
})
