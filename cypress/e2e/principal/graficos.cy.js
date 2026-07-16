// Gráficos — Verificar que los canvas de charts.js se renderizan
describe('Gráficos del Dashboard', () => {
  beforeEach(() => {
    cy.loginAsTeacher()
    cy.visit('/principal')
  })

  it('CDS-GRAF-01: Renderiza canvas de Rendimiento por Alumno', () => {
    cy.get('canvas').should('have.length.at.least', 1)
  })

  it('CDS-GRAF-02: Renderiza sección de Resumen General', () => {
    cy.contains('Resumen General').should('be.visible')
  })

  it('CDS-GRAF-03: Renderiza sección Promedios por Curso', () => {
    cy.contains('Promedios por Curso').should('be.visible')
  })
})
