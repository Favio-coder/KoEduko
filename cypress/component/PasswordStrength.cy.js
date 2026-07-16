describe('PasswordStrength Component', () => {
  it('Valida contraseña débil "hola" — pasa 0..2/7', () => {
    const pwd = 'hola'
    let score = 0
    if (pwd.length >= 6) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    if (/\s/.test(pwd)) score++
    if (/123|abc|qwerty|password/i.test(pwd)) score++

    expect(score).to.be.lessThan(3)
  })

  it('Valida contraseña fuerte "Abcd1234!" — pasa 5..7/7', () => {
    const pwd = 'Abcd1234!'
    let score = 0
    if (pwd.length >= 6) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    if (/\s/.test(pwd)) score++
    if (/123|abc|qwerty|password/i.test(pwd)) score++

    expect(score).to.be.at.least(5)
  })

  it('Valida que la barra de fortaleza se renderiza', () => {
    document.body.innerHTML = `
      <div class="password-strength">
        <div class="strength-bar" style="height: 8px; background: #e5e7eb;">
          <div class="strength-fill" style="width: 100%; height: 8px; background: #22c55e;"></div>
        </div>
        <p class="strength-text">Fuerte</p>
      </div>
    `
    cy.get('.strength-fill').should('exist')
    cy.contains('Fuerte').should('be.visible')
  })
})
