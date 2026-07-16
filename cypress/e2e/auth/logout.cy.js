// CDS-LOGOUT-01 — Logout smoke test (real credentials)
describe('Logout', () => {
  it('Cierra sesión correctamente y redirige al home', () => {
    cy.loginReal('docente')
    cy.visit('/principal')
    cy.url({ timeout: 10000 }).should('include', '/principal')

    cy.contains('Cerrar sesión').click({ force: true })
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')
  })
})
