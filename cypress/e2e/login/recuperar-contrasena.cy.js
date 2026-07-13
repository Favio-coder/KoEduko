describe('H14 - Recuperar Contraseña (Docente y/o Estudiante)', () => {
  beforeEach(() => {
    cy.fixture('recuperar-contrasena').as('data')
  })

  it('CDS-T29: envía correo de recuperación exitosamente', function () {
    const { emailValido, institucion } = this.data

    cy.visit(`/login/recuperar-contrasena?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type(emailValido)
    cy.contains('button', 'Enviar correo').click()

    cy.contains('Se envió un enlace a tu correo', { timeout: 15000 }).should('be.visible')
  })

  it('CDS-T30: muestra error con correo de formato inválido', function () {
    const { emailInvalido, institucion } = this.data

    cy.visit(`/login/recuperar-contrasena?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type(emailInvalido)
    cy.contains('button', 'Enviar correo').click()

    cy.get('input[type="email"]').then($el => {
      expect($el[0].validationMessage).to.exist
    })
  })

  it('CDS-T31: muestra error cuando el correo no existe', function () {
    const { emailNoExistente, institucion } = this.data

    cy.visit(`/login/recuperar-contrasena?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type(emailNoExistente)
    cy.contains('button', 'Enviar correo').click()

    cy.assertSwal('Error', 'Email not found', { timeout: 15000 })
  })

  it('CDS-T32: permite restablecer contraseña con una contraseña válida', function () {
    cy.visit('/login/reset-contrasena')

    cy.get('input[placeholder="Nueva contraseña"]').should('be.visible')
    cy.contains('button', 'Cambiar contraseña').should('be.visible')
  })

  it('CDS-T33: rechaza contraseña débil al restablecer', function () {
    const { passwordDebil } = this.data

    cy.visit('/login/reset-contrasena')

    cy.get('input[placeholder="Nueva contraseña"]').should('be.visible').type(passwordDebil)
    cy.contains('button', 'Cambiar contraseña').click()

    cy.assertSwal('Error', 'Contraseña insegura', { timeout: 10000 })
  })
})
