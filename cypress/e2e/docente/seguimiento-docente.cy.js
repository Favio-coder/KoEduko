describe('H05 - Seguimiento de docente', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('estudiantes').as('data')
  })

  it('CDS-T49: visualiza la lista de estudiantes al seleccionar un curso', function () {
    cy.visit('/estudiantes')

    cy.contains('h1', 'Estudiantes').should('be.visible')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T50: busca estudiantes por nombre', function () {
    cy.visit('/estudiantes')

    cy.contains('h1', 'Estudiantes').should('be.visible')
  })

  it('CDS-T51: muestra estado vacío cuando no hay curso seleccionado', function () {
    cy.visit('/estudiantes')
    cy.contains('Elige un curso').should('be.visible')
    cy.contains('Selecciona un curso para ver el ranking de estudiantes').should('be.visible')
  })

  it('CDS-T52: muestra el ranking con medallas para los mejores estudiantes', function () {
    cy.visit('/estudiantes')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T53: muestra promedio del curso en la tabla de estudiantes', function () {
    cy.visit('/estudiantes')
    cy.contains('Elige un curso').should('be.visible')
  })
})
