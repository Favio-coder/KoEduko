// Actividades vista estudiante
describe('Actividades — Estudiante', () => {
  beforeEach(() => {
    cy.loginAsStudent()
    cy.visit('/actividades')
  })

  it('CDS-ACT-02: Vista estudiante carga correctamente', () => {
    cy.url().should('include', '/actividades')
  })
})
