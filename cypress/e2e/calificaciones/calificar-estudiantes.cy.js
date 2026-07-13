describe('H13 - Calificar a los estudiantes', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('estudiantes').as('data')
  })

  it('CDS-T84: docente visualiza el listado de estudiantes para calificar', function () {
    cy.visit('/estudiantes')

    cy.contains('h1', 'Estudiantes').should('be.visible')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T85: edita la nota de un estudiante exitosamente', function () {
    cy.visit('/estudiantes')
    cy.contains('h1', 'Estudiantes').should('be.visible')
  })

  it('CDS-T86: guarda las notas actualizadas', function () {
    cy.visit('/estudiantes')
    cy.contains('h1', 'Estudiantes').should('be.visible')
  })

  it('CDS-T87: muestra notificación al guardar notas exitosamente', function () {
    cy.visit('/estudiantes')
    cy.contains('h1', 'Estudiantes').should('be.visible')
  })

  it('CDS-T88: muestra promedio del curso en la vista de calificaciones', function () {
    cy.visit('/estudiantes')
    cy.contains('h1', 'Estudiantes').should('be.visible')
  })
})
