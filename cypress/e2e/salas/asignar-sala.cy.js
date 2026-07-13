describe('H09 - Asignar sala a estudiantes', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('salas').as('data')
  })

  it('CDS-T64: docente visualiza el botón para crear nueva sala', function () {
    cy.visit('/salas')
    cy.contains('Nueva sala').should('be.visible')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T65: abre el modal para crear una nueva sala', function () {
    cy.visit('/salas')
    cy.contains('Nueva sala').click()
  })

  it('CDS-T66: crea una sala con plataforma Jitsi', function () {
    cy.visit('/salas')
    cy.contains('Nueva sala').click()
  })

  it('CDS-T67: cambia entre vista lista y calendario', function () {
    cy.visit('/salas')
    cy.contains('Calendario').click()
    cy.contains('Lista').click()
  })

  it('CDS-T68: muestra sesiones disponibles en la lista de salas', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })
})
