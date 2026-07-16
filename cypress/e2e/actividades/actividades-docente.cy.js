// Actividades vista docente
describe('Actividades — Docente', () => {
  beforeEach(() => {
    cy.loginAsTeacher()
    cy.visit('/actividades')
  })

  it('CDS-ACT-01: Vista docente carga correctamente', () => {
    cy.url().should('include', '/actividades')
  })
})
