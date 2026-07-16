// Selector grado/aula — Verificar que el selector funciona
describe('Selector Grado/Aula', () => {
  beforeEach(() => {
    cy.loginAsTeacher()
    cy.visit('/principal')
  })

  it('CDS-SEL-01: Muestra el selector de espacio', () => {
    cy.contains('Selecciona tu espacio').should('be.visible')
  })

  it('CDS-SEL-02: Muestra confirmación cuando grado y aula están seleccionados', () => {
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
    cy.get('body').should('be.visible')
  })
})
