// Resumen General — Verificar tabla con métricas
describe('Resumen General', () => {
  beforeEach(() => {
    cy.loginAsTeacher()
    cy.visit('/principal')
  })

  it('CDS-RES-01: Muestra tabla con Total Alumnos', () => {
    cy.contains('Total Alumnos').should('be.visible')
  })

  it('CDS-RES-02: Muestra Promedio General en la tabla', () => {
    cy.contains('Promedio General').should('be.visible')
  })

  it('CDS-RES-03: Muestra Tasa de Aprobación', () => {
    cy.contains('Tasa de Aprobación').should('be.visible')
  })
})
