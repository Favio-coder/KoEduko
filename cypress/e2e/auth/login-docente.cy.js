// CDS-T24 — Login docente exitoso (smoke test with real credentials)
describe('Login Docente', () => {
  it('CDS-T24: Inicia sesión como docente y ve el dashboard', () => {
    cy.loginReal('docente')
    cy.get('h1').should('contain', 'Bienvenido')
    cy.contains('Favio').should('be.visible')
  })
})
