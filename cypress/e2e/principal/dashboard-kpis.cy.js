// Dashboard KPIs — Verificar que las 4 tarjetas de métricas existen
describe('Dashboard KPIs', () => {
  beforeEach(() => {
    cy.loginAsTeacher()
    cy.mockAulasDocente([
      {
        c_aula: 'a-1',
        l_aula: 'A',
        l_desc: null,
        c_grad: 'g-1',
        l_grad: '1° Primaria',
        n_anio: 2026,
        grado_desc: null,
      },
    ])
    cy.visit('/principal')
  })

  it('CDS-KPI-01: Muestra tarjeta Total Alumnos', () => {
    cy.contains('Total Alumnos').should('be.visible')
  })

  it('CDS-KPI-02: Muestra tarjeta Promedio General', () => {
    cy.contains('Promedio General').should('be.visible')
  })

  it('CDS-KPI-03: Muestra tarjeta Tasa Aprobación', () => {
    cy.contains('Tasa Aprobación').should('be.visible')
  })

  it('CDS-KPI-04: Muestra tarjeta Mejor Estudiante', () => {
    cy.contains('Mejor Estudiante').should('be.visible')
  })
})
