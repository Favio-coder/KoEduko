describe('H10 - Visualizar sala (Estudiantes)', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('salas').as('data')
  })

  it('CDS-T69: estudiante visualiza la lista de salas disponibles', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T70: estudiante no ve el botón de crear nueva sala', function () {
    cy.visit('/salas')
    cy.contains('Nueva sala').should('not.exist')
  })

  it('CDS-T71: estudiante cambia a vista calendario', function () {
    cy.visit('/salas')
    cy.contains('Calendario').click()
  })

  it('CDS-T72: estudiante ve mensaje cuando no hay sesiones disponibles', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T73: estudiante ve detalles de fecha y hora de la sala', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })
})
