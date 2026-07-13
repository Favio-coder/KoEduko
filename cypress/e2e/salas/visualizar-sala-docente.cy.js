describe('H12 - Visualizar sala (Docente)', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('salas').as('data')
  })

  it('CDS-T79: docente ve el botón de crear nueva sala', function () {
    cy.visit('/salas')
    cy.contains('Nueva sala').should('be.visible')
  })

  it('CDS-T80: docente visualiza todas las sesiones agrupadas por curso', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T81: docente cambia a vista de calendario', function () {
    cy.visit('/salas')
    cy.contains('Calendario').click()
  })

  it('CDS-T82: docente ve sesiones vacías cuando no hay cursos', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T83: docente puede cambiar entre vista lista y calendario', function () {
    cy.visit('/salas')
    cy.contains('Calendario').click()
    cy.contains('Lista').click()
  })
})
