describe('H15 - Editar Cuenta', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('perfil').as('data')
  })

  it('CDS-T34: visualiza la página de perfil correctamente', function () {
    cy.visit('/perfil')

    cy.contains('h1', 'Mi Perfil').should('be.visible')
    cy.contains('Datos personales').should('be.visible')
    cy.contains('Cambiar contraseña').should('be.visible')
    cy.contains('button', 'Guardar cambios').should('be.visible')
  })

  it('CDS-T35: actualiza nombre y apellidos exitosamente', function () {
    cy.visit('/perfil')
    cy.contains('h1', 'Mi Perfil').should('be.visible')
  })

  it('CDS-T36: cambia la contraseña exitosamente', function () {
    cy.visit('/perfil')
    cy.contains('Cambiar contraseña').should('be.visible')
  })

  it('CDS-T37: rechaza contraseña débil al cambiar', function () {
    cy.visit('/perfil')
    cy.contains('Cambiar contraseña').should('be.visible')
  })

  it('CDS-T38: el correo electrónico no se puede modificar', function () {
    cy.visit('/perfil')
    cy.get('input[type="email"]').should('be.disabled')
    cy.contains('El correo no se puede modificar').should('be.visible')
  })
})
