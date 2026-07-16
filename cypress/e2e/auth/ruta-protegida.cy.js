// CDS-T48 — Ruta protegida redirige sin sesión
describe('Ruta Protegida', () => {
  it('Redirige a / cuando no hay sesión', () => {
    cy.visit('/principal', { failOnStatusCode: false })
    cy.url({ timeout: 10000 }).should('not.include', '/principal')
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')
  })
})
